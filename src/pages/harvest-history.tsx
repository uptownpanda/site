import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import Alert, { AlertType } from '../components/alert';
import Card from '../components/card';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import FarmSelection from '../components/farm-selection';
import HarvestChunkTableRow from '../components/harvest-chunk-table-row';
import useHarvestHistory from '../components/hooks/useHarvestHistory';
import { Farm } from '../utils/enums';
import cn from 'classnames';
import Modal from '../components/modal';
import HarvestChunkClaimTableRow from '../components/harvest-chunk-claim-table-row';

const HarvestHistory: React.FC<{}> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFarm, setActiveFarm] = useState<Farm>(Farm.UP);
    const onClaimsLoaded = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
    const { harvestHistory, harvestChunkClaims, onHarvestChunkClaimDetailsRequest } = useHarvestHistory(
        activeFarm,
        onClaimsLoaded
    );
    const {
        isLoading,
        isDataValid,
        isAccountConnected,
        hasFarmingStarted,
        harvestChunks,
        harvestInterval,
        harvestStepPercent,
    } = harvestHistory;
    const { harvestChunkIdx: loadingClaimsIndex, areClaimsLoading, claims } = harvestChunkClaims;

    const useFluidContainer = !isLoading && isDataValid && hasFarmingStarted && isAccountConnected;
    const containerClasses = cn('pb-6', {
        'container-fluid': useFluidContainer,
        'container-md': !useFluidContainer,
    });

    return (
        <>
            <Head>
                <title>Uptown Panda | Harvest History - uptownpanda.finance</title>
            </Head>

            <div className="container-md pt-6">
                <div className="row">
                    <div className="col-12">
                        <FarmSelection isLoading={isLoading} activeFarm={activeFarm} setActiveFarm={setActiveFarm} />
                    </div>
                </div>
            </div>

            <div className={containerClasses}>
                {!isLoading ? (
                    <div className="row mt-4">
                        <div className="col">
                            {isDataValid ? (
                                hasFarmingStarted ? (
                                    isAccountConnected ? (
                                        <Card titleIconClassName="fas fa-history" titleText="Harvest history">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead>
                                                        <tr className="table-success">
                                                            <th scope="colbn" className="text-right">
                                                                #
                                                            </th>
                                                            <th scope="col" className="text-right">
                                                                Date
                                                            </th>
                                                            <th scope="col" className="text-right">
                                                                Total $UP
                                                            </th>
                                                            <th scope="col" className="text-right">
                                                                Claimable $UP
                                                            </th>
                                                            <th scope="col" className="text-right">
                                                                Claimable %
                                                            </th>
                                                            <th scope="col" className="text-right">
                                                                Claimed $UP
                                                            </th>
                                                            <th scope="col" className="text-right">
                                                                Claimed %
                                                            </th>
                                                            <th scope="col" className="text-center">
                                                                Details
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {!!harvestChunks.length ? (
                                                            harvestChunks.map((harvestChunk, i) => (
                                                                <HarvestChunkTableRow
                                                                    key={i}
                                                                    harvestChunk={harvestChunk}
                                                                    harvestChunkIndex={i}
                                                                    harvestInterval={harvestInterval}
                                                                    harvestStepPercent={harvestStepPercent}
                                                                    onDetailsClick={(harvestChunkIndex) => {
                                                                        onHarvestChunkClaimDetailsRequest(
                                                                            harvestChunkIndex
                                                                        );
                                                                    }}
                                                                    loadingClaimsHarvestChunkIndex={
                                                                        areClaimsLoading ? loadingClaimsIndex : null
                                                                    }
                                                                />
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={8} className="text-center">
                                                                    <Alert
                                                                        type={AlertType.INFO}
                                                                        className="mb-0 d-inline-block"
                                                                    >
                                                                        No records found.
                                                                    </Alert>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Card>
                                    ) : (
                                        <Alert type={AlertType.WARNING}>
                                            Connect your account to see your harvest history.
                                        </Alert>
                                    )
                                ) : (
                                    <Alert type={AlertType.WARNING}>Farming has not been started yet.</Alert>
                                )
                            ) : (
                                <Alert type={AlertType.WARNING}>Contract data is unavailable.</Alert>
                            )}
                        </div>
                    </div>
                ) : (
                    <ComponentLoader color={ComponentLoaderColor.WHITE} className="mt-6" />
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                titleIcon="far fa-clipboard"
                title="Harvest chunk claiming details"
                id="harvest-chunk-claiming-details"
                ariaLabelledBy="harvest-chunk-claiming-details-label"
            >
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr className="table-success">
                                <th scope="colbn" className="text-right">
                                    #
                                </th>
                                <th scope="col" className="text-right">
                                    Date
                                </th>
                                <th scope="col" className="text-right">
                                    Claimed $UP
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!claims.length ? (
                                claims.map((c, i) => <HarvestChunkClaimTableRow key={i} claimIndex={i} claim={c} />)
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        <Alert type={AlertType.INFO} className="mb-0 d-inline-block">
                                            No records found.
                                        </Alert>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </>
    );
};

export default HarvestHistory;
