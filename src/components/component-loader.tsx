import cn from 'classnames';

export enum ComponentLoaderColor {
    WHITE = 'white',
    SUCCESS = 'success',
}

export interface ComponentLoaderProps {
    color: ComponentLoaderColor;
    className?: string;
}

const ComponentLoader: React.FC<ComponentLoaderProps> = ({ color, className }) => {
    const loaderClasses = cn('d-flex justify-content-center align-items-center', className);

    return (
        <div className={loaderClasses}>
            <div className={`spinner-border text-${color}`} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default ComponentLoader;
