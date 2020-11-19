import React, { useEffect, useState } from 'react';

enum NextEnvironment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
}

interface IWeb3Context {
    isLoading: boolean;
    isMetaMaskAvailable: boolean;
    isMetaMaskConnected: boolean;
}

const defaultWeb3Context: IWeb3Context = {
    isLoading: true,
    isMetaMaskAvailable: false,
    isMetaMaskConnected: false,
};

export const Web3Context = React.createContext<IWeb3Context>(defaultWeb3Context);

const Web3ContextProvider: React.FC<{}> = ({ children }) => {
    const currentEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const [web3Context, setWeb3Context] = useState<IWeb3Context>(defaultWeb3Context);

    useEffect(() => {
        switch (currentEnv) {
            case NextEnvironment.DEVELOPMENT:
                console.log('dev');
                break;

            case NextEnvironment.STAGING:
                console.log('staging');
                break;

            case NextEnvironment.PRODUCTION:
                console.log('production');
                break;

            default:
                throw new Error(`Unsupported environment '${currentEnv}'.`);
        }

        setWeb3Context({
            isLoading: false,
            isMetaMaskAvailable: false,
            isMetaMaskConnected: false,
        });
    }, [currentEnv, setWeb3Context]);

    return <Web3Context.Provider value={web3Context}>{children}</Web3Context.Provider>;
};

export default Web3ContextProvider;
