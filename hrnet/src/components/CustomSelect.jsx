import { useEffect, useRef, useState } from "react";
import '../custom-select.scss'

export default function CustomSelect({ options = [], selected = 0, onChange }) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState(selected)
    const lastSelectedOption = useRef(selected)
    
    useEffect(() => {
        lastSelectedOption.current = selected
        setSelectedOption(selected)
    }, [selected])

    const triggerChange = (option) => {
        if (option !== lastSelectedOption.current && onChange) {
            lastSelectedOption.current = option
            onChange(options[option], option)
        }

    }

    const toggleOptions = () => {
        if (isOptionsOpen) {
            triggerChange(selectedOption)
        }
        setIsOptionsOpen(!isOptionsOpen)

    }

    const setSelectedThenCloseDropdown = (index) => {
        setSelectedOption(index)
        setIsOptionsOpen(false)
        triggerChange(index)
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
    };

    const handleListKeyDown = (e) => {
        switch (e.key) {
            case "Escape":
                e.preventDefault()
                setIsOptionsOpen(false)
                break;
            case "ArrowUp":
                e.preventDefault()
                const optionUp = selectedOption - 1 >= 0 ? selectedOption - 1 : options.length - 1
                if (!isOptionsOpen) {
                    triggerChange(optionUp)
                }
                setSelectedOption(optionUp)
                break;
            case "ArrowDown":
                e.preventDefault()
                const optionDown = selectedOption === options.length - 1 ? 0 : selectedOption + 1
                if (!isOptionsOpen) {
                    triggerChange(optionDown)
                }
                setSelectedOption(optionDown)
                break
            default:
                break
        }
    };

    return (
        <div className="custom-select__wrapper">
            <div className="custom-select__container">
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOptionsOpen}
                    className={isOptionsOpen ? "expanded" : ""}
                    onClick={toggleOptions}
                    onKeyDown={handleListKeyDown}
                >
                    {options[selectedOption]}
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
                            id={option}
                            role="option"
                            aria-selected={selectedOption === index}
                            tabIndex={0}
                            onKeyDown={handleKeyDown(index)}
                            onClick={() => {
                                setSelectedThenCloseDropdown(index);
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};