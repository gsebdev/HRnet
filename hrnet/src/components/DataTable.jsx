import { useEffect, useMemo, useState } from "react"
import '../data-table.scss'
import sortArrow from '../icons/arrow.svg'

function useFilter(rows, filter) {
    const [filteredRows, setFilteredRows] = useState(rows)
    const [rowsToString, setRowsToString] = useState([])

    // create an array of strings to be able to test values with indexOf
    useEffect(() => {
        setRowsToString(rows.map(row => Object.values(row).toString()))
    }, [rows])

    //filter rows
    useEffect(() => {
        if (filter) {
            if (rowsToString.length === rows.length) {
                const filtered = rows.filter((row, index) => rowsToString[index].indexOf(filter) !== -1)
                setFilteredRows(filtered)
            }
        } else {
            setFilteredRows(rows)
        }

    }, [rowsToString, rows, filter])


    return { filteredRows }
}

function usePagination(rows, itemsPerPageSelectOptions) {

    const [displayedRows, setDisplayedRows] = useState([])
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(0)
    const [pageList, setPageList] = useState([])

    useEffect(() => {
        if (itemsPerPageSelectOptions) {
            const itemsNumber = typeof itemsPerPageSelectOptions[itemsPerPage] === 'number' ? itemsPerPageSelectOptions[itemsPerPage] : rows.length
            let rowsToDisplay = rows.slice(((page - 1) * itemsNumber), (page * itemsNumber))
            setPageList(Array.from([...Array(Math.ceil(rows.length / itemsNumber)).keys()], p => p + 1))
            if (rowsToDisplay.length === 0 && page > 1) {
                setPage(page - 1)
            } else {
                setDisplayedRows(rowsToDisplay)
            }
        } else {
            setDisplayedRows(rows)
        }

    }, [rows, itemsPerPage, page, itemsPerPageSelectOptions])

    return { displayedRows, page, itemsPerPage, pageList, setItemsPerPage, setPage }

}

export default function DataTable({ rows, columns, id, pagination = true, paginationSelectOptions, rowSelectable = true, selectionActions = [] }) {

    // check if data is string or number, otherwise convert it
    const checkedRows = useMemo(() => {
        return rows.map((row) => {
            for (const [key, value] of Object.entries(row)) {
                if (typeof value !== 'string' && typeof value !== 'number') {
                    if (value instanceof Date) {
                        row[key] = value.toLocaleDateString('en-EN')
                    } else if (value instanceof Array) {
                        row[key] = value.toString()
                    } else {
                        row[key] = 'data error'
                    }
                }
            }
            return row
        })

    }, [rows])

    const itemsPerPageSelectOptions = useMemo(() => {
        if (!pagination) {
            return null
        }
        return paginationSelectOptions ? paginationSelectOptions : [10, 25, 50, 100, 'All']
    }, [paginationSelectOptions, pagination])
    const [checked, setChecked] = useState([])
    const [sortColumn, setSortColumn] = useState({ index: null, order: null })
    const [sortedRows, setSortedRows] = useState(checkedRows)
    const [filter, setFilter] = useState('')

    const { filteredRows } = useFilter(sortedRows, filter)
    const { displayedRows, page, itemsPerPage, pageList, setItemsPerPage, setPage } = usePagination(filteredRows, itemsPerPageSelectOptions)
    console.log(pageList)
    useEffect(() => {
        const { index, order } = sortColumn
        if (index !== null && order !== null) {
            function compare(a, b) {
                a = columns[index].selector(a) || ''
                b = columns[index].selector(b) || ''
                let sortByDate = !isNaN(Date.parse(a)) && !isNaN(Date.parse(b)) ? true : false

                if (sortByDate) {
                    a = a ? new Date(a) : new Date(null)
                    b = b ? new Date(b) : new Date(null)
                }
                if (a > b) {
                    return order === 'descending' ? 1 : -1
                }
                if (a < b) {
                    return order === 'descending' ? -1 : 1
                }
                return 0
            }
            setSortedRows([...checkedRows].sort(compare))
        }
        else {
            setSortedRows([...checkedRows])
        }
    }, [sortColumn, columns, checkedRows])

    //handle click on th element
    const onSortClick = (index) => {

        let order = 'ascending'
        if (sortColumn.index === index && sortColumn.order === 'ascending') {
            order = 'descending'
        }
        setSortColumn({ index: index, order: order })
    }
    const onCheckRow = (id, check) => {
        const checkedSet = new Set(checked)
        if (check) {
            checkedSet.add(id)
        } else {
            checkedSet.delete(id)
        }
        setChecked([...checkedSet])

    }
    const checkAll = (e) => {
        if(e.target.checked) {
            setChecked(filteredRows.map(row => row.id))
        }else {
            setChecked([])
        }
    }
    return (
        <div className='SG-data-table'>
            <div className='SG-data-table__header'>
                <div className='SG-data-table__view-select'>
                    {pagination && <select defaultValue={itemsPerPage} onChange={(e) => { setItemsPerPage(e.target.value); setPage(1) }}>
                        {itemsPerPageSelectOptions.map((option, index) => {
                            return <option key={option + index + 'view-items-page'} value={index}>{option}</option>
                        })}
                    </select>}
                </div>
                <div className='SG-data-table__filter'>
                    <span>Search</span>
                    <input type="text" value={filter} onChange={(e) => { setFilter(e.target.value) }} />
                    {filter && <div className='SG-data-table__filter__delete' onClick={() => { setFilter('') }}></div>}
                </div>
            </div>
            <div className='SG-data-table__table-container'>
                <table id={id} className='SG-data-table__table'>
                    <thead>
                        <tr role='row'>
                            {rowSelectable && <th><input type="checkbox" checked={filteredRows.length === checked.length && filteredRows.length > 0 ? true : false}onChange={checkAll} /></th>}
                            {columns.map((column, index) => {
                                return <th
                                    key={column.name + index + 'thead'}
                                    className={index === sortColumn.index ? sortColumn.order + ' sorted' : ''}
                                    tabIndex={0} aria-controls={id}
                                    aria-sort={index === sortColumn.index ? sortColumn.order : ''}
                                    aria-label={`${column.name}: activate to sort column ${index === sortColumn.index && sortColumn.order === 'ascending' ? 'descending' : 'ascending'}`}
                                    rowSpan={1}
                                    colSpan={1}
                                    onClick={() => { onSortClick(index) }}
                                >
                                    <div>
                                        <span className='SG-data-table__head-text'>{column.name}</span>
                                        <span className={'SG-data-table__sort-icon' + (index === sortColumn.index ? ' ' + sortColumn.order : ' ascending')}><img src={sortArrow} alt='' /></span>
                                    </div>

                                </th>
                            })}

                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayedRows.map((row, y) => {
                                return (
                                    <tr key={row + y} role='row' className={y % 2 === 0 ? 'even' : 'odd'}>
                                        {rowSelectable && <td><input type="checkbox" checked={checked.indexOf(row.id) !== -1 ? true : false} onChange={(e) => { onCheckRow(row.id, e.target.checked) }} /></td>}
                                        {columns.map((column, x) => {
                                            return (
                                                <td key={column + x + y}>
                                                    {column.selector(row)}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div>
                {checked.length > 0 &&
                    <div className='SG-data-table__actions'>
                        {selectionActions.map((action, index) => {

                            return action.icon ? <span><img src={action.icon} alt={action.name} key={index + action} onClick={() => { action.fn(checked); setChecked([]) }} /></span> : <span key={index + action} onClick={() => { action.fn(checked); setChecked([]) }}>{action.name}</span>
                        })}
                        <span>{checked.length} row{checked.length === 1 ? '' : 's'} selected</span>
                    </div>
                }
            </div>
            {pagination && <div className="SG-data-table__pagination">
                <span>{filteredRows.length > 0 ? ((page - 1) * itemsPerPageSelectOptions[itemsPerPage]) + 1 : 0} - {(page * itemsPerPageSelectOptions[itemsPerPage]) > filteredRows.length ? filteredRows.length : (page * itemsPerPageSelectOptions[itemsPerPage])} of {filteredRows.length}</span>
                <div>
                    {pageList.length > 0 &&
                        <>
                            <button className={`SG-data-table__pagination__button-navigation${page === 1 ? ' inactive' : ''}`} onClick={() => { if (page > 1) { setPage(page - 1) } }}>Previous</button>
                            {
                                pageList.map((p, index) => {
                                    return <button onClick={() => { setPage(p) }} className={`SG-data-table__pagination__button-page${p === page ? ' active' : ''}`} key={p + 'pagination' + index}>{p}</button>
                                })
                            }
                            <button className={`SG-data-table__pagination__button-navigation${page === pageList.length ? ' inactive' : ''}`} onClick={() => { if (page < pageList.length) { setPage(page + 1) } }}>Next</button>
                        </>
                    }
                </div>
            </div>}
        </div>

    )
}