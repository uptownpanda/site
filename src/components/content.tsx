import { useContext } from 'react';
import { AlertType } from './alert';
import MetaMaskAlert from './metamask-alert';
import { Web3Context } from './web3-context-provider';

const Content: React.FC<{}> = ({ children }) => {
    const { isEthProviderAvailable, isNetworkSupported, account } = useContext(Web3Context);

    return (
        <main>
            {!isEthProviderAvailable && (
                <MetaMaskAlert type={AlertType.DANGER}>
                    MetaMask was not detected. If you wish to use our site, please install MetaMask extension.
                </MetaMaskAlert>
            )}

            {isEthProviderAvailable && !isNetworkSupported && (
                <MetaMaskAlert type={AlertType.DANGER}>
                    Sorry the selected Ethereum network is not supported.
                </MetaMaskAlert>
            )}

            {isEthProviderAvailable && isNetworkSupported && !account && (
                <MetaMaskAlert type={AlertType.INFO}>
                    Connect your account by clicking on the navbar connect wallet button.
                </MetaMaskAlert>
            )}

            {children}
        </main>
    );
};

export default Content;
