import cn from 'classnames';

export interface ActionButtonProps {
    isLoading?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    className?: string;
    type?: 'submit' | 'button';
}

const ActionButton: React.FC<ActionButtonProps> = ({ isLoading, type, isDisabled, onClick, className, children }) => {
    const buttonClasses = cn('btn btn-outline-success font-weight-bold text-uppercase', className);

    return (
        <button
            type={type || 'button'}
            className={buttonClasses}
            onClick={onClick}
            disabled={!!isLoading || !!isDisabled}
        >
            {!isLoading ? (
                children
            ) : (
                <>
                    <span
                        className="button-loading-spinner spinner-border spinner-border-sm align-text-top mr-1"
                        role="status"
                        aria-hidden="true"
                    />
                    Loading...
                </>
            )}
        </button>
    );
};

export default ActionButton;
