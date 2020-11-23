import { NextEnvironment } from './enums';
import { Token, Fetcher, Route, WETH, ChainId } from '@uniswap/sdk';
import Web3 from 'web3';
import IERC20Abi from '../contracts/IERC20Abi';

export const getUniswapChainId = () => {
    switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
        case NextEnvironment.DEVELOPMENT:
        case NextEnvironment.STAGING:
            return ChainId.RINKEBY;

        case NextEnvironment.PRODUCTION:
            return ChainId.MAINNET;

        default:
            throw new Error(`Unsupported environment '${process.env.NEXT_PUBLIC_ENVIRONMENT}'.`);
    }
};

export const getTokenInEthPrice = async (tokenAddress: string) => {
    try {
        const chainId = getUniswapChainId();
        const TOKEN = new Token(chainId, tokenAddress, 18);
        const pair = await Fetcher.fetchPairData(TOKEN, WETH[chainId]);
        const route = new Route([pair], TOKEN);
        return Number(route.midPrice.toSignificant(6));
    } catch (e) {
        if (process.env.NEXT_PUBLIC_ENVIRONMENT !== NextEnvironment.PRODUCTION) {
            return 1; // in development/staging env we access rinkeby network, where WBTC is not defined... so we fake the data
        }
        console.log('Error occured while getting token price in eth', e);
        throw e;
    }
};

export const getUniswapLPTokenInEthPrice = async (web3: Web3, tokenAddress: string) => {
    const totalUniLPTokenSupply = await getUniswapLPTokenTotalSupply(web3, tokenAddress);
    const wethContract = new web3.eth.Contract(IERC20Abi, WETH[getUniswapChainId()].address);
    const uniLPTokenWethsReserve = Number(
        Web3.utils.fromWei(await wethContract.methods.balanceOf(tokenAddress).call())
    );
    return (uniLPTokenWethsReserve * 2) / totalUniLPTokenSupply;
};

const getUniswapLPTokenTotalSupply = async (web3: Web3, tokenAddress: string) => {
    const uniLPTokenContract = new web3.eth.Contract(IERC20Abi, tokenAddress);
    let totalUniLPTokenSupply = Number(Web3.utils.fromWei(await uniLPTokenContract.methods.totalSupply().call()));
    return totalUniLPTokenSupply > 0 ? totalUniLPTokenSupply : 1; // this is to prevent issues when dividing by zero
};
