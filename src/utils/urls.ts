import { NextEnvironment } from './enums';

export const getEtherScanUrl = (suffix: string | null = null) => {
    let urlBase: string;
    switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
        case NextEnvironment.DEVELOPMENT:
        case NextEnvironment.STAGING:
            urlBase = 'https://rinkeby.etherscan.io';
            break;

        case NextEnvironment.PRODUCTION:
            urlBase = 'https://etherscan.io';
            break;

        default:
            throw new Error(`Unsupported environment '${process.env.NEXT_PUBLIC_ENVIRONMENT}'.`);
    }
    return !!suffix ? `${urlBase}/${suffix}` : urlBase;
};
