import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { provider as EthereumProvider } from 'web3-core/types';
import detectEtheremProvider from '@metamask/detect-provider';
import FullPageLoader from './full-page-loader';
import PresaleContextProvider from './presale-context-provider';
import { getIsNetworkSupported } from '../utils/networks';

interface IWeb3Context {
    isLoading: boolean;
    isEthProviderAvailable: boolean;
    isNetworkSupported: boolean;
    web3: Web3;
    connect: () => void;
    account: string | null;
}

const defaultWeb3Context: IWeb3Context = {
    isLoading: true,
    isEthProviderAvailable: false,
    isNetworkSupported: false,
    web3: new Web3(),
    connect: () => {},
    account: null,
};

export const Web3Context = React.createContext<IWeb3Context>(defaultWeb3Context);

const Web3WriterContextProvider: React.FC<{}> = ({ children }) => {
    const [web3Context, setWeb3Context] = useState<IWeb3Context>(defaultWeb3Context);
    const updateWeb3Context = useCallback(
        (updatedWeb3Context: Partial<IWeb3Context>) =>
            setWeb3Context((currentWeb3Context) => ({
                ...currentWeb3Context,
                ...updatedWeb3Context,
            })),
        [setWeb3Context]
    );

    useEffect(() => {
        const handleAccountChange = (accounts: string[]) => {
            updateWeb3Context({ account: accounts.length > 0 ? accounts[0] : null });
        };

        const init = async () => {
            try {
                const ethereum = (await detectEtheremProvider()) as any;
                if (!ethereum) {
                    throw new Error('MetaMask not found');
                }

                ethereum.on('chainChanged', () => location.reload());
                ethereum.on('accountsChanged', handleAccountChange);

                const isNetworkSupported = getIsNetworkSupported(Number(ethereum.chainId));
                const web3 = new Web3(ethereum as EthereumProvider);
                const connect = async () => {
                    try {
                        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                        handleAccountChange(accounts);
                    } catch (e) {
                        console.log(`Failed to connect account. Message: ${e}`);
                    }
                };

                updateWeb3Context({
                    isLoading: false,
                    isEthProviderAvailable: true,
                    isNetworkSupported,
                    web3,
                    connect,
                });
            } catch (e) {
                console.log(`Cannot determine ethereum provider. Message: ${e}`);
                updateWeb3Context({ isLoading: false, isEthProviderAvailable: false });
            }
        };
        init();
    }, [updateWeb3Context]);

    return web3Context.isLoading ? (
        <FullPageLoader />
    ) : (
        <Web3Context.Provider value={web3Context}>
            <PresaleContextProvider>{children}</PresaleContextProvider>
        </Web3Context.Provider>
    );
};

export default Web3WriterContextProvider;
