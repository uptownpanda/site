import { useContext } from 'react';
import { Web3Context } from './web3-context-provider';

export interface PresaleContractAddressProps {
    address: string | undefined;
}

const PresaleContractAddress: React.FC<PresaleContractAddressProps> = ({ address, children }) => {
    const { etherscan } = useContext(Web3Context);

    if (!address) {
        return null;
    }

    return (
        <li className="list-group-item">
            <label className="d-block mb-0">{children}</label>
            <a href={`${etherscan}/address/${address}`} target="_blank" className="text-success font-weight-bolder">
                {address}
            </a>
        </li>
    );
};

export default PresaleContractAddress;
