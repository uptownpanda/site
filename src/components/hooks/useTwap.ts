import { useContext, useEffect, useState } from 'react';

import BN from 'bn.js';
import { Web3Context } from '../web3-context-provider';
import UptownPandaAbi from '../../contracts/UptownPandaAbi';

const useTwap = () => {
    const { isLoading, web3, isEthProviderAvailable, isNetworkSupported } = useContext(Web3Context);
    const [twap, setTwap] = useState<BN>(new BN(0));

    useEffect(() => {
        if (isLoading || !isEthProviderAvailable || !isNetworkSupported) {
            return;
        }
        const contract = new web3.eth.Contract(UptownPandaAbi, process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS);
        (async () => {
            setTwap(new BN(await contract.methods.currentTwap().call()).div(new BN(11)));
        })();
        const interval = setInterval(() => {
            (async () => {
                const newTwap = new BN(await contract.methods.currentTwap().call()).div(new BN(11));
                setTwap(newTwap);
            })();
        }, 60000);
        return () => {
            clearInterval(interval);
        };
    }, [isLoading, web3, isEthProviderAvailable, isNetworkSupported]);

    return { isLoading, isDataAvailable: isEthProviderAvailable && isNetworkSupported, twap };
};

export default useTwap;
