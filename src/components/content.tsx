import { useContext } from 'react';
import { AlertType } from './alert';
import MetaMaskAlert from './metamask-alert';
import { Web3Context } from './web3-context-provider';

const Content: React.FC<{}> = ({ children }) => {
    const web3Context = useContext(Web3Context);

    if (web3Context.isLoading) {
        return null;
    }

    return (
        <main>
            {!web3Context.isMetaMaskAvailable && (
                <MetaMaskAlert type={AlertType.DANGER}>
                    MetaMask was not detected. If you wish to use our site, please install MetaMask extension.
                </MetaMaskAlert>
            )}

            {web3Context.isMetaMaskAvailable && web3Context.isInvalidNetworkSelected && (
                <MetaMaskAlert type={AlertType.DANGER}>
                    Sorry the selected Ethereum network in MetaMask is not supported.
                </MetaMaskAlert>
            )}

            {children}
        </main>
    );
};

export default Content;
