import { getEtherScanUrl } from '../utils/urls';

export interface PresaleContractAddressProps {
    address: string | undefined;
}

const PresaleContractAddress: React.FC<PresaleContractAddressProps> = ({ address, children }) => {
    if (!address) {
        return null;
    }

    return (
        <li className="list-group-item">
            <label className="d-block mb-0">{children}</label>
            <a
                href={getEtherScanUrl(`address/${address}`)}
                target="_blank"
                className="text-success font-weight-bolder"
            >
                {address}
            </a>
        </li>
    );
};

export default PresaleContractAddress;
