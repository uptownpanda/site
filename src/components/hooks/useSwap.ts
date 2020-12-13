import { useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from '../web3-context-provider';
import useUpdateState from './useUpdateState';
import BN from 'bn.js';
import UptownPandaSwapAbi from '../../contracts/UptownPandaSwapAbi';
import UptownPandaSwapTokenAbi from '../../contracts/UptownPandaSwapTokenAbi';
import { Contract } from 'web3-eth-contract';

interface ISwap {
    isLoading: boolean;
    isDataAvailable: boolean;
    pendingSwapAmount: BN;
    isParticipating: boolean;
    needsApproval: boolean;
    showThankYou: boolean;
}

const defaultSwap: ISwap = {
    isLoading: true,
    isDataAvailable: false,
    pendingSwapAmount: new BN(0),
    isParticipating: false,
    needsApproval: true,
    showThankYou: false,
};

const useSwap = () => {
    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const [contracts, setContracts] = useState<[Contract, Contract] | null>(null);
    const [swap, setSwap] = useState<ISwap>(defaultSwap);
    const updateSwap = useUpdateState(setSwap);

    const refreshData = useCallback(
        async (setIsLoading: boolean, setShowThankYou: boolean) => {
            if (!contracts) {
                return;
            }

            updateSwap({ isLoading: setIsLoading, isDataAvailable: true });
            const [swapContract, swapTokenContract] = contracts;

            const pendingSwapAmount = new BN(await swapTokenContract.methods.checkBalance(account).call());
            if (pendingSwapAmount.isZero()) {
                updateSwap({ isLoading: false, isParticipating: setShowThankYou, showThankYou: setShowThankYou });
                return;
            }

            const needsApproval = !(await swapTokenContract.methods
                .isApprovedForAll(account, swapContract.options.address)
                .call());

            updateSwap({
                isLoading: false,
                isParticipating: true,
                pendingSwapAmount,
                needsApproval,
            });
        },
        [contracts, updateSwap]
    );

    const onApproveClick = useCallback(async () => {
        if (!contracts) {
            return;
        }
        const [swapContract, swapTokenContract] = contracts;
        await swapTokenContract.methods.setApprovalForAll(swapContract.options.address, true).send({ from: account });
        await refreshData(false, false);
    }, [contracts, refreshData]);

    const onSwapClick = useCallback(async () => {
        if (!contracts) {
            return;
        }
        const swapContract = contracts[0];
        await swapContract.methods.swap().send({ from: account });
        await refreshData(false, true);
    }, [contracts, refreshData]);

    useEffect(() => {
        refreshData(true, false);
    }, [refreshData]);

    useEffect(() => {
        if (isWeb3ContextLoading) {
            updateSwap({ isLoading: true });
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            updateSwap({ isLoading: false, isDataAvailable: false });
            return;
        }

        if (!account) {
            updateSwap({ isLoading: false, isDataAvailable: true });
            return;
        }

        const swapContract = new web3.eth.Contract(UptownPandaSwapAbi, process.env.NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS);
        const swapTokenContract = new web3.eth.Contract(
            UptownPandaSwapTokenAbi,
            process.env.NEXT_PUBLIC_SWAP_TOKEN_CONTRACT_ADDRESS
        );
        setContracts([swapContract, swapTokenContract]);
    }, [web3, isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account, updateSwap, setContracts]);

    return { swap, onApproveClick, onSwapClick };
};

export default useSwap;
