import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import UptownPandaPresaleAbi from '../../contracts/UptownPandaPresaleAbi';
import { Web3Context } from '../web3-context-provider';
import BN from 'bn.js';
import Web3 from 'web3';
import { Subscription } from 'web3-core-subscriptions/types';
import { Log } from 'web3-core/types';

interface IInvestmentSucceeded {
    sender: string;
    weiAmount: string;
}

interface IPresaleData {
    isLoading: boolean;
    isActive: boolean;
    wasEnded: boolean;
    allowWhiteListAddressesOnly: boolean;
    supplyLeft: BN;
    accountContribution: BN;
    isAccountWhitelisted: boolean;
}

const defaultPresaleData: IPresaleData = {
    isLoading: true,
    isActive: false,
    wasEnded: false,
    supplyLeft: Web3.utils.toBN('400000000000000000000'),
    allowWhiteListAddressesOnly: true,
    accountContribution: Web3.utils.toBN('0'),
    isAccountWhitelisted: false,
};

const getInvestmentSucceededEventSubscription = (
    web3: Web3,
    eventCallback: (eventData: IInvestmentSucceeded) => void
): Subscription<Log> => {
    const eventAbi = UptownPandaPresaleAbi.find((el) => el.name === 'InvestmentSucceeded' && el.type === 'event');
    if (!eventAbi) {
        throw new Error('Invalid UptownPandaPresale ABI. Event InvestmentSucceeded was not found.');
    }
    const eventInputs = eventAbi.inputs;
    if (!eventInputs) {
        throw new Error('Invalid UptownPandaPresale ABI. Event InvestmentSucceeded does not have inputs defined.');
    }
    const topics = [web3.eth.abi.encodeEventSignature(eventAbi)];
    return web3.eth.subscribe(
        'logs',
        {
            address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
            topics,
        },
        (error, log) => {
            if (!!error) {
                console.log('Something went wrong while recieving InvestmentSucceeded event.', error);
                return;
            }
            const eventData = (web3.eth.abi.decodeLog(
                eventInputs,
                log.data,
                topics
            ) as unknown) as IInvestmentSucceeded;
            eventCallback(eventData);
        }
    );
};

const usePresale = (): IPresaleData => {
    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const [presaleData, setPresaleData] = useState<IPresaleData>(defaultPresaleData);
    const updatePresaleData = useCallback(
        (updatedData: Partial<IPresaleData>) => setPresaleData((currentData) => ({ ...currentData, ...updatedData })),
        [setPresaleData]
    );

    useEffect(() => {
        if (isWeb3ContextLoading) {
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            updatePresaleData({ isLoading: false });
            return;
        }

        let investmentSucceededEventSubscription: Subscription<Log> | null = null;
        (async () => {
            updatePresaleData({ isLoading: true });

            investmentSucceededEventSubscription = getInvestmentSucceededEventSubscription(
                web3,
                ({ weiAmount, sender }) => {
                    const investedAmount = Web3.utils.toBN(weiAmount);
                    setPresaleData((currentData) => ({
                        ...currentData,
                        supplyLeft: currentData.supplyLeft.sub(investedAmount),
                        accountContribution:
                            account?.toLowerCase() === sender.toLowerCase()
                                ? currentData.accountContribution.add(investedAmount)
                                : currentData.accountContribution,
                    }));
                }
            );

            const contract = new web3.eth.Contract(
                UptownPandaPresaleAbi,
                process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS
            );
            const isActive = await contract.methods.isPresaleActive().call();
            const wasEnded = await contract.methods.wasPresaleEnded().call();
            const allowWhiteListAddressesOnly = await contract.methods.allowWhitelistAddressesOnly().call();
            const supplyLeft = Web3.utils.toBN(await contract.methods.presaleWeiSupplyLeft().call());
            const accountContribution = !!account
                ? Web3.utils.toBN(await contract.methods.investments(account).call())
                : new BN(0);
            const isAccountWhitelisted = !!account ? await contract.methods.whitelistAddresses(account).call() : false;

            updatePresaleData({
                isLoading: false,
                isActive,
                wasEnded,
                allowWhiteListAddressesOnly,
                supplyLeft,
                accountContribution,
                isAccountWhitelisted,
            });
        })();

        return () => {
            !!investmentSucceededEventSubscription && investmentSucceededEventSubscription.unsubscribe();
        };
    }, [
        account,
        web3,
        isWeb3ContextLoading,
        isEthProviderAvailable,
        isNetworkSupported,
        updatePresaleData,
        setPresaleData,
    ]);

    return presaleData;
};

export default usePresale;
