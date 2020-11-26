import { useCallback, useContext, useEffect, useState } from 'react';
import UptownPandaFarmAbi from '../../contracts/UptownPandaFarmAbi';
import { Farm } from '../../utils/enums';
import { Web3Context } from '../web3-context-provider';
import { getFarmContractAddress } from './useFarm';
import useUpdateState from './useUpdateState';
import BN from 'bn.js';
import { Contract } from 'web3-eth-contract';

export interface IHarvestChunk {
    timestamp: number;
    amount: BN;
    isLoadingClaimed: boolean;
    claimed: BN;
}

interface IHarvestChunkCurrentData {
    claimedAmount: string;
}

interface IHarvestHistory {
    isLoading: boolean;
    isDataValid: boolean;
    isAccountConnected: boolean;
    hasFarmingStarted: boolean;
    harvestStepPercent: number;
    harvestInterval: number;
    harvestChunks: IHarvestChunk[];
}

export interface IHarvestChunkClaim {
    harvestChunkIdx: number;
    timestamp: number;
    amount: BN;
}

export interface IHarvestChunkClaims {
    harvestChunkIdx: number;
    areClaimsLoading: boolean;
    claims: IHarvestChunkClaim[];
}

const defaultHarvestHistory: IHarvestHistory = {
    isLoading: true,
    isDataValid: true,
    isAccountConnected: false,
    hasFarmingStarted: false,
    harvestStepPercent: 0,
    harvestInterval: 0,
    harvestChunks: [],
};

const defaultHarvestChunkClaims: IHarvestChunkClaims = {
    harvestChunkIdx: -1,
    areClaimsLoading: false,
    claims: [],
};

const useHarvestHistory = (farm: Farm, onClaimsLoaded: () => void) => {
    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const [farmContract, setFarmContract] = useState<Contract | null>(null);

    const [harvestChunkClaims, setHarvestChunkClaims] = useState<IHarvestChunkClaims>(defaultHarvestChunkClaims);
    const updateHarvestChunkClaims = useUpdateState(setHarvestChunkClaims);

    const [harvestHistory, setHarvestHistory] = useState<IHarvestHistory>(defaultHarvestHistory);
    const updateHarvestHistory = useUpdateState(setHarvestHistory);
    const updateHarvestHistoryChunk = useCallback(
        (harvestChunkId: number, claimed: BN) =>
            setHarvestHistory((currentHarvestHistory) => {
                const { harvestChunks } = currentHarvestHistory;
                const updatedHarvestChunks = [...harvestChunks];
                updatedHarvestChunks[harvestChunkId] = {
                    ...updatedHarvestChunks[harvestChunkId],
                    claimed,
                    isLoadingClaimed: false,
                };
                return {
                    ...currentHarvestHistory,
                    harvestChunks: updatedHarvestChunks,
                };
            }),
        [setHarvestHistory]
    );

    useEffect(() => {
        if (isWeb3ContextLoading) {
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            updateHarvestHistory({ isLoading: false, isDataValid: false });
            setFarmContract(null);
            return;
        }

        updateHarvestHistory({ isLoading: true, isDataValid: true, isAccountConnected: !!account });
        (async () => {
            const farmContractAddress = getFarmContractAddress(farm);
            const farmContract = new web3.eth.Contract(UptownPandaFarmAbi, farmContractAddress);
            setFarmContract(farmContract);

            const hasFarmingStarted = (await farmContract.methods.hasFarmingStarted().call()) as boolean;
            const harvestStepPercent = Number(await farmContract.methods.HARVEST_STEP().call());
            const harvestInterval = Number(await farmContract.methods.HARVEST_INTERVAL().call());
            const harvestChunks = !!account
                ? (
                      await farmContract.getPastEvents('HarvestChunkAdded', {
                          fromBlock: 0,
                          toBlock: 'latest',
                          filter: { staker: account },
                      })
                  ).map<IHarvestChunk>((harvestChunkAdded) => ({
                      timestamp: Number(harvestChunkAdded.returnValues.timestamp),
                      amount: new BN(harvestChunkAdded.returnValues.amount),
                      isLoadingClaimed: true,
                      claimed: new BN(0),
                  }))
                : [];

            let cancelUpdating = false;
            if (!!account) {
                for (let i = 0; i < harvestChunks.length; i++) {
                    (() => {
                        const harvestChunkId = i;
                        (async () => {
                            const harvestChunkClaimedAmount = new BN(
                                ((await farmContract.methods
                                    .harvestChunks(account, harvestChunkId)
                                    .call()) as IHarvestChunkCurrentData).claimedAmount
                            );
                            !cancelUpdating && updateHarvestHistoryChunk(harvestChunkId, harvestChunkClaimedAmount);
                        })();
                    })();
                }
            }

            updateHarvestHistory({
                isLoading: false,
                harvestChunks,
                hasFarmingStarted,
                harvestStepPercent,
                harvestInterval,
            });

            return () => {
                cancelUpdating = true;
            };
        })();
    }, [
        web3,
        isWeb3ContextLoading,
        isEthProviderAvailable,
        isNetworkSupported,
        farm,
        account,
        updateHarvestHistory,
        updateHarvestHistoryChunk,
        setFarmContract,
    ]);

    const onHarvestChunkClaimDetailsRequest = useCallback(
        (harvestChunkIdx: number) => {
            if (!account || !farmContract) {
                return;
            }

            updateHarvestChunkClaims({ harvestChunkIdx, areClaimsLoading: true });
            (async () => {
                const claims = (
                    await farmContract.getPastEvents('RewardClaimed', {
                        fromBlock: 0,
                        toBlock: 'latest',
                        filter: { staker: account, harvestChunkIdx: harvestChunkIdx.toString() },
                    })
                ).map<IHarvestChunkClaim>((rewardClaimed) => ({
                    harvestChunkIdx: Number(rewardClaimed.returnValues.harvestChunkIdx),
                    timestamp: Number(rewardClaimed.returnValues.timestamp),
                    amount: new BN(rewardClaimed.returnValues.amount),
                }));
                updateHarvestChunkClaims({ areClaimsLoading: false, claims });
                onClaimsLoaded();
            })();
        },
        [account, farmContract, updateHarvestChunkClaims, onClaimsLoaded]
    );

    return { harvestHistory, harvestChunkClaims, onHarvestChunkClaimDetailsRequest };
};

export default useHarvestHistory;
