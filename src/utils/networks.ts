import { NextEnvironment } from './enums';

export const getIsNetworkSupported = (chainId: number) => {
    switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
        case NextEnvironment.DEVELOPMENT:
        case NextEnvironment.STAGING:
            return chainId === 4; // rinkeby network

        case NextEnvironment.PRODUCTION:
            return chainId === 1; // mainnet network

        default:
            throw new Error(`Unsupported environment '${process.env.NEXT_PUBLIC_ENVIRONMENT}'.`);
    }
};
