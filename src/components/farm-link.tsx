import { Farm } from '../utils/enums';
import cn from 'classnames';

export interface FarmLinkProps {
    activeFarm: Farm;
    farm: Farm;
    onClick: (farm: Farm) => void;
}

const FarmLink: React.FC<FarmLinkProps> = ({ farm, activeFarm, onClick, children }) => {
    const linkClasses = cn('list-group-item list-group-item-action text-uppercase font-weight-bold', {
        active: farm === activeFarm,
        'list-group-item-success': farm === activeFarm,
    });

    return (
        <a
            className={linkClasses}
            href={`#farm-${farm}`}
            role="tab"
            onClick={(e) => {
                e.preventDefault();
                onClick(farm);
            }}
        >
            {children}
        </a>
    );
};

export default FarmLink;
