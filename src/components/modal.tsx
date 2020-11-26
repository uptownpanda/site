import { useEffect, useRef } from 'react';
import cn from 'classnames';

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    id: string;
    ariaLabelledBy: string;
    title: string;
    titleIcon: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, titleIcon, title, id, ariaLabelledBy, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleIconClasses = cn('mr-2', titleIcon);

    useEffect(() => {
        if (!modalRef.current) {
            return;
        }
        (window as any).$(modalRef.current).modal(isOpen ? 'show' : 'hide');
    }, [isOpen, modalRef]);

    useEffect(() => {
        if (!modalRef.current) {
            return;
        }
        (window as any).$(modalRef.current).on('hide.bs.modal', () => setIsOpen(false));
    }, [setIsOpen, modalRef]);

    return (
        <div
            ref={modalRef}
            className="modal fade"
            id={id}
            tabIndex={-1}
            aria-labelledby={ariaLabelledBy}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title font-weight-bold text-success" id={ariaLabelledBy}>
                            <i className={titleIconClasses} />
                            {title}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
