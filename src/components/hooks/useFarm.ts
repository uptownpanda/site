import { Farm, FarmToken } from '../../utils/enums';
import BN from 'bn.js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from '../web3-context-provider';
import UptownPandaFarmAbi from '../../contracts/UptownPandaFarmAbi';
import IERC20Abi from '../../contracts/IERC20Abi';
import Web3 from 'web3';
import { getTokenInEthPrice, getUniswapLPTokenInEthPrice } from '../../utils/uniswap';
import { Contract } from 'web3-eth-contract';

export interface IUserFarmData {
    isLoading: boolean;
    hasApproved: boolean;
    stakedAmount: BN;
    totalStakedAmount: BN;
    availableAmountForStaking: BN;
    harvestableReward: BN;
    claimableHarvestedReward: BN;
    totalHarvestedReward: BN;
    apyPercent: number;
    isApyLoading: boolean;
}

export interface IFarmData {
    isLoading: boolean;
    farmContract: Contract | null;
    farmTokenContract: Contract | null;
    hasFarmingStarted: boolean;
    totalUpSupply: BN;
    dailyUpReward: BN;
    nextHalvingTimestamp: number;
    farmToken: FarmToken;
    userData: IUserFarmData;
}

const defaultFarmData: IFarmData = {
    isLoading: true,
    farmContract: null,
    farmTokenContract: null,
    hasFarmingStarted: false,
    totalUpSupply: new BN(0),
    dailyUpReward: new BN(0),
    nextHalvingTimestamp: 0,
    farmToken: FarmToken.UP,
    userData: {
        isLoading: true,
        hasApproved: false,
        availableAmountForStaking: new BN(0),
        stakedAmount: new BN(0),
        totalStakedAmount: new BN(0),
        harvestableReward: new BN(0),
        claimableHarvestedReward: new BN(0),
        totalHarvestedReward: new BN(0),
        apyPercent: 0,
        isApyLoading: false,
    },
};

export const getFarmContractAddress = (farm: Farm) => {
    let farmAddress: string | undefined;

    switch (farm) {
        case Farm.UP:
            farmAddress = process.env.NEXT_PUBLIC_UP_FARM_CONTRACT_ADDRESS;
            break;

        case Farm.UP_ETH:
            farmAddress = process.env.NEXT_PUBLIC_UP_ETH_FARM_CONTRACT_ADDRESS;
            break;

        case Farm.WETH:
            farmAddress = process.env.NEXT_PUBLIC_WETH_FARM_CONTRACT_ADDRESS;
            break;

        case Farm.WBTC:
            farmAddress = process.env.NEXT_PUBLIC_WBTC_FARM_CONTRACT_ADDRESS;
            break;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }

    if (!farmAddress) {
        throw new Error(`Environment variable for ${farm} farm address is not defined.`);
    }

    return farmAddress;
};

const getFarmToken = (farm: Farm) => {
    switch (farm) {
        case Farm.UP:
            return FarmToken.UP;

        case Farm.UP_ETH:
            return FarmToken.UP_ETH;

        case Farm.WETH:
            return FarmToken.WETH;

        case Farm.WBTC:
            return FarmToken.WBTC;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const getApyCommonUnitMultiplier = async (web3: Web3, farm: Farm, farmTokenAddress: string) => {
    const upTokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
    if (!upTokenAddress) {
        throw new Error('$UP token address environment variable is not defined.');
    }

    switch (farm) {
        case Farm.UP:
            return 1;

        case Farm.UP_ETH:
            const upInEthForUpEthComparison = await getTokenInEthPrice(upTokenAddress);
            const upEthInEth = await getUniswapLPTokenInEthPrice(web3, farmTokenAddress);
            return upInEthForUpEthComparison / upEthInEth;

        case Farm.WETH:
            return await getTokenInEthPrice(upTokenAddress);

        case Farm.WBTC:
            const upInEthForWbtcComparison = await getTokenInEthPrice(upTokenAddress);
            const wbtcInEth = await getTokenInEthPrice(farmTokenAddress);
            return upInEthForWbtcComparison / wbtcInEth;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const getMaxApy = (farm: Farm) => {
    switch (farm) {
        case Farm.UP:
            return 60000;

        case Farm.UP_ETH:
            return 120000;

        case Farm.WETH:
        case Farm.WBTC:
            return 16000;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const getApyPercent = async (web3: Web3, farm: Farm, farmTokenAddress: string, dailyUpReward: BN, totalStake: BN) => {
    const maxApy = getMaxApy(farm);
    if (Number(Web3.utils.fromWei(totalStake)) <= 0) {
        return maxApy;
    }
    try {
        const apyCommonUnitMultiplier = await getApyCommonUnitMultiplier(web3, farm, farmTokenAddress);
        const apyPercent =
            (Number(Web3.utils.fromWei(dailyUpReward)) * 365 * 100 * apyCommonUnitMultiplier) /
            Number(Web3.utils.fromWei(totalStake));
        return Math.min(apyPercent, maxApy);
    } catch (e) {
        console.log('Error occured while calculation APY %!!!', e);
        return maxApy;
    }
};

const useFarm = (activeFarm: Farm) => {
    const [farmData, setFarmData] = useState<IFarmData>(defaultFarmData);
    const {
        isLoading: isFarmDataLoading,
        farmContract,
        farmTokenContract,
        hasFarmingStarted,
        dailyUpReward,
        userData,
    } = farmData;
    const { isLoading: isUserDataLoading, totalStakedAmount } = userData;
    const updateFarmData = useCallback(
        (updatedFarmData: Partial<IFarmData>) =>
            setFarmData((currentFarmData) => ({ ...currentFarmData, ...updatedFarmData })),
        [setFarmData]
    );
    const updateUserData = useCallback(
        (updatedUserData: Partial<IUserFarmData>) =>
            setFarmData((currentFarmData) => ({
                ...currentFarmData,
                userData: { ...currentFarmData.userData, ...updatedUserData },
            })),
        [setFarmData]
    );

    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const shouldSetFarmData = !isWeb3ContextLoading && isEthProviderAvailable && isNetworkSupported;

    // set farm data on farm switch
    useEffect(() => {
        const farmToken = getFarmToken(activeFarm);

        if (!shouldSetFarmData) {
            updateFarmData({ isLoading: false, farmToken, farmContract: null, farmTokenContract: null });
            return;
        }

        updateFarmData({ isLoading: true, farmToken });

        (async () => {
            const farmContractAddress = getFarmContractAddress(activeFarm);
            const farmContract = new web3.eth.Contract(UptownPandaFarmAbi, farmContractAddress);
            const farmTokenAddress = (await farmContract.methods.farmTokenAddress().call()) as string;
            const farmTokenContract = new web3.eth.Contract(IERC20Abi, farmTokenAddress);
            const hasFarmingStarted = (await farmContract.methods.hasFarmingStarted().call()) as boolean;
            if (!hasFarmingStarted) {
                updateFarmData({ isLoading: false, farmContract, farmTokenContract, hasFarmingStarted });
                return;
            }
            const totalUpSupply = Web3.utils.toBN(await farmContract.methods.initialFarmUpSupply().call());
            const currentIntervalTotalReward = Web3.utils.toBN(
                await farmContract.methods.currentIntervalTotalReward().call()
            );
            const rewardIntervalLengthInDays = Web3.utils.toBN(
                (await farmContract.methods.REWARD_HALVING_INTERVAL().call()) / (60 * 60 * 24)
            );
            const dailyUpReward = currentIntervalTotalReward.div(rewardIntervalLengthInDays);
            const nextHalvingTimestamp = Number(await farmContract.methods.nextIntervalTimestamp().call());
            updateFarmData({
                isLoading: false,
                hasFarmingStarted,
                farmContract,
                farmTokenContract,
                totalUpSupply,
                dailyUpReward,
                nextHalvingTimestamp,
            });
        })();
    }, [shouldSetFarmData, web3, activeFarm, updateFarmData]);

    const refreshFarmData = useCallback(
        async (showLoading: boolean) => {
            if (!farmContract || !farmTokenContract || !hasFarmingStarted) {
                return;
            }

            updateUserData({ isLoading: showLoading });

            const hasApproved = !!account
                ? Web3.utils
                      .toBN(await farmTokenContract.methods.allowance(account, farmContract.options.address).call())
                      .gt(new BN(0))
                : false;
            const availableAmountForStaking = !!account
                ? Web3.utils.toBN(await farmTokenContract.methods.balanceOf(account).call())
                : new BN(0);
            const stakedAmount = !!account
                ? Web3.utils.toBN(await farmContract.methods.balances(account).call())
                : new BN(0);
            const totalStakedAmount = Web3.utils.toBN(await farmContract.methods.totalStakedSupply().call());
            const harvestableReward = !!account
                ? Web3.utils.toBN(await farmContract.methods.harvestableReward().call({ from: account }))
                : new BN(0);
            const claimableHarvestedReward = !!account
                ? Web3.utils.toBN(await farmContract.methods.claimableHarvestedReward().call({ from: account }))
                : new BN(0);
            const totalHarvestedReward = !!account
                ? Web3.utils.toBN(await farmContract.methods.totalHarvestedReward().call({ from: account }))
                : new BN(0);

            updateUserData({
                isLoading: false,
                hasApproved,
                availableAmountForStaking,
                stakedAmount,
                totalStakedAmount,
                harvestableReward,
                claimableHarvestedReward,
                totalHarvestedReward,
            });
        },
        [farmContract, farmTokenContract, hasFarmingStarted, account, updateUserData]
    );

    // whenever refresh farm data function updates, we need to call it to get the most recent data
    useEffect(() => {
        refreshFarmData(true);
    }, [refreshFarmData]);

    // apy refresh
    useEffect(() => {
        updateUserData({ isApyLoading: true });
        if (isWeb3ContextLoading || !farmTokenContract || isFarmDataLoading || isUserDataLoading) {
            return;
        }
        (async () => {
            const apyPercent = await getApyPercent(
                web3,
                activeFarm,
                farmTokenContract.options.address,
                dailyUpReward,
                totalStakedAmount
            );
            updateUserData({ isApyLoading: false, apyPercent });
        })();
    }, [
        web3,
        farmTokenContract,
        isFarmDataLoading,
        isUserDataLoading,
        isWeb3ContextLoading,
        activeFarm,
        dailyUpReward,
        totalStakedAmount,
        updateUserData,
    ]);

    return { farmData, refreshFarmData };
};

export default useFarm;
