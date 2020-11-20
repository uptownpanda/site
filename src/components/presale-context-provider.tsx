import React, { useCallback, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import UptownPandaPresale from '../contracts/UptownPandaPresale';
import { AbiItem } from 'web3-utils/types';
import { Web3Context } from './web3-context-provider';

interface IPresaleContext {
    isLoading: boolean;
    isInitialized: boolean;
    init: () => void;
}

const defaultPresaleContext: IPresaleContext = {
    isLoading: true,
    isInitialized: false,
    init: () => {},
};

export const PresaleContext = React.createContext<IPresaleContext>(defaultPresaleContext);

const PresaleContextProvider: React.FC<{}> = ({ children }) => {
    const web3Context = useContext(Web3Context);
    const [presaleContext, setPresaleContext] = useState<IPresaleContext>(defaultPresaleContext);
    const updatePresaleContext = useCallback(
        (updatedContext: Partial<IPresaleContext>) =>
            setPresaleContext((currentContext) => ({ ...currentContext, ...updatedContext })),
        [setPresaleContext]
    );

    useEffect(() => {
        const { web3, isEthProviderAvailable, isNetworkSupported, isLoading: isWeb3ContextLoading } = web3Context;

        if (isWeb3ContextLoading) {
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            updatePresaleContext({ isInitialized: false, isLoading: false });
            return;
        }

        const init = async () => {
            updatePresaleContext({ isLoading: true, isInitialized: true });

            const contract = new web3.eth.Contract(
                UptownPandaPresale as AbiItem[],
                process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS
            );
            const isActive = await contract.methods.isPresaleActive().call();
            const wasEnded = await contract.methods.wasPresaleEnded().call();
            console.log('is active', isActive);
            console.log('was ended', wasEnded);

            updatePresaleContext({ isLoading: false });
        };
        updatePresaleContext({ init });
    }, [web3Context, updatePresaleContext]);

    return <PresaleContext.Provider value={presaleContext}>{children}</PresaleContext.Provider>;
};

export default PresaleContextProvider;
