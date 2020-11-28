import { useContext, useEffect, useState } from 'react';

import BN from 'bn.js';
import { Web3Context } from '../web3-context-provider';
import UptownPandaAbi from '../../contracts/UptownPandaAbi';
import Web3 from 'web3';

const useTwap = () => {
    const { isLoading, web3, isEthProviderAvailable, isNetworkSupported } = useContext(Web3Context);
    const [twap, setTwap] = useState<number>(0);

    useEffect(() => {
        if (isLoading || !isEthProviderAvailable || !isNetworkSupported) {
            return;
        }
        const contract = new web3.eth.Contract(UptownPandaAbi, process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS);
        const updateTwap = async () => {
            let twap = Web3.utils.toBN(await contract.methods.currentTwap().call());
            if (twap.isZero()) {
                setTwap(0);
                return;
            }
            const twapAsNumber = Number(Web3.utils.fromWei(twap));
            setTwap(11 / twapAsNumber);
        };
        updateTwap();
        const interval = setInterval(() => updateTwap(), 30000);
        return () => {
            clearInterval(interval);
        };
    }, [isLoading, web3, isEthProviderAvailable, isNetworkSupported]);

    return { isLoading, isDataAvailable: isEthProviderAvailable && isNetworkSupported, twap };
};

export default useTwap;
