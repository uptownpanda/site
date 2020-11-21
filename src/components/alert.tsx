import cn from 'classnames';

export enum AlertType {
    WARNING = 'warning',
    DANGER = 'danger',
    INFO = 'info',
    SECONDARY = 'secondary',
    DARK = 'dark',
    LIGHT = 'light',
    SUCCESS = 'success',
}

export interface AlertProps {
    type: AlertType;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({ children, type, className }) => {
    const alertClasses = cn(className, {
        alert: true,
        [`alert-${type}`]: true,
    });

    return (
        <div className={alertClasses} role="alert">
            {children}
        </div>
    );
};

export default Alert;
