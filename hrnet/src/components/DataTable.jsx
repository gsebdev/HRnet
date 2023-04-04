import { useEffect, useState } from "react"
import '../data-table.scss'
import sortArrow from '../icons/arrow.svg'

function useFilter(rows, filter) {
    const [filteredRows, setFilteredRows] = useState(rows)
    const [rowsToString, setRowsToString] = useState([])

    // create an array of strings to be able to test values with indexOf
    useEffect(() => {
        console.log('tostring')
        setRowsToString(rows.map(row => Object.values(row).toString()))
    }, [rows])

    //filter rows
    useEffect(() => {
        console.log('filter')
        if(filter){
            if(rowsToString.length === rows.length) {
                const filtered = rows.filter((row, index) => rowsToString[index].indexOf(filter) !== -1)
                 setFilteredRows(filtered) 
             }
        }else{
            setFilteredRows(rows)
        }
       
    }, [rowsToString, rows, filter])

    
    return { filteredRows }
}


export default function DataTable({ rows, columns, id }) {
    const [sortColumn, setSortColumn] = useState({ index: null, order: null })
    const [sortedRows, setSortedRows] = useState(rows)
    const [filter, setFilter] = useState('')

    const { filteredRows } = useFilter(sortedRows, filter)

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
            setSortedRows([...rows].sort(compare))
        }
    }, [sortColumn, rows, columns])

    //handle click on th element
    const onSortClick = (index) => {

        let order = 'ascending'
        if (sortColumn.index === index && sortColumn.order === 'ascending') {
            order = 'descending'
        }
        setSortColumn({ index: index, order: order })
    }

    return (
        <>
        <input type="text" onChange={(e) => {setFilter(e.target.value)}}/>
            <table id={id} className='SG-data-table'>
                <thead>
                    <tr role='row'>
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
                        filteredRows.map((row, y) => {
                            return (
                                <tr key={row + y} role='row' className={y % 2 === 0 ? 'even' : 'odd'}>
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
        </>

    )
}