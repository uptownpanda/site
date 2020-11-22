import cn from 'classnames';

export interface CardProps {
    titleIconClassName: string;
    titleText: string;
}

const Card: React.FC<CardProps> = ({ children, titleIconClassName, titleText }) => {
    const titleIconClasses = cn({
        'mr-2': true,
        [titleIconClassName]: true,
    });

    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title font-weight-bold text-success">
                    <i className={titleIconClasses} />
                    {titleText}
                </h5>

                {children}
            </div>
        </div>
    );
};

export default Card;
