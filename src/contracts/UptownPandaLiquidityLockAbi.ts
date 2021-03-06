import { AbiItem } from 'web3-utils/types';

export default [
    {
        inputs: [
            {
                internalType: 'contract IERC20',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_releaseTime',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'beneficiary',
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
        inputs: [],
        name: 'release',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'releaseTime',
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
        name: 'token',
        outputs: [
            {
                internalType: 'contract IERC20',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
    },
] as AbiItem[];
