import cn from 'classnames';
import { FarmActionSection } from '../pages/farm';

export interface FarmActionLinkProps {
    activeSection: FarmActionSection;
    section: FarmActionSection;
    onClick: (section: FarmActionSection) => void;
}

const FarmActionLink: React.FC<FarmActionLinkProps> = ({ section, activeSection, onClick, children }) => {
    const linkClasses = cn('list-group-item list-group-item-action text-uppercase font-weight-bold', {
        active: section === activeSection,
        'list-group-item-success': section === activeSection,
    });

    return (
        <a
            className={linkClasses}
            href={`#farm-action-${section}`}
            role="tab"
            onClick={(e) => {
                e.preventDefault();
                onClick(section);
            }}
        >
            {children}
        </a>
    );
};

export default FarmActionLink;
