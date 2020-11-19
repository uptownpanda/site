import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { provider } from 'web3-core/types';

interface IEthereum {
    networkVersion: string;
    selectedAddress: string;
    currentProvider: provider;
}

interface IMetaMaskWindow {
    ethereum: IEthereum | undefined;
}

enum NextEnvironment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
}

interface IPresaleFetcher {
    getPresaleData: () => number;
}

interface IWeb3Context {
    isLoading: boolean;
    isMetaMaskAvailable: boolean;
    isInvalidNetworkSelected: boolean;
    presale: IPresaleFetcher;
}

const defaultPresaleFetcher: IPresaleFetcher = {
    getPresaleData: () => 0,
};

const defaultWeb3Context: IWeb3Context = {
    isLoading: true,
    isMetaMaskAvailable: false,
    isInvalidNetworkSelected: false,
    presale: defaultPresaleFetcher,
};

export const Web3Context = React.createContext<IWeb3Context>(defaultWeb3Context);

const initWeb3Context = (ethereum: IEthereum, env: string): Partial<IWeb3Context> => {
    let networkId = ethereum.networkVersion;
    let isInvalidNetworkSelected = false;
    const web3js = new Web3(ethereum.currentProvider);

    switch (env) {
        case NextEnvironment.DEVELOPMENT:
        case NextEnvironment.STAGING:
            isInvalidNetworkSelected = networkId !== '4'; // rinkeby network
            break;

        case NextEnvironment.PRODUCTION:
            isInvalidNetworkSelected = networkId !== '1'; // mainnet network
            break;

        default:
            throw new Error(`Unsupported environment '${env}'.`);
    }

    return {
        isLoading: false,
        isMetaMaskAvailable: true,
        isInvalidNetworkSelected,
    };
};

const Web3WriterContextProvider: React.FC<{}> = ({ children }) => {
    const currentEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;
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
        const metaMaskWindow = (window as unknown) as IMetaMaskWindow;
        if (!metaMaskWindow.ethereum || !currentEnv) {
            return;
        }
        updateWeb3Context(initWeb3Context(metaMaskWindow.ethereum, currentEnv));
    }, [currentEnv, updateWeb3Context]);

    return <Web3Context.Provider value={web3Context}>{children}</Web3Context.Provider>;
};

export default Web3WriterContextProvider;
