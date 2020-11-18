import cn from 'classnames';

export interface FooterSocialLinkProps {
    icon: string;
    href: string;
    title: string;
    isLast?: boolean;
}

const FooterSocialLink: React.FC<FooterSocialLinkProps> = ({ icon, href, title, isLast }) => {
    const aClasses = cn({
        'text-dark': true,
        'footer-social-link': true,
        'mr-2': !isLast,
        'd-inline-block': true,
    });

    return (
        <a href={href} title={title} className={aClasses} target="_blank">
            <i className={`fab fa-${icon}`} />
        </a>
    );
};

export default FooterSocialLink;
