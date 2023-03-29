import { useEffect } from "react"

export default function useOutsideClick(ref, callback, opened) {

    useEffect(() => {
        const handleClick = e => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom ? true : false
                if (outside) {
                    callback()
                }
            }
        }
        if (opened) {
            setTimeout(() => {document.addEventListener('click', handleClick)})
        } else {
            document.removeEventListener('click', handleClick)
        }
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [ref, callback, opened])
}