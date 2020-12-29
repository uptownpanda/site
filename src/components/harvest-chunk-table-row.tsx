import { format as formatDate, fromUnixTime } from 'date-fns';
import Web3 from 'web3';
import { IHarvestChunk } from './hooks/useHarvestHistory';
import BN from 'bn.js';

export interface HarvestChunkTableRowProps {
    harvestChunkIndex: number;
    harvestChunk: IHarvestChunk;
    harvestStepPercent: number;
    harvestInterval: number;
    onDetailsClick: (harvestChunkIndex: number) => void;
    loadingClaimsHarvestChunkIndex: number | null;
}

const HarvestChunkTableRow: React.FC<HarvestChunkTableRowProps> = ({
    harvestChunkIndex,
    harvestChunk,
    harvestStepPercent,
    harvestInterval,
    onDetailsClick,
    loadingClaimsHarvestChunkIndex,
}) => {
    const { timestamp, amount, isLoadingClaimed, claimed } = harvestChunk;
    const isShowDetailsDisabled = loadingClaimsHarvestChunkIndex !== null;
    const showDetailsLoading = harvestChunkIndex === loadingClaimsHarvestChunkIndex;
    const claimablePercent =
        Math.min(Math.floor((Date.now() / 1000 - timestamp) / harvestInterval), 10) * harvestStepPercent;
    const claimableAmount = amount.mul(new BN(claimablePercent)).div(new BN(100));
    const claimedPercent = !isLoadingClaimed
        ? Math.round((Number(Web3.utils.fromWei(claimed)) * 100) / Number(Web3.utils.fromWei(amount)))
        : '0';

    return (
        <tr>
            <td className="text-right">{harvestChunkIndex + 1}</td>
            <td className="text-right">{formatDate(fromUnixTime(timestamp), 'PPppp')}</td>
            <td className="text-right">{Web3.utils.fromWei(amount)} $UP</td>
            <td className="text-right">{Web3.utils.fromWei(claimableAmount)} $UP</td>
            <td className="text-right">{claimablePercent} %</td>
            {!isLoadingClaimed ? (
                <>
                    <td className="text-right">{Web3.utils.fromWei(claimed)} $UP</td>
                    <td className="text-right">{claimedPercent} %</td>
                </>
            ) : (
                <td colSpan={2} className="text-center">
                    <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </td>
            )}
            <td className="details-button-td text-center">
                <button
                    className="btn btn-sm btn-outline-success"
                    disabled={isShowDetailsDisabled}
                    onClick={() => onDetailsClick(harvestChunkIndex)}
                >
                    {!showDetailsLoading ? (
                        <span>Details</span>
                    ) : (
                        <>
                            <span
                                className="button-loading-spinner spinner-border spinner-border-sm align-text-top mr-1"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            Loading...
                        </>
                    )}
                </button>
            </td>
        </tr>
    );
};

export default HarvestChunkTableRow;
