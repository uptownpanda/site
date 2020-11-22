import { AbiItem } from 'web3-utils/types';

export default [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'idx',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'HarvestChunkAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'harvestChunkIdx',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'RewardClaimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'idx',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'intervalIdx',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalAmount',
                type: 'uint256',
            },
        ],
        name: 'SupplySnapshotAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'idx',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'intervalIdx',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalAmount',
                type: 'uint256',
            },
        ],
        name: 'SupplySnapshotUpdated',
        type: 'event',
    },
    {
        inputs: [],
        name: 'HARVEST_CHUNKS_COUNT',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'HARVEST_INTERVAL',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'HARVEST_STEP',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'REWARD_HALVING_INTERVAL',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'balances',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'farmTokenAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'harvestChunks',
        outputs: [
            {
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'totalAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'claimedAmount',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'harvestSnapshotIdxs',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'hasFarmingStarted',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'initialFarmUpSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'supplySnapshots',
        outputs: [
            {
                internalType: 'uint256',
                name: 'intervalIdx',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'upTokenAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_upToken',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_farmToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_initialFarmUpSupply',
                type: 'uint256',
            },
        ],
        name: 'startFarming',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'stake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'harvest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claimHarvestedReward',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'harvestableReward',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'claimableHarvestedReward',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'totalStakedSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'nextIntervalTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
    {
        inputs: [],
        name: 'currentIntervalTotalReward',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
] as AbiItem[];
