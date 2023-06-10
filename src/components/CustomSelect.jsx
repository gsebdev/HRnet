import { useCallback, useEffect, useRef, useState } from "react";
import '../styles/custom-select.scss'
import useOutsideClick from "../hooks/useOusideClick";

export default function CustomSelect({ options = [], value, onChange, id, placeholder }) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)
    const lastSelectedOption = useRef(null)
    const selectRef = useRef(null)
    const containerRef = useRef(null)

    useOutsideClick(containerRef, () => {setIsOptionsOpen(false)}, isOptionsOpen)

    const triggerChange = useCallback((option) => {
        if (option !== lastSelectedOption.current && onChange) {
            lastSelectedOption.current = option
            onChange({target: selectRef.current})
        }

    }, [onChange])

    useEffect(() => {
        if(value) {
            let selected = null
            if(options && typeof options[0] === 'object') {
                selected = options.map(o => o.value).indexOf(value)
            } else {
                selected = options.indexOf(value)
            }
            lastSelectedOption.current = selected
            setSelectedOption(selected)
        }
        else {
            setSelectedOption(null)
        }
       
    }, [value, options])

    useEffect(() => {
        if(!isOptionsOpen) {
            triggerChange(selectedOption)
        }
    }, [isOptionsOpen, selectedOption, triggerChange])
    
    

    const toggleOptions = () => {
        setIsOptionsOpen(!isOptionsOpen)
    }

    const setSelectedThenCloseDropdown = (index) => {
        setSelectedOption(index)
        setIsOptionsOpen(false)
    }

    const handleKeyDown = (index) => (e) => {
        switch (e.key) {
            case " ":
            case "SpaceBar":
            case "Enter":
                e.preventDefault()
                setSelectedThenCloseDropdown(index)
                break
            default:
                break
        }
    }

    const handleListKeyDown = (e) => {
        switch (e.key) {
            case "Escape":
                e.preventDefault()
                setIsOptionsOpen(false)
                break;
            case "ArrowUp":
                e.preventDefault()
                const optionUp = selectedOption - 1 >= 0 ? selectedOption - 1 : options.length - 1
                setSelectedOption(optionUp)
                break;
            case "ArrowDown":
                e.preventDefault()
                const optionDown = selectedOption === options.length - 1 ? 0 : selectedOption + 1
                setSelectedOption(optionDown)
                break
            default:
                break
        }
    }

    return (
        <div className="custom-select" ref={containerRef}>
            <div className="custom-select__container">
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOptionsOpen}
                    className={(isOptionsOpen ? "expanded" : '') + (selectedOption !== null ? '' : ' placeholder' )}
                    onClick={toggleOptions}
                    onKeyDown={handleListKeyDown}
                    id={id}
                    value={selectedOption !== null ? typeof options[selectedOption] === 'object' ? options[selectedOption].value : options[selectedOption] : undefined}
                    ref={selectRef}
                >
                    {selectedOption !== null ? typeof options[selectedOption] === 'object' ? options[selectedOption].text : options[selectedOption] : placeholder}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6"/></svg>
                </button>
                <ul
                    className={`options ${isOptionsOpen ? "show" : ""}`}
                    role="listbox"
                    aria-activedescendant={options[selectedOption]}
                    tabIndex={-1}
                    onKeyDown={handleListKeyDown}
                >
                    {options.map((option, index) => (
                        <li
                            key={typeof option === 'object' ? option.value + index : option + index}
                            role="option"
                            aria-selected={selectedOption === index}
                            tabIndex={0}
                            onKeyDown={handleKeyDown(index)}
                            onClick={() => {
                                setSelectedThenCloseDropdown(index);
                            }}
                        >
                            {typeof option === 'object' ? option.text : option}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}