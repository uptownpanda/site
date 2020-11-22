import { Farm, FarmToken } from '../../utils/enums';
import BN from 'bn.js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from '../web3-context-provider';
import UptownPandaFarmAbi from '../../contracts/UptownPandaFarmAbi';
import Web3 from 'web3';

export interface IYourFarmData {
    isLoading: boolean;
    isAccountConnected: boolean;
    yourStake: BN;
    totalStake: BN;
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
    buyFarmTokensLink: string;
    yourData: IYourFarmData;
    farmToken: FarmToken;
}

const defaultFarmData: IFarmData = {
    isLoading: true,
    isDataValid: false,
    hasFarmingStarted: false,
    totalUpSupply: new BN(0),
    dailyUpReward: new BN(0),
    nextHalvingTimestamp: 0,
    farmAddress: '',
    buyFarmTokensLink: '',
    farmToken: FarmToken.UP,
    yourData: {
        isLoading: true,
        isAccountConnected: false,
        yourStake: new BN(0),
        totalStake: new BN(0),
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

const getBuyFarmTokensLink = (farm: Farm, farmTokenAddress: string) => {
    switch (farm) {
        case Farm.UP:
        case Farm.WETH:
        case Farm.WBTC:
            return `https://info.uniswap.org/token/${farmTokenAddress}`;

        case Farm.UP_ETH:
            return `https://info.uniswap.org/pair/${farmTokenAddress}`;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
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
            const buyFarmTokensLink = getBuyFarmTokensLink(activeFarm, farmTokenAddress);

            // to prevent spinner glitch
            setTimeout(
                () =>
                    updateFarmData({
                        isLoading: false,
                        isDataValid: true,
                        hasFarmingStarted,
                        totalUpSupply,
                        dailyUpReward,
                        nextHalvingTimestamp,
                        buyFarmTokensLink,
                        farmAddress,
                    }),
                500
            );
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
            const totalStake = Web3.utils.toBN(await contract.methods.totalStakedSupply().call());

            if (!account) {
                updateYourData({
                    isLoading: false,
                    isAccountConnected: false,
                    yourStake: new BN(0),
                    totalStake,
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
                totalStake,
                harvestableReward,
                claimableHarvestedReward,
            });
        })();
    }, [isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, activeFarm, account, updateYourData]);

    return farmData;
};

export default useFarm;
