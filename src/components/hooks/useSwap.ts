import { useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from '../web3-context-provider';
import useUpdateState from './useUpdateState';
import BN from 'bn.js';
import UptownPandaAbi from '../../contracts/UptownPandaAbi';
import UptownPandaSwapTokenAbi from '../../contracts/UptownPandaSwapTokenAbi';
import { Contract } from 'web3-eth-contract';
import { MAX_UINT_256 } from '../../utils/numbers';

interface ISwap {
    isLoading: boolean;
    isDataAvailable: boolean;
    hasApproved: boolean;
    uptownPandaAmount: BN;
    pendingSwapAmount: BN;
    isParticipating: boolean;
    needsApproval: boolean;
    showThankYou: boolean;
}

const defaultSwap: ISwap = {
    isLoading: true,
    isDataAvailable: false,
    hasApproved: false,
    uptownPandaAmount: new BN(0),
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

    const refreshData = useCallback(async (setIsLoading: boolean) => {
        if (!contracts) {
            return;
        }

        updateSwap({ isLoading: setIsLoading, isDataAvailable: true });
        const [uptownPandaContract, swapTokenContract] = contracts;

        const uptownPandaAmount = new BN(await uptownPandaContract.methods.balanceOf(account).call());
        const pendingSwapAmount = new BN(await swapTokenContract.methods.checkBalance(account).call());
        if (uptownPandaAmount.isZero() && pendingSwapAmount.isZero()) {
            updateSwap({ isLoading: false, isParticipating: false });
            return;
        }

        const approvedAmount = new BN(
            await uptownPandaContract.methods
                .allowance(account, process.env.NEXT_PUBLIC_SWAP_TOKEN_CONTRACT_ADDRESS)
                .call()
        );
        const needsApproval = uptownPandaAmount.gt(approvedAmount);
        const showThankYou = uptownPandaAmount.isZero() && !pendingSwapAmount.isZero();
        updateSwap({
            isLoading: false,
            isParticipating: true,
            uptownPandaAmount,
            pendingSwapAmount,
            needsApproval,
            showThankYou,
        });
    }, [contracts, updateSwap]);

    const onApproveClick = useCallback(async () => {
        if (!contracts) {
            return;
        }
        const [uptownPandaContract, swapTokenContract] = contracts;
        await uptownPandaContract.methods
            .approve(swapTokenContract.options.address, MAX_UINT_256)
            .send({ from: account });
        await refreshData(false);
    }, [contracts, refreshData]);

    const onSwapClick = useCallback(async () => {
        if (!contracts) {
            return;
        }
        const [uptownPandaContract, swapTokenContract] = contracts;
        await swapTokenContract.methods.swap().send({ from: account });
        await refreshData(false);
    }, [contracts, refreshData]);

    useEffect(() => {
        refreshData(true);
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

        const uptownPandaContract = new web3.eth.Contract(
            UptownPandaAbi,
            process.env.NEXT_PUBLIC_TOKEN_TO_SWAP_CONTRACT_ADDRESS
        );
        const swapTokenContract = new web3.eth.Contract(
            UptownPandaSwapTokenAbi,
            process.env.NEXT_PUBLIC_SWAP_TOKEN_CONTRACT_ADDRESS
        );
        setContracts([uptownPandaContract, swapTokenContract]);
    }, [web3, isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account, updateSwap, setContracts]);

    return { swap, onApproveClick, onSwapClick };
};

export default useSwap;
