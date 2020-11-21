import Head from 'next/head';
import { useContext, useEffect, useRef, useState } from 'react';
import { PresaleContext } from '../components/presale-context-provider';
import ComponentLoader from '../components/component-loader';
import Alert, { AlertType } from '../components/alert';
import Card from '../components/card';
import BN from 'bn.js';
import Web3 from 'web3';
import { Web3Context } from '../components/web3-context-provider';
import PresaleContractAddress from '../components/presale-contract-address';

const Presale: React.FC<{}> = () => {
    const { account } = useContext(Web3Context);

    const {
        isLoading,
        isActive,
        wasEnded,
        allowWhiteListAddressesOnly,
        supplyLeft,
        isInitialized,
        accountContribution,
        isAccountWhitelisted,
        init,
    } = useContext(PresaleContext);

    const totalAccountContribution = new BN(Web3.utils.toWei('2.5'));
    const totalAccountContributionDisplay = Web3.utils.fromWei(totalAccountContribution);
    const accountContributionDisplay = Web3.utils.fromWei(accountContribution);
    const accountContributionPercent = (Number(accountContribution) * 100) / Number(totalAccountContribution);

    const totalSupply = new BN(Web3.utils.toWei('400'));
    const collectedSupply = totalSupply.sub(supplyLeft);
    const totalSupplyDisplay = Web3.utils.fromWei(totalSupply);
    const collectedSupplyDisplay = Web3.utils.fromWei(collectedSupply);
    const collectedPercent = (Number(collectedSupplyDisplay) * 100) / Number(totalSupplyDisplay);

    useEffect(() => {
        !isInitialized && init();
    }, [isInitialized, init]);

    return (
        <>
            <Head>
                <title>Uptown Panda | Presale - uptownpanda.finance</title>
            </Head>

            {isLoading ? (
                <ComponentLoader />
            ) : (
                <div className="container-md py-6">
                    <div className="row">
                        <div className="col-12">
                            {isInitialized ? (
                                <>
                                    <div className="row">
                                        <div className="col mb-4">
                                            <Card titleIconClassName="fas fa-info" titleText="Presale Info">
                                                <p className="card-text">
                                                    Donec molestie lacus ligula, vel rhoncus ipsum eleifend quis. Proin
                                                    tincidunt elit ligula, a posuere enim pellentesque in. Class aptent
                                                    taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                                                    himenaeos. In eu ornare risus. Pellentesque in quam non nibh
                                                    fermentum pellentesque. Sed facilisis sem tellus, in scelerisque
                                                    nisl maximus et. Curabitur nec dictum ipsum. Integer urna ex,
                                                    hendrerit nec dapibus vel, sodales ut lorem. Nullam pellentesque
                                                    tortor semper metus sagittis, ac vestibulum quam cursus. Morbi eu
                                                    nibh metus. Class aptent taciti sociosqu ad litora torquent per
                                                    conubia nostra, per inceptos himenaeos. In hac habitasse platea
                                                    dictumst. Aliquam erat volutpat. Donec auctor egestas pharetra. Nunc
                                                    volutpat augue in ante porta, at varius neque porta. Integer
                                                    tincidunt porta quam, eu auctor turpis pellentesque mattis.
                                                </p>
                                            </Card>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 mb-4 col-md-6 mb-md-0">
                                            <Card titleIconClassName="fas fa-tasks" titleText="Status">
                                                {!isActive && (
                                                    <p className="card-text">
                                                        {!wasEnded ? (
                                                            <span>Presale has not started yet.</span>
                                                        ) : (
                                                            <span>Presale has been concluded.</span>
                                                        )}
                                                    </p>
                                                )}
                                                {isActive && (
                                                    <>
                                                        <p className="card-text mb-0">
                                                            Presale is live and open for contributions.
                                                        </p>
                                                        <p className="card-text">
                                                            {allowWhiteListAddressesOnly ? (
                                                                <span>Only whitelist addresses can contribute.</span>
                                                            ) : (
                                                                <span>Anyone can contribute.</span>
                                                            )}
                                                        </p>
                                                    </>
                                                )}
                                                {(isActive || wasEnded) && (
                                                    <>
                                                        <p className="card-text mb-0">
                                                            Collected ETHs ({collectedSupplyDisplay} /{' '}
                                                            {totalSupplyDisplay})
                                                        </p>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar bg-success"
                                                                role="progressbar"
                                                                style={{ width: `${collectedPercent}%` }}
                                                                aria-valuenow={collectedPercent}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                        </div>
                                                    </>
                                                )}

                                                <div className="dropdown-divider my-4" />

                                                <p className="card-text">
                                                    {!allowWhiteListAddressesOnly || isAccountWhitelisted ? (
                                                        <span>
                                                            You are eligeble to participate in our presale (FCFS is
                                                            active).
                                                        </span>
                                                    ) : (
                                                        <span>You are not eligeble to participate in our presale.</span>
                                                    )}
                                                </p>

                                                {!!account ? (
                                                    <>
                                                        <p className="card-text mb-0">
                                                            Your contribution in ETHs ({accountContributionDisplay} /{' '}
                                                            {totalAccountContributionDisplay})
                                                        </p>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar bg-success"
                                                                role="progressbar"
                                                                style={{ width: `${accountContributionPercent}%` }}
                                                                aria-valuenow={accountContributionPercent}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Alert type={AlertType.INFO}>
                                                        Connect your wallet via MetaMask to check your contribution.
                                                    </Alert>
                                                )}
                                            </Card>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <Card titleIconClassName="" titleText="Contracts">
                                                <ul className="list-group">
                                                    <PresaleContractAddress
                                                        address={process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS}
                                                    >
                                                        Presale contract
                                                    </PresaleContractAddress>
                                                    <PresaleContractAddress
                                                        address={process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}
                                                    >
                                                        $UP token contract
                                                    </PresaleContractAddress>
                                                    <PresaleContractAddress
                                                        address={process.env.NEXT_PUBLIC_LIQUIDITY_LOCK_CONTRACT_ADDRESS}
                                                    >
                                                        Liquidity lock contract
                                                    </PresaleContractAddress>
                                                </ul>
                                            </Card>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Alert type={AlertType.WARNING} className="my-5">
                                    Contract data is currently unavailable. Please try again by refreshing this page.
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Presale;
