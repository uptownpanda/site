import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import UptownPandaPresale from '../contracts/UptownPandaPresale';
import { AbiItem } from 'web3-utils/types';
import { Web3Context } from './web3-context-provider';
import BN from 'bn.js';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract/types';

interface IInvestmentSucceeded {
    sender: string;
    weiAmount: string;
}

interface IPresaleContext {
    isLoading: boolean;
    isInitialized: boolean;
    isActive: boolean;
    wasEnded: boolean;
    allowWhiteListAddressesOnly: boolean;
    supplyLeft: BN;
    init: () => void;
    accountContribution: BN;
    isAccountWhitelisted: boolean;
}

const defaultPresaleContext: IPresaleContext = {
    isLoading: true,
    isInitialized: false,
    isActive: false,
    wasEnded: false,
    supplyLeft: Web3.utils.toBN('400000000000000000000'),
    allowWhiteListAddressesOnly: true,
    init: () => {},
    accountContribution: Web3.utils.toBN('0'),
    isAccountWhitelisted: false,
};

export const PresaleContext = React.createContext<IPresaleContext>(defaultPresaleContext);

const getPresaleContract = (web3: Web3) =>
    new web3.eth.Contract(UptownPandaPresale as AbiItem[], process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS);

const PresaleContextProvider: React.FC<{}> = ({ children }) => {
    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const accountRef = useRef(account);
    accountRef.current = account;
    const [presaleContext, setPresaleContext] = useState<IPresaleContext>(defaultPresaleContext);
    const updatePresaleContext = useCallback(
        (updatedContext: Partial<IPresaleContext>) =>
            setPresaleContext((currentContext) => ({ ...currentContext, ...updatedContext })),
        [setPresaleContext]
    );

    useEffect(() => {
        if (isWeb3ContextLoading) {
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            updatePresaleContext({ isInitialized: false, isLoading: false });
            return;
        }

        const init = async () => {
            updatePresaleContext({ isLoading: true, isInitialized: true });

            const contract = getPresaleContract(web3);

            contract.events.InvestmentSucceeded().on('data', (event: { returnValues: IInvestmentSucceeded }) => {
                const investedAmount = Web3.utils.toBN(event.returnValues.weiAmount);
                setPresaleContext((currentContext) => ({
                    ...currentContext,
                    supplyLeft: currentContext.supplyLeft.sub(investedAmount),
                    accountContribution:
                        accountRef.current?.toLowerCase() === event.returnValues.sender.toLowerCase()
                            ? currentContext.accountContribution.add(investedAmount)
                            : currentContext.accountContribution,
                }));
            });

            const isActive = await contract.methods.isPresaleActive().call();
            const wasEnded = await contract.methods.wasPresaleEnded().call();
            const allowWhiteListAddressesOnly = await contract.methods.allowWhitelistAddressesOnly().call();
            const supplyLeft = Web3.utils.toBN(await contract.methods.presaleWeiSupplyLeft().call());

            updatePresaleContext({
                isLoading: false,
                isActive,
                wasEnded,
                allowWhiteListAddressesOnly,
                supplyLeft,
            });
        };
        updatePresaleContext({ init });
    }, [
        accountRef,
        web3,
        isWeb3ContextLoading,
        isEthProviderAvailable,
        isNetworkSupported,
        updatePresaleContext,
        setPresaleContext,
    ]);

    useEffect(() => {
        const updateAccountData = async () => {
            const contract = getPresaleContract(web3);
            const accountContribution = !!account
                ? Web3.utils.toBN(await contract.methods.investments(account).call())
                : new BN(0);
            const isAccountWhitelisted = !!account ? await contract.methods.whitelistAddresses(account).call() : false;
            updatePresaleContext({ accountContribution, isAccountWhitelisted });
        };
        !isWeb3ContextLoading && updateAccountData();
    }, [account, web3, isWeb3ContextLoading, updatePresaleContext]);

    return <PresaleContext.Provider value={presaleContext}>{children}</PresaleContext.Provider>;
};

export default PresaleContextProvider;
