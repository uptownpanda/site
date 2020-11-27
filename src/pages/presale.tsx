import Head from 'next/head';
import { useContext } from 'react';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import Alert, { AlertType } from '../components/alert';
import Card from '../components/card';
import BN from 'bn.js';
import Web3 from 'web3';
import { Web3Context } from '../components/web3-context-provider';
import PresaleContractAddress from '../components/presale-contract-address';
import usePresale from '../components/hooks/usePresale';

const Presale: React.FC<{}> = () => {
    const { account, isEthProviderAvailable, isNetworkSupported } = useContext(Web3Context);

    const {
        isLoading,
        isActive,
        wasEnded,
        allowWhiteListAddressesOnly,
        supplyLeft,
        accountContribution,
        isAccountWhitelisted,
    } = usePresale();

    const totalAccountContribution = new BN(Web3.utils.toWei('2.5'));
    const totalAccountContributionDisplay = Web3.utils.fromWei(totalAccountContribution);
    const accountContributionDisplay = Web3.utils.fromWei(accountContribution);
    const accountContributionPercent = (Number(accountContributionDisplay) * 100) / Number(totalAccountContributionDisplay);

    const totalSupply = new BN(Web3.utils.toWei('400'));
    const collectedSupply = totalSupply.sub(supplyLeft);
    const totalSupplyDisplay = Web3.utils.fromWei(totalSupply);
    const collectedSupplyDisplay = Web3.utils.fromWei(collectedSupply);
    const collectedPercent = (Number(collectedSupplyDisplay) * 100) / Number(totalSupplyDisplay);

    return (
        <>
            <Head>
                <title>Uptown Panda | Presale - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-6">
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mb-4 col-md-6">
                                <Card titleIconClassName="fas fa-battery-half" titleText="Status">
                                    {isLoading ? (
                                        <ComponentLoader color={ComponentLoaderColor.SUCCESS} className="py-3" />
                                    ) : isEthProviderAvailable && isNetworkSupported ? (
                                        <>
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
                                                            <span>Anyone can contribute (FCFS is active).</span>
                                                        )}
                                                    </p>
                                                </>
                                            )}

                                            {(isActive || wasEnded) && (
                                                <>
                                                    <p className="card-text mb-0">
                                                        Collected ETHs ({collectedSupplyDisplay} / {totalSupplyDisplay})
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

                                            {!!account ? (
                                                isAccountWhitelisted || !allowWhiteListAddressesOnly ? (
                                                    <>
                                                        <p className="carc-text">
                                                            You are eligible to participate in our presale.
                                                        </p>

                                                        <p className="card-text mb-0">
                                                            Your contribution in ETHs ({accountContributionDisplay} /{' '}
                                                            {totalAccountContributionDisplay})
                                                        </p>

                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar bg-success"
                                                                role="progressbar"
                                                                style={{
                                                                    width: `${accountContributionPercent}%`,
                                                                }}
                                                                aria-valuenow={accountContributionPercent}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="card-text">
                                                        You are not eligible to participate in our presale.
                                                    </p>
                                                )
                                            ) : (
                                                <Alert type={AlertType.INFO}>
                                                    Connect your wallet via MetaMask to check your contribution.
                                                </Alert>
                                            )}
                                        </>
                                    ) : (
                                        <Alert type={AlertType.WARNING}>Contract data is unavailable.</Alert>
                                    )}
                                </Card>
                            </div>

                            <div className="col-12 mb-4 col-md-6">
                                <Card titleIconClassName="fas fa-file-signature" titleText="Contracts">
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

                        <div className="row">
                            <div className="col mb-4">
                                <Card titleIconClassName="fas fa-info-circle" titleText="Presale Info">
                                    <p className="card-text">
                                        Presale will be conducted in the manner described here. By the time you're
                                        reading this, presale contract with all the other contracts will be deployed.
                                        The presale contract address can be found on our Disord server, Telegram and on
                                        this page. Verify that the contract's address match on all of the stated
                                        sources.
                                    </p>

                                    <p className="card-text">
                                        Once we start the presale, only whitelisted addresses will be able to
                                        contribute. Presale will stop as soon as the hard cap is reached. If the hard
                                        cap isn't reached, we will open contributions for everyone on the FCFS basis.
                                        FCFS duration will be announced on our official channels (Discord, Telegram).
                                    </p>

                                    <p className="card-text">
                                        Maximum contribution per address is 2.5 ETH. Contributing in multiple
                                        transactions is supported. For every invested ETH you will get 33 $UP tokens. So
                                        for a maximum contribution of 2.5 ETH you will receive 82.5 $UP tokens. Tokens
                                        are minted and sent to your address immediately after you make a contribution.
                                        Tokens are locked and not transferrable while the presale is active.
                                    </p>

                                    <p className="card-text">
                                        Once the presale ends, 40% of collected funds will automatically be transferred
                                        to the team's address. For the other 60%, $UP tokens will be minted (minting
                                        ratio 1 ETH : 11 $UP). Those ETH along with the minted $UP will automatically be
                                        transferred to the Uniswap liquidity pool. Liquidity pool tokens will be sent to
                                        the liquidity lock contract where they will get locked for 2 years. At the same
                                        time $UP tokens for our farms will be minted and sent to the corresponding farm
                                        addresses. Once all of the above happens tokens will be unlocked and
                                        transferrable, Uniswap trading will start and farming will be enabled.
                                        Everything is automated, there will be no delays. Once we hit the "end presale"
                                        button, our token will be live.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Presale;
