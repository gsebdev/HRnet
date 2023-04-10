import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../datepicker.scss'
import useOutsideClick from '../hooks/useOusideClick'

export default function DatePicker({id, onChange, value = ''}) {
    const now = useMemo(() => new Date(), [])
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
    const [selectedYear, setSelectedYear] = useState(now.getFullYear())
    const [displayedWeeks, setDisplayedWeeks] = useState([])
    const [opened, setOpened] = useState(false)
    const [selectionTab, setSelectionTab] = useState('day')
    const [yearsArray, setYearsArray] = useState([])
    const [triggerChange, setTriggerChange] = useState(false)

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const prefix = 'HRnet-datepicker'
    const datepickerRef = useRef(null)
    const dateInputRef = useRef(null)
    
    const closeAndReset = useCallback(() => {
        setOpened(false)
        setSelectionTab('day')
        const resetMonth = selectedDate ? selectedDate.getMonth() : now.getMonth()
        const resetYear = selectedDate ? selectedDate.getFullYear() : now.getFullYear()
        setSelectedMonth(resetMonth)
        setSelectedYear(resetYear)
    }, [now, selectedDate])

    const formatDate = date => {
        const formatNumber = number => number < 10 ? '0' + number : number
        const month = formatNumber(date.getMonth() + 1)
        const day = formatNumber(date.getDate())
        const year = date.getFullYear()
        return month + '/' + day + '/' + year
    }
    useEffect(() => {
        if(!value){
            setSelectedDate(null)
        }else{
            new Date(value)
        }
        
    }, [value])
    useEffect(() => {
        if(triggerChange) {
            onChange({target: dateInputRef.current})
            setTriggerChange(false)
        }
    }, [triggerChange, onChange])

    useOutsideClick(datepickerRef, closeAndReset, opened)
    
    useEffect(() => {
        const years = []
        for (let y = selectedYear - 10; y < selectedYear + 10; y++) {
            years.push(y)
        }
        setYearsArray(years)
    }, [selectedYear])

    useEffect(() => {
        function getMonthLength(year, month) {
            const monthLastDate = new Date(year, month + 1, 0)
            return monthLastDate.getDate()
        }
        //get the first date object of the month
        const currentMonthFirstDate = new Date(selectedYear, selectedMonth, 1)
        //get the day number of the week of the first date of the month
        const currentMonthFirstDay = currentMonthFirstDate.getDay()
        // get the current month length
        const currentMonthLastDate = getMonthLength(selectedYear, selectedMonth)
        // initialize a new array
        const calendarArray = []
        const numberOfWeeksToDisplay = currentMonthFirstDay + currentMonthLastDate > 35 ? 6 : 5
        for (let week = 0; week < numberOfWeeksToDisplay; week++) {
            const weekArray = []
            const dayStartPosition = (week * 7) - currentMonthFirstDay
            for (let day = 1; day <= 7; day++) {
                const dayPosition = dayStartPosition + day
                weekArray.push(new Date(selectedYear, selectedMonth, dayPosition))
            }
            calendarArray.push(weekArray)
        }
        setDisplayedWeeks(calendarArray)

    }, [selectedYear, selectedMonth])

    
    const onYearChange = (value) => {
        setSelectionTab('day')
        setSelectedYear(value)
    }
    const onMonthChange = (index) => {
        setSelectionTab('day')
        setSelectedMonth(index)
    }
    const onDayClick = (e) => {
        const newDate = new Date(e.target.closest('.' + prefix + '__day').id)
        setSelectedDate(newDate)
        setOpened(false)
        setTriggerChange(true)
    }

    const onInputClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (opened) {
            closeAndReset()
        } else {
            setOpened(true)
        }

    }
    const onTodayClick = () => {
        setSelectedMonth(now.getMonth())
        setSelectedYear(now.getFullYear())
    }
    const onNavClick = (e, direction, dateElement = 'day') => {
        e.preventDefault()
        switch (dateElement) {
            case 'day': {
                if (direction === 'prev') {
                    if (selectedMonth === 0) {
                        setSelectedMonth(11)
                        setSelectedYear(selectedYear - 1)
                    } else {
                        setSelectedMonth(selectedMonth - 1)
                    }
                }
                if (direction === 'next') {
                    if (selectedMonth === 11) {
                        setSelectedMonth(0)
                        setSelectedYear(selectedYear + 1)
                    } else {
                        setSelectedMonth(selectedMonth + 1)
                    }
                }
                break
            }
            case 'year': {
                if (direction === 'prev') {
                    const years = []
                    for (let y = yearsArray[0] - 20; y < yearsArray[0]; y++) {
                        years.push(y)
                    }
                    setYearsArray(years)
                }
                if (direction === 'next') {
                    const years = []
                    for (let y = yearsArray[yearsArray.length - 1] + 1; y <= yearsArray[yearsArray.length - 1] + 20; y++) {
                        years.push(y)
                    }
                    setYearsArray(years)
                }
                break
            }
            default: break
        }
    }
    const changeSelectionTab = (e = null, tab) => {
        if (e) {
            e.preventDefault()
        }
        setSelectionTab(tab)
    }

 

    return (
        <div className={prefix}>
            <div className={prefix + "__input-container"} onKeyDown={onInputClick} onClick={onInputClick}>
                <input type="text" id={id} value={selectedDate ? formatDate(selectedDate) : ''} readOnly={true} ref={dateInputRef} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='calendar-icon'>
                    <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z" />
                </svg>
            </div>

            {opened &&
                <div className={prefix + '__calendar-container'} ref={datepickerRef}>
                    {selectionTab === 'day' &&
                        <div>
                            <div className={prefix + '__navigation'}>
                                <div className={prefix + '__navigation-prev'} onClick={(e) => { onNavClick(e, 'prev') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                                <button onClick={(e) => { changeSelectionTab(e, 'month') }}>{monthNames[selectedMonth]}</button>
                                <button onClick={(e) => { changeSelectionTab(e, 'year') }}>{selectedYear}</button>
                                <div className={prefix + '__navigation-next'} onClick={(e) => { onNavClick(e, 'next') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                            </div>

                            <table className={prefix + '__body'}>
                                <thead className={prefix + '__header'}>
                                    <tr>
                                        {
                                            weekDays.map((day, index) => {
                                                return <th key={index + day}>{day}</th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        displayedWeeks.map((week, index) => {
                                            return <tr key={week.toString() + index}>
                                                {
                                                    week.map((date, index) => {
                                                        let className = prefix + '__day'
                                                        if (date.getMonth() !== selectedMonth) {
                                                            className += ' off-month'
                                                        }
                                                        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                                                            className += ' selected'
                                                        }
                                                        if (date.toDateString() === now.toDateString()) {
                                                            className += ' today'
                                                        }
                                                        return <td
                                                            key={date.toString() + index}
                                                            className={className}
                                                            id={`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
                                                            onClick={onDayClick}
                                                        >
                                                            {date.getDate()}

                                                        </td>
                                                    })
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>

                            </table>
                            <span className={prefix + '__today'} onClick={onTodayClick}>Today</span>
                        </div>
                    }
                    {selectionTab === 'month' &&
                        <div className={prefix + '__month-container'}>
                            {monthNames.map((month, index) => {
                                return <div className={`${prefix}__month${selectedMonth === index ? ' selected' : ''}`} key={month + index} onClick={() => { onMonthChange(index) }}>{month}</div>
                            })}
                        </div>
                    }
                    {selectionTab === 'year' &&
                        <div>
                            <div className={prefix + '__navigation'}>
                                <div className={prefix + '__navigation-prev'} onClick={(e) => { onNavClick(e, 'prev', 'year') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                                <span>{yearsArray[0] + ' - ' + yearsArray[yearsArray.length - 1]}</span>
                                <div className={prefix + '__navigation-next'} onClick={(e) => { onNavClick(e, 'next', 'year') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                            </div>
                            <div className={prefix + '__year-container'}>
                                {yearsArray.map((year, index) => {
                                    return <div className={`${prefix}__year${selectedYear === year ? ' selected' : ''}`} key={year + index} onClick={() => { onYearChange(year) }}>{year}</div>
                                })}
                            </div>
                        </div>
                    }
                </div>

            }

        </div >
    )
}