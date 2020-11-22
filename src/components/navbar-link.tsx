import Link from 'next/link';
import cn from 'classnames';

interface NavbarLinkProps {
    href: string;
    activeHref: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ href, activeHref, children }) => {
    const isActive = href === activeHref;

    const liClasses = cn({
        'nav-item': true,
        active: isActive,
    });

    return (
        <li className={liClasses}>
            <Link href={href}>
                <a className="nav-link font-weight-bold text-uppercase" href={href}>
                    {children} {isActive && <span className="sr-only">(current)</span>}
                </a>
            </Link>
        </li>
    );
};

export default NavbarLink;
