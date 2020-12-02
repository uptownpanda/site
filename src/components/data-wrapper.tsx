import React, { useContext } from 'react';
import Alert, { AlertType } from './alert';
import ComponentLoader, { ComponentLoaderColor } from './component-loader';
import { Web3Context } from './web3-context-provider';

interface DataWrapperProps {
    isLoading: boolean;
    isDataAvailable: boolean;
    connectWalletText?: string;
}

const DataWrapper: React.FC<DataWrapperProps> = ({ isLoading, isDataAvailable, connectWalletText, children }) => {
    const { account } = useContext(Web3Context);

    return isLoading ? (
        <ComponentLoader color={ComponentLoaderColor.SUCCESS} className="py-3" />
    ) : isDataAvailable ? (
        !connectWalletText || !!account ? (
            <>{children}</>
        ) : (
            <Alert type={AlertType.INFO} className="mb-0">
                {connectWalletText}
            </Alert>
        )
    ) : (
        <Alert type={AlertType.WARNING} className="mb-0">
            Contract data is unavailable.
        </Alert>
    );
};

export default DataWrapper;
