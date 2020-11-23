import { Farm, FarmToken } from '../../utils/enums';
import BN from 'bn.js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from '../web3-context-provider';
import UptownPandaFarmAbi from '../../contracts/UptownPandaFarmAbi';
import Web3 from 'web3';
import { getTokenInEthPrice, getUniswapLPTokenInEthPrice } from '../../utils/uniswap';

export interface IYourFarmData {
    isLoading: boolean;
    isAccountConnected: boolean;
    yourStake: BN;
    harvestableReward: BN;
    claimableHarvestedReward: BN;
}

export interface IFarmData {
    isLoading: boolean;
    isDataValid: boolean;
    hasFarmingStarted: boolean;
    totalUpSupply: BN;
    dailyUpReward: BN;
    nextHalvingTimestamp: number;
    farmAddress: string;
    yourData: IYourFarmData;
    farmToken: FarmToken;
    farmTokenAddress: string;
    apyPercent: number;
    totalStake: BN;
}

const defaultFarmData: IFarmData = {
    isLoading: true,
    isDataValid: false,
    hasFarmingStarted: false,
    totalUpSupply: new BN(0),
    dailyUpReward: new BN(0),
    nextHalvingTimestamp: 0,
    farmAddress: '',
    farmToken: FarmToken.UP,
    farmTokenAddress: '',
    apyPercent: 0,
    totalStake: new BN(0),
    yourData: {
        isLoading: true,
        isAccountConnected: false,
        yourStake: new BN(0),
        harvestableReward: new BN(0),
        claimableHarvestedReward: new BN(0),
    },
};

const getFarmContractAddress = (farm: Farm) => {
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

const useFarm = (activeFarm: Farm): IFarmData => {
    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const [farmData, setFarmData] = useState<IFarmData>(defaultFarmData);
    const updateFarmData = useCallback(
        (updatedFarmData: Partial<IFarmData>) =>
            setFarmData((currentFarmData) => ({ ...currentFarmData, ...updatedFarmData })),
        [setFarmData]
    );
    const updateYourData = useCallback(
        (updatedYourData: Partial<IYourFarmData>) =>
            setFarmData((currentFarmData) => ({
                ...currentFarmData,
                yourData: { ...currentFarmData.yourData, ...updatedYourData },
            })),
        [setFarmData]
    );

    useEffect(() => {
        const farmToken = getFarmToken(activeFarm);
        const farmAddress = getFarmContractAddress(activeFarm);

        setFarmData({ ...defaultFarmData, isLoading: true, isDataValid: true, farmToken, farmAddress });

        if (isWeb3ContextLoading) {
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            setFarmData({ ...defaultFarmData, isLoading: false, isDataValid: false });
            return;
        }

        (async () => {
            const contract = new web3.eth.Contract(UptownPandaFarmAbi, farmAddress);

            const hasFarmingStarted = await contract.methods.hasFarmingStarted().call();
            if (!hasFarmingStarted) {
                updateFarmData({ isLoading: false, isDataValid: true, hasFarmingStarted });
                return;
            }
            const totalUpSupply = Web3.utils.toBN(await contract.methods.initialFarmUpSupply().call());
            const currentIntervalTotalReward = Web3.utils.toBN(
                await contract.methods.currentIntervalTotalReward().call()
            );
            const rewardIntervalLengthInDays = new BN(
                (await contract.methods.REWARD_HALVING_INTERVAL().call()) / (60 * 60 * 24)
            );
            const dailyUpReward = currentIntervalTotalReward.div(rewardIntervalLengthInDays);
            const farmTokenAddress = await contract.methods.farmTokenAddress().call();
            const nextHalvingTimestamp = Number(await contract.methods.nextIntervalTimestamp().call());
            const totalStake = Web3.utils.toBN(await contract.methods.totalStakedSupply().call());
            const apyPercent = await getApyPercent(web3, activeFarm, farmTokenAddress, dailyUpReward, totalStake);

            updateFarmData({
                isLoading: false,
                isDataValid: true,
                hasFarmingStarted,
                totalUpSupply,
                dailyUpReward,
                nextHalvingTimestamp,
                farmAddress,
                farmTokenAddress,
                totalStake,
                apyPercent,
            });
        })();
    }, [
        web3,
        isWeb3ContextLoading,
        isEthProviderAvailable,
        isNetworkSupported,
        activeFarm,
        setFarmData,
        updateFarmData,
    ]);

    useEffect(() => {
        if (isWeb3ContextLoading || !isEthProviderAvailable || !isNetworkSupported) {
            return;
        }

        updateYourData({ isLoading: true });

        const farmAddress = getFarmContractAddress(activeFarm);
        const contract = new web3.eth.Contract(UptownPandaFarmAbi, farmAddress);

        (async () => {
            if (!account) {
                updateYourData({
                    isLoading: false,
                    isAccountConnected: false,
                    yourStake: new BN(0),
                    harvestableReward: new BN(0),
                    claimableHarvestedReward: new BN(0),
                });
                return;
            }

            const yourStake = Web3.utils.toBN(await contract.methods.balances(account).call());
            const harvestableReward = Web3.utils.toBN(
                await contract.methods.harvestableReward().call({ from: account })
            );
            const claimableHarvestedReward = Web3.utils.toBN(
                await contract.methods.claimableHarvestedReward().call({ from: account })
            );

            updateYourData({
                isLoading: false,
                isAccountConnected: true,
                yourStake,
                harvestableReward,
                claimableHarvestedReward,
            });
        })();
    }, [isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, activeFarm, account, updateYourData]);

    return farmData;
};

export default useFarm;
