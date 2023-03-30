import { useEffect, useRef } from "react";
import useOutsideClick from "../hooks/useOusideClick";
import '../modal.scss'

export default function Modal({ visible, onClose, children }) {
    useEffect(() => {

        if (visible) {
            const body = document.body
            const scrollBarSize = window.innerWidth > body.offsetWidth ? window.innerWidth - body.offsetWidth : null
            body.style.overflow = 'hidden'

            if (scrollBarSize) {
                body.style.paddingRight = scrollBarSize + 'px'
                return () => {
                    body.style.paddingRight = ''
                    body.style.overflow = ''
                }
            }
            return () => {
                body.style.overflow = ''
            }
        }

    }, [visible])
    const ref = useRef()
    useOutsideClick(ref, onClose, visible)
    return (
        <>
            {visible &&
                <div className="modal">
                    <div ref={ref} className="modal__body">
                        <div className="modal__close" onClick={onClose} />
                        {children}
                    </div>

                </div>
            }
        </>


    )
}