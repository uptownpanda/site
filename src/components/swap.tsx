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
        uptownPandaAmount,
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

    const uptownPandaAmountDisplay = Web3.utils.fromWei(uptownPandaAmount);
    const pendingSwapAmountDisplay = Web3.utils.fromWei(pendingSwapAmount);

    return (
        <DataWrapper
            isLoading={isLoading}
            isDataAvailable={isDataAvailable}
            connectWalletText="Connect your wallet to get the swap token."
        >
            {isParticipating ? (
                <>
                    <div className="form-group">
                        <label className="mb-0 font-weight-bold">Avaiable $UP amount</label>
                        <span className="d-block">{uptownPandaAmountDisplay} $UP</span>
                    </div>

                    <div className="form-group">
                        <label className="mb-0 font-weight-bold">Pending swap $UP amount</label>
                        <span className="d-block">{pendingSwapAmountDisplay} $UP</span>
                    </div>

                    {needsApproval ? (
                        <>
                            <p>
                                Before swaping, you need to make an approval that enables swap contract to transfer your
                                $UP tokens.
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
                            You successfully completed the swap procedure.
                        </Alert>
                    ) : (
                        <>
                            <p>Click on the button below to put your available $UP balance into swap process.</p>

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
                    You need $UP tokens to participate in the swap process.
                </Alert>
            )}
        </DataWrapper>
    );
};

export default Swap;
