import Head from 'next/head';
import { useContext, useState } from 'react';
import { Farm as FarmType } from '../utils/enums';
import Card from '../components/card';
import Alert, { AlertType } from '../components/alert';
import useFarm from '../components/hooks/useFarm';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import Web3 from 'web3';
import { format as formatDate, fromUnixTime } from 'date-fns';
import { getEtherScanUrl } from '../utils/urls';
import FarmActionLink from '../components/farm-action-link';
import ActionButton from '../components/action-button';
import useOnClickLoadingButton from '../components/hooks/useOnClickLoadingButton';
import useFarmActionButtons from '../components/hooks/useFarmActionButtons';
import { Web3Context } from '../components/web3-context-provider';
import BN from 'bn.js';
import FarmSelection from '../components/farm-selection';
import cn from 'classnames';

export enum FarmActionSection {
    APPROVE = 'approve',
    STAKE = 'stake',
    WITHDRAW = 'withdraw',
    HARVEST = 'harvest',
    CLAIM = 'claim',
}

const getBuyFarmTokensLink = (farm: FarmType, farmTokenAddress: string) => {
    switch (farm) {
        case FarmType.UP:
            return `https://app.uniswap.org/#/swap?inputCurrency=${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}`;

        case FarmType.WETH:
        case FarmType.WBTC:
            return `https://info.uniswap.org/token/${farmTokenAddress}`;

        case FarmType.UP_ETH:
            return `https://app.uniswap.org/#/add/ETH/${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}`;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const farmTokenValueDisplayer = (farm: FarmType, amount: BN) => {
    switch (farm) {
        case FarmType.WBTC:
            return Web3.utils.fromWei(amount.mul(new BN(10)), 'gwei');

        default:
            return Web3.utils.fromWei(amount);
    }
};

const Farm: React.FC<{}> = () => {
    const { account } = useContext(Web3Context);
    const [activeFarm, setActiveFarm] = useState<FarmType>(FarmType.UP);
    const { farmData, refreshFarmData } = useFarm(activeFarm);
    const {
        isLoading,
        farmToken,
        farmContract,
        farmTokenContract,
        hasFarmingStarted,
        totalUpSupply,
        dailyUpReward,
        nextHalvingTimestamp,
        userData,
    } = farmData;
    const {
        hasApproved,
        apyPercent,
        availableAmountForStaking,
        isApyLoading,
        stakedAmount,
        totalHarvestedReward,
        totalStakedAmount,
        claimableHarvestedReward,
        harvestableReward,
        isLoading: isAccountDataLoading,
    } = userData;

    const isDataValid = !isLoading && !!farmContract && !!farmTokenContract;
    const farmAddress = !!farmContract ? farmContract.options.address : '';
    const farmTokenAddress = !!farmTokenContract ? farmTokenContract.options.address : '';
    const isAccountConnected = !!account;
    const totalUpSupplyDisplay = Web3.utils.fromWei(totalUpSupply);
    const dailyUpRewardDisplay = Web3.utils.fromWei(dailyUpReward);
    const nextHalvingFormatted =
        nextHalvingTimestamp > 0 ? formatDate(fromUnixTime(nextHalvingTimestamp), 'PPppp') : '';
    const yourStakeDisplay = farmTokenValueDisplayer(activeFarm, stakedAmount);
    const totalStakeDisplay = farmTokenValueDisplayer(activeFarm, totalStakedAmount);
    const totalStakeNumber = Number(totalStakeDisplay);
    const yourStakeNumber = Number(yourStakeDisplay);
    const yourStakePercent = totalStakeNumber > 0 ? (yourStakeNumber * 100) / totalStakeNumber : 0;
    const yourDailyUpReward = dailyUpReward
        .mul(Web3.utils.toBN(Math.floor(yourStakePercent)))
        .div(Web3.utils.toBN(100));
    const yourDailyUpRewardDisplay = Web3.utils.fromWei(yourDailyUpReward);
    const harvestableRewardDisplay = Web3.utils.fromWei(harvestableReward);
    const claimableHarvestedRewardDisplay = Web3.utils.fromWei(claimableHarvestedReward);
    const totalHarvestedRewardDisplay = Web3.utils.fromWei(totalHarvestedReward);

    const availableAmountForStakingDisplay = farmTokenValueDisplayer(activeFarm, availableAmountForStaking);

    const showStaking = account?.toLowerCase() === process.env.NEXT_PUBLIC_FARM_STAKING_ADDRESS?.toLowerCase();
    const [actionSection, setActionSection] = useState<FarmActionSection>(FarmActionSection.APPROVE);

    const {
        onApproveClick,
        onStakeClick,
        onStakeAllClick,
        onWithdrawClick,
        onWithdrawAllClick,
        onHarvestClick,
        onClaimClick,
    } = useFarmActionButtons(farmContract, farmTokenContract, account, refreshFarmData);

    const { isLoading: isApproveLoading, onClickWithLoading: approveOnClickWithLoading } = useOnClickLoadingButton(
        onApproveClick
    );
    const [inputStakeAmount, setInputStakeAmount] = useState('');
    const isStakeDisabled = !hasApproved || availableAmountForStaking.isZero();
    const { isLoading: isStakeLoading, onClickWithLoading: stakeOnClickWithLoading } = useOnClickLoadingButton(
        async () => {
            const inputStakeAmountAsNumber = Number(inputStakeAmount);
            if (isNaN(inputStakeAmountAsNumber)) {
                alert('Please input a valid number.');
                return;
            }
            const inputStakeAmountAsBN = new BN(Web3.utils.toWei(inputStakeAmount));
            if (inputStakeAmountAsBN.lte(new BN(0)) || inputStakeAmountAsBN.gt(availableAmountForStaking)) {
                alert('Please input a valid number.');
                return;
            }
            await onStakeClick(inputStakeAmountAsBN);
            setInputStakeAmount('');
        }
    );
    const { isLoading: isStakeAllLoading, onClickWithLoading: stakeAllOnClickWithLoading } = useOnClickLoadingButton(
        async () => {
            await onStakeAllClick();
            setInputStakeAmount('');
        }
    );
    const areStakeInputsDisabled = isStakeDisabled || isStakeLoading || isStakeAllLoading;
    const [inputWithdrawAmount, setInputWithdrawAmount] = useState('');
    const isWithdrawDisabled = stakedAmount.isZero();
    const { isLoading: isWithdrawLoading, onClickWithLoading: withdrawOnClickWithLoading } = useOnClickLoadingButton(
        async () => {
            const inputWithdrawAmountAsNumber = Number(inputWithdrawAmount);
            if (isNaN(inputWithdrawAmountAsNumber)) {
                alert('Please input a valid number.');
                return;
            }
            const inputWithdrawAmountAsBN = new BN(Web3.utils.toWei(inputWithdrawAmount));
            if (inputWithdrawAmountAsBN.lte(new BN(0)) || inputWithdrawAmountAsBN.gt(stakedAmount)) {
                alert('Please input a valid number.');
                return;
            }
            await onWithdrawClick(inputWithdrawAmountAsBN);
            setInputWithdrawAmount('');
        }
    );
    const {
        isLoading: isWithdrawAllLoading,
        onClickWithLoading: withdrawAllOnClickWithLoading,
    } = useOnClickLoadingButton(async () => {
        await onWithdrawAllClick();
        setInputWithdrawAmount('');
    });
    const areWithdrawInputsDisabled = isWithdrawDisabled || isWithdrawLoading || isWithdrawAllLoading;
    const isHarvestDisabled = harvestableReward.isZero();
    const { isLoading: isHarvestLoading, onClickWithLoading: harvestOnClickWithLoading } = useOnClickLoadingButton(
        onHarvestClick
    );
    const isClaimDisabled = claimableHarvestedReward.isZero();
    const { isLoading: isClaimLoading, onClickWithLoading: claimOnClickWithLoading } = useOnClickLoadingButton(
        onClaimClick
    );

    const farmStatusClasses = cn('col-12 mb-4 col-sm-6', { 'mb-sm-0': !showStaking });
    const yourFarmShareClasses = cn('col-12 col-sm-6', { 'mb-4': showStaking });

    return (
        <>
            <Head>
                <title>Uptown Panda | Farm - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-6">
                <div className="row">
                    <div className="col-12">
                        <FarmSelection isLoading={isLoading} activeFarm={activeFarm} setActiveFarm={setActiveFarm} />
                    </div>
                </div>

                {!isLoading ? (
                    <div className="row mt-4">
                        {isDataValid ? (
                            hasFarmingStarted ? (
                                <>
                                    <div className={farmStatusClasses}>
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
                                                        href={getBuyFarmTokensLink(activeFarm, farmTokenAddress)}
                                                        className="text-success font-weight-bold"
                                                        target="_blank"
                                                    >
                                                        Buy farm tokens
                                                    </a>
                                                </span>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className={yourFarmShareClasses}>
                                        <Card titleIconClassName="fas fa-user-circle" titleText="Your farm share">
                                            {!isAccountDataLoading ? (
                                                <>
                                                    {!isAccountConnected && (
                                                        <Alert type={AlertType.WARNING}>
                                                            Connect your account to see your farm share.
                                                        </Alert>
                                                    )}

                                                    <div className="form-group">
                                                        <label className="mb-0 font-weight-bold">
                                                            Your / total staked
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

                                                    {showStaking && (
                                                        <div className="form-group">
                                                            <label className="mb-0 font-weight-bold">APY %</label>
                                                            <span className="d-block">
                                                                {isApyLoading ? 'Loading...' : apyPercent.toFixed(2)}%
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="form-group">
                                                        <label className="mb-0 font-weight-bold">
                                                            Harvestable reward
                                                        </label>
                                                        <span className="d-block">{harvestableRewardDisplay} $UP</span>
                                                    </div>

                                                    <div className="form-group mb-0">
                                                        <label className="mb-0 font-weight-bold">
                                                            Claimable / total harvested reward
                                                        </label>
                                                        <span className="d-block">
                                                            {claimableHarvestedRewardDisplay} /{' '}
                                                            {totalHarvestedRewardDisplay} $UP
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
                                    {showStaking && (
                                        <div className="col-12">
                                            <Card titleIconClassName="fas fa-cogs" titleText="Actions">
                                                <div className="row">
                                                    <div className="col-12 mb-4 col-sm-4 mb-sm-0 col-md-3">
                                                        <ul className="list-group">
                                                            <FarmActionLink
                                                                section={FarmActionSection.APPROVE}
                                                                activeSection={actionSection}
                                                                onClick={setActionSection}
                                                            >
                                                                Approve
                                                            </FarmActionLink>
                                                            <FarmActionLink
                                                                section={FarmActionSection.STAKE}
                                                                activeSection={actionSection}
                                                                onClick={setActionSection}
                                                            >
                                                                Stake
                                                            </FarmActionLink>
                                                            <FarmActionLink
                                                                section={FarmActionSection.WITHDRAW}
                                                                activeSection={actionSection}
                                                                onClick={setActionSection}
                                                            >
                                                                Withdraw
                                                            </FarmActionLink>
                                                            <FarmActionLink
                                                                section={FarmActionSection.HARVEST}
                                                                activeSection={actionSection}
                                                                onClick={setActionSection}
                                                            >
                                                                Harvest
                                                            </FarmActionLink>
                                                            <FarmActionLink
                                                                section={FarmActionSection.CLAIM}
                                                                activeSection={actionSection}
                                                                onClick={setActionSection}
                                                            >
                                                                Claim
                                                            </FarmActionLink>
                                                        </ul>
                                                    </div>
                                                    <div className="col-12 col-sm-8 col-md-9">
                                                        {!isAccountDataLoading ? (
                                                            isAccountConnected ? (
                                                                <>
                                                                    {actionSection === FarmActionSection.APPROVE && (
                                                                        <>
                                                                            <h3>Approve</h3>

                                                                            <p>
                                                                                In order for our farm smart contract to
                                                                                transfer your funds in and out of the
                                                                                farm, you need to make an approval first
                                                                                by clicking on the button below.
                                                                            </p>

                                                                            {hasApproved && (
                                                                                <Alert type={AlertType.SUCCESS}>
                                                                                    You approved successfully.
                                                                                </Alert>
                                                                            )}

                                                                            <ActionButton
                                                                                isLoading={isApproveLoading}
                                                                                onClick={approveOnClickWithLoading}
                                                                                isDisabled={hasApproved}
                                                                            >
                                                                                Approve
                                                                            </ActionButton>
                                                                        </>
                                                                    )}
                                                                    {actionSection === FarmActionSection.STAKE && (
                                                                        <>
                                                                            <h3>Stake</h3>

                                                                            <p>
                                                                                Input the amount of tokens you want to
                                                                                stake. Input amount must be bigger than
                                                                                zero and equal or less than your
                                                                                available balance.
                                                                            </p>

                                                                            {!hasApproved && (
                                                                                <Alert type={AlertType.WARNING}>
                                                                                    You need to approve before staking.
                                                                                </Alert>
                                                                            )}

                                                                            {availableAmountForStaking.isZero() && (
                                                                                <Alert type={AlertType.WARNING}>
                                                                                    You have no available funds for
                                                                                    staking.
                                                                                </Alert>
                                                                            )}

                                                                            <div className="form-group">
                                                                                <label className="mb-0 font-weight-bold">
                                                                                    Available for staking
                                                                                </label>
                                                                                <span className="d-block">
                                                                                    {availableAmountForStakingDisplay}{' '}
                                                                                    {farmToken}
                                                                                </span>
                                                                            </div>

                                                                            <div className="form-group">
                                                                                <form
                                                                                    className="form-inline"
                                                                                    onSubmit={(e) => {
                                                                                        e.preventDefault();
                                                                                        stakeOnClickWithLoading();
                                                                                    }}
                                                                                >
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            disabled={
                                                                                                areStakeInputsDisabled
                                                                                            }
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="amount to stake"
                                                                                            aria-label="amount to stake"
                                                                                            onChange={(e) =>
                                                                                                setInputStakeAmount(
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                            value={inputStakeAmount}
                                                                                        />
                                                                                        <div className="input-group-append">
                                                                                            <ActionButton
                                                                                                isLoading={
                                                                                                    isStakeLoading
                                                                                                }
                                                                                                isDisabled={
                                                                                                    areStakeInputsDisabled
                                                                                                }
                                                                                                type="submit"
                                                                                            >
                                                                                                Stake
                                                                                            </ActionButton>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="d-block w-100 d-md-none" />

                                                                                    <ActionButton
                                                                                        isLoading={isStakeAllLoading}
                                                                                        isDisabled={
                                                                                            areStakeInputsDisabled
                                                                                        }
                                                                                        className="mt-3 mt-md-0 ml-md-3"
                                                                                        onClick={
                                                                                            stakeAllOnClickWithLoading
                                                                                        }
                                                                                    >
                                                                                        Stake all
                                                                                    </ActionButton>
                                                                                </form>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    {actionSection === FarmActionSection.WITHDRAW && (
                                                                        <>
                                                                            <h3>Withdrawal</h3>

                                                                            <p>
                                                                                Input the amount of tokens you want to
                                                                                withdraw. Input amount must be bigger
                                                                                than zero and equal or less than your
                                                                                staked balance.
                                                                            </p>

                                                                            {stakedAmount.isZero() && (
                                                                                <Alert type={AlertType.WARNING}>
                                                                                    You have no available funds for
                                                                                    withdrawal.
                                                                                </Alert>
                                                                            )}

                                                                            <div className="form-group">
                                                                                <label className="mb-0 font-weight-bold">
                                                                                    Staked amount
                                                                                </label>
                                                                                <span className="d-block">
                                                                                    {yourStakeDisplay} {farmToken}
                                                                                </span>
                                                                            </div>

                                                                            <div className="form-group">
                                                                                <form
                                                                                    className="form-inline"
                                                                                    onSubmit={(e) => {
                                                                                        e.preventDefault();
                                                                                        withdrawOnClickWithLoading();
                                                                                    }}
                                                                                >
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            disabled={
                                                                                                areWithdrawInputsDisabled
                                                                                            }
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="amount to withdraw"
                                                                                            aria-label="amount to withdraw"
                                                                                            onChange={(e) =>
                                                                                                setInputWithdrawAmount(
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                            value={inputWithdrawAmount}
                                                                                        />
                                                                                        <div className="input-group-append">
                                                                                            <ActionButton
                                                                                                isLoading={
                                                                                                    isWithdrawLoading
                                                                                                }
                                                                                                isDisabled={
                                                                                                    areWithdrawInputsDisabled
                                                                                                }
                                                                                                type="submit"
                                                                                            >
                                                                                                Withdraw
                                                                                            </ActionButton>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="d-block w-100 d-lg-none" />

                                                                                    <ActionButton
                                                                                        isLoading={isWithdrawAllLoading}
                                                                                        isDisabled={
                                                                                            areWithdrawInputsDisabled
                                                                                        }
                                                                                        className="mt-3 mt-lg-0 ml-lg-3"
                                                                                        onClick={
                                                                                            withdrawAllOnClickWithLoading
                                                                                        }
                                                                                    >
                                                                                        Withdraw all
                                                                                    </ActionButton>
                                                                                </form>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    {actionSection === FarmActionSection.HARVEST && (
                                                                        <>
                                                                            <h3>Harvest</h3>

                                                                            <p>
                                                                                To harvest the reward and later on be
                                                                                able to claim it, click on the button
                                                                                below.
                                                                            </p>

                                                                            <div className="form-group">
                                                                                <label className="mb-0 font-weight-bold">
                                                                                    Harvestable reward
                                                                                </label>
                                                                                <span className="d-block">
                                                                                    {harvestableRewardDisplay} $UP
                                                                                </span>
                                                                            </div>

                                                                            <ActionButton
                                                                                isLoading={isHarvestLoading}
                                                                                onClick={harvestOnClickWithLoading}
                                                                                isDisabled={isHarvestDisabled}
                                                                            >
                                                                                Harvest
                                                                            </ActionButton>
                                                                        </>
                                                                    )}
                                                                    {actionSection === FarmActionSection.CLAIM && (
                                                                        <>
                                                                            <h3>Claim</h3>

                                                                            <p>
                                                                                Once the reward is harvested, you will
                                                                                be able to claim it in parts. Every day
                                                                                10% of the harvested reward will be
                                                                                released for claiming. After one day 10%
                                                                                is claimable, after two days 20% is
                                                                                claimable, and so on...
                                                                            </p>

                                                                            <div className="form-group">
                                                                                <label className="mb-0 font-weight-bold">
                                                                                    Claimable / total harvested reward
                                                                                </label>
                                                                                <span className="d-block">
                                                                                    {claimableHarvestedRewardDisplay} /{' '}
                                                                                    {totalHarvestedRewardDisplay} $UP
                                                                                </span>
                                                                            </div>

                                                                            <ActionButton
                                                                                isLoading={isClaimLoading}
                                                                                onClick={claimOnClickWithLoading}
                                                                                isDisabled={isClaimDisabled}
                                                                            >
                                                                                Claim
                                                                            </ActionButton>
                                                                        </>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <Alert type={AlertType.WARNING}>
                                                                    Connect your account to start farming!
                                                                </Alert>
                                                            )
                                                        ) : (
                                                            <ComponentLoader
                                                                color={ComponentLoaderColor.SUCCESS}
                                                                className="py-3"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
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
                ) : (
                    <ComponentLoader color={ComponentLoaderColor.WHITE} className="mt-6" />
                )}
            </div>
        </>
    );
};

export default Farm;
