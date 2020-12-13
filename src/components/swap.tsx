import React from 'react';
import Alert, { AlertType } from './alert';
import DataWrapper from './data-wrapper';
import useSwap from './hooks/useSwap';
import Web3 from 'web3';
import useOnClickLoadingButton from './hooks/useOnClickLoadingButton';
import ActionButton from './action-button';

const Swap: React.FC = () => {
    const { swap, onApproveClick, onSwapClick } = useSwap();
    const {
        isLoading,
        isDataAvailable,
        isParticipating,
        pendingSwapAmount,
        needsApproval,
        showThankYou,
    } = swap;
    const { isLoading: isApproveLoading, onClickWithLoading: onApproveClickWithLoading } = useOnClickLoadingButton(
        onApproveClick
    );
    const { isLoading: isSwapLoading, onClickWithLoading: onSwapClickWithLoading } = useOnClickLoadingButton(
        onSwapClick
    );

    const pendingSwapAmountDisplay = Web3.utils.fromWei(pendingSwapAmount);

    return (
        <DataWrapper
            isLoading={isLoading}
            isDataAvailable={isDataAvailable}
            connectWalletText="Connect your wallet to make the swap."
        >
            {isParticipating ? (
                <>
                    <div className="form-group">
                        <label className="mb-0 font-weight-bold">Pending swap $UP amount</label>
                        <span className="d-block">{pendingSwapAmountDisplay} $UP</span>
                    </div>

                    {needsApproval ? (
                        <>
                            <p>
                                Before swaping, you need to make an approval that enables swap contract to transfer your
                                ERC721 tokens and send ETH back to your wallet.
                            </p>

                            <ActionButton
                                isDisabled={isApproveLoading}
                                isLoading={isApproveLoading}
                                onClick={onApproveClickWithLoading}
                            >
                                Approve
                            </ActionButton>
                        </>
                    ) : showThankYou ? (
                        <Alert type={AlertType.SUCCESS} className="mb-0">
                            You successfully completed the swap procedure. Check your wallet for received ETHs.
                        </Alert>
                    ) : (
                        <>
                            <p>Click on the button below to swap pending $UP tokens for ETHs.</p>

                            <ActionButton
                                isLoading={isSwapLoading}
                                isDisabled={isSwapLoading}
                                onClick={onSwapClickWithLoading}
                            >
                                Swap
                            </ActionButton>
                        </>
                    )}
                </>
            ) : (
                <Alert type={AlertType.INFO} className="mb-0">
                    Only wallets containing swap ERC721 tokens can participate.
                </Alert>
            )}
        </DataWrapper>
    );
};

export default Swap;
