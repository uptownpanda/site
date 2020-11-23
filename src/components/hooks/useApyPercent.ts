import { Farm } from '../../utils/enums';
import BN from 'bn.js';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const getApyCommonUnitMultiplier = (farm: Farm): number => {
    switch (farm) {
        case Farm.UP:
            return 1;

        case Farm.UP_ETH:
            // get $UP in ETH
            // get Uniswap pair price... 2 * eth in pool / total supply
            return 1;

        case Farm.WETH:
            // get $UP in ETH
            return 1;

        case Farm.WBTC:
            // get $UP in ETH
            // get WBTC in ETH
            return 1;

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

const useApyPercent = (farm: Farm, isAccountDataLoading: boolean, dailyReward: BN, totalStake: BN) => {
    const [apyPercent, setApyPercent] = useState(0);

    useEffect(() => {
        if (isAccountDataLoading) {
            return;
        }

        const maxApy = getMaxApy(farm);
        if (Number(Web3.utils.fromWei(totalStake)) <= 0) {
            setApyPercent(maxApy);
            return;
        }

        const apyCommonUnitMultiplier = getApyCommonUnitMultiplier(farm);
        const apyPercent = Number(
            Web3.utils.fromWei(dailyReward.mul(new BN(365 * 100 * apyCommonUnitMultiplier)).div(totalStake))
        );
        setApyPercent(Math.min(apyPercent, maxApy));
    }, [farm, isAccountDataLoading, dailyReward, totalStake, setApyPercent]);

    return apyPercent;
};

export default useApyPercent;
