import Head from 'next/head';
import { useState } from 'react';
import FarmLink from '../components/farm-link';
import { Farm as FarmType } from '../utils/enums';
import Card from '../components/card';
import Alert, { AlertType } from '../components/alert';
import useFarm from '../components/hooks/useFarm';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import Web3 from 'web3';
import { format as formatDate, fromUnixTime } from 'date-fns';
import { getEtherScanUrl } from '../utils/urls';
import useApyPercent from '../components/hooks/useApyPercent';

const Farm: React.FC<{}> = () => {
    const [activeFarm, setActiveFarm] = useState<FarmType>(FarmType.UP);
    const {
        isLoading,
        isDataValid,
        hasFarmingStarted,
        totalUpSupply,
        dailyUpReward,
        nextHalvingTimestamp,
        farmAddress,
        farmToken,
        buyFarmTokensLink,
        yourData,
    } = useFarm(activeFarm);

    const {
        claimableHarvestedReward,
        harvestableReward,
        isAccountConnected,
        isLoading: isAccountDataLoading,
        totalStake,
        yourStake,
    } = yourData;

    const totalUpSupplyDisplay = Web3.utils.fromWei(totalUpSupply);
    const dailyUpRewardDisplay = Web3.utils.fromWei(dailyUpReward);
    const nextHalvingFormatted =
        nextHalvingTimestamp > 0 ? formatDate(fromUnixTime(nextHalvingTimestamp), 'PPppp') : '';

    const yourStakeDisplay = Web3.utils.fromWei(yourStake);
    const totalStakeDisplay = Web3.utils.fromWei(totalStake);
    const totalStakeNumber = Number(totalStakeDisplay);
    const yourStakeNumber = Number(yourStakeDisplay);
    const yourStakePercent = totalStakeNumber > 0 ? (yourStakeNumber * 100) / totalStakeNumber : 0;
    const yourDailyUpReward = dailyUpReward.mul(Web3.utils.toBN(yourStakePercent)).div(Web3.utils.toBN(100));
    const yourDailyUpRewardDisplay = Web3.utils.fromWei(yourDailyUpReward);
    const harvestableRewardDisplay = Web3.utils.fromWei(harvestableReward);
    const claimableHarvestedRewardDisplay = Web3.utils.fromWei(claimableHarvestedReward);
    const apyPercent = useApyPercent(activeFarm, isAccountDataLoading, dailyUpReward, totalStake);
    const apyPercentDisplay = apyPercent.toFixed(2);

    return (
        <>
            <Head>
                <title>Uptown Panda | Farm - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-6">
                <div className="row">
                    <div className="col-12">
                        <div className="list-group list-group-horizontal-md" role="tablist">
                            <FarmLink onClick={setActiveFarm} activeFarm={activeFarm} farm={FarmType.UP}>
                                $UP farm
                            </FarmLink>
                            <FarmLink onClick={setActiveFarm} activeFarm={activeFarm} farm={FarmType.UP_ETH}>
                                $UP/ETH farm
                            </FarmLink>
                            <FarmLink onClick={setActiveFarm} activeFarm={activeFarm} farm={FarmType.WETH}>
                                WETH farm
                            </FarmLink>
                            <FarmLink onClick={setActiveFarm} activeFarm={activeFarm} farm={FarmType.WBTC}>
                                WBTC farm
                            </FarmLink>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <ComponentLoader color={ComponentLoaderColor.WHITE} className="mt-6" />
                ) : (
                    <div className="row mt-4">
                        {isDataValid ? (
                            hasFarmingStarted ? (
                                <>
                                    <div className="col-12 mb-4 col-sm-6">
                                        <Card titleIconClassName="fas fa-tractor" titleText="Farm status">
                                            <div className="form-group">
                                                <label className="mb-0 font-weight-bold">Initial farm supply</label>
                                                <span className="d-block">{totalUpSupplyDisplay} $UP</span>
                                            </div>

                                            <div className="form-group">
                                                <label className="mb-0 font-weight-bold">Total daily reward</label>
                                                <span className="d-block">{dailyUpRewardDisplay} $UP</span>
                                            </div>

                                            <div className="form-group">
                                                <label className="mb-0 font-weight-bold">
                                                    Next halving date and time
                                                </label>
                                                <span className="d-block">{nextHalvingFormatted}</span>
                                            </div>

                                            <div className="form-group">
                                                <label className="mb-0 font-weight-bold">Farm contract</label>
                                                <span className="d-block">
                                                    <a
                                                        href={getEtherScanUrl(`address/${farmAddress}`)}
                                                        className="text-success font-weight-bold"
                                                        target="_blank"
                                                    >
                                                        {farmAddress}
                                                    </a>
                                                </span>
                                            </div>

                                            <div className="form-group mb-0">
                                                <label className="mb-0 font-weight-bold">Farm token</label>
                                                <span className="d-block">
                                                    <a
                                                        href={buyFarmTokensLink}
                                                        className="text-success font-weight-bold"
                                                        target="_blank"
                                                    >
                                                        Buy farm tokens
                                                    </a>
                                                </span>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="col-12 mb-4 col-sm-6">
                                        <Card titleIconClassName="fas fa-user-circle" titleText="Your farm share">
                                            {!isAccountDataLoading ? (
                                                <>
                                                    {!isAccountConnected && (
                                                        <Alert type={AlertType.WARNING}>
                                                            Connect your account, to see your farm share.
                                                        </Alert>
                                                    )}

                                                    <div className="form-group">
                                                        <label className="mb-0 font-weight-bold">
                                                            Your staked / Total staked
                                                        </label>
                                                        <span className="d-block">
                                                            {yourStakeDisplay} {farmToken} / {totalStakeDisplay}{' '}
                                                            {farmToken} ({Math.floor(yourStakePercent)}%)
                                                        </span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="mb-0 font-weight-bold">
                                                            Your daily reward
                                                        </label>
                                                        <span className="d-block">{yourDailyUpRewardDisplay} $UP</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="mb-0 font-weight-bold">APY %</label>
                                                        <span className="d-block">{apyPercentDisplay}%</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="mb-0 font-weight-bold">
                                                            Harvestable reward
                                                        </label>
                                                        <span className="d-block">{harvestableRewardDisplay} $UP</span>
                                                    </div>

                                                    <div className="form-group mb-0">
                                                        <label className="mb-0 font-weight-bold">
                                                            Claimable harvested reward
                                                        </label>
                                                        <span className="d-block">
                                                            {claimableHarvestedRewardDisplay} $UP
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <ComponentLoader
                                                    color={ComponentLoaderColor.SUCCESS}
                                                    className="py-3"
                                                />
                                            )}
                                        </Card>
                                    </div>
                                    <div className="col-12">
                                        <Card titleIconClassName="fas fa-cogs" titleText="Actions"></Card>
                                    </div>
                                </>
                            ) : (
                                <div className="col">
                                    <Alert type={AlertType.WARNING}>Farming has not been started yet.</Alert>
                                </div>
                            )
                        ) : (
                            <div className="col">
                                <Alert type={AlertType.WARNING}>Contract data is unavailable.</Alert>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Farm;
