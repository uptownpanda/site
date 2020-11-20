import Alert, { AlertType } from './alert';

export interface MetaMaskAlertProps {
    type: AlertType;
}

const MetaMaskAlert: React.FC<MetaMaskAlertProps> = ({ type, children }) => {
    return (
        <Alert type={type} className="px-0 rounded-0 mb-0">
            <div className="container-md">
                <div className="row">
                    <div className="col-12">{children}</div>
                </div>
            </div>
        </Alert>
    );
};

export default MetaMaskAlert;
