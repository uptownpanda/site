import { useContext } from 'react';
import { Web3Context } from './web3-context-provider';

const NavbarConnectWallet: React.FC<{}> = () => {
    const { account, isEthProviderAvailable, connect, etherscan } = useContext(Web3Context);

    return (
        <form className="form-inline my-2 my-md-0">
            {!account ? (
                <button
                    disabled={!isEthProviderAvailable}
                    className="btn btn-sm btn-outline-danger connect-wallet"
                    type="button"
                    onClick={connect}
                >
                    Connect wallet
                </button>
            ) : (
                <a
                    className="btn btn-sm btn-outline-success connect-wallet"
                    href={`${etherscan}/address/${account}`}
                    target="_blank"
                >
                    Account: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </a>
            )}
        </form>
    );
};

export default NavbarConnectWallet;
