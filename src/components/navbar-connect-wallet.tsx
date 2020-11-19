import { useContext } from 'react';
import { Web3Context } from './web3-context-provider';

const NavbarConnectWallet: React.FC<{}> = () => {
    const web3Context = useContext(Web3Context);

    if (web3Context.isLoading) {
        return null;
    }

    return (
        <form className="form-inline my-2 my-md-0">
            <button
                disabled={!web3Context.isMetaMaskAvailable}
                className="btn btn-sm btn-outline-danger navbar-connect-wallet"
                type="button"
            >
                Connect wallet
            </button>
        </form>
    );
};

export default NavbarConnectWallet;
