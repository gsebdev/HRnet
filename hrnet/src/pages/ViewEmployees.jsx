import { Link } from "react-router-dom"
import { DataTable } from "@gsebdev/react-data-table"
import { useEmployeesContext, useEmployeesDispatch } from "../context/EmployeeContext"
import deleteIcon from '../icons/delete.svg'

export default function ViewEmployees() {
    const employees = useEmployeesContext()
    const dispatch = useEmployeesDispatch()

    // define columns to display for the data table
    const columns = [
        {
            name: 'First Name',
            selector: row => row?.firstName
        },
        {
            name: 'Last Name',
            selector: row => row?.lastName
        },
        {
            name: 'Start Date',
            selector: row => row?.startDate
        },
        {
            name: 'Department',
            selector: row => row?.department
        },
        {
            name: 'Date of Birth',
            selector: row => row?.dateOfBirth
        },
        {
            name: 'Street',
            selector: row => row?.address?.street
        },
        {
            name: 'City',
            selector: row => row?.address?.city
        },
        {
            name: 'State',
            selector: row => row?.address?.state
        },
        {
            name: 'Zip Code',
            selector: row => row?.address?.zipCode
        },
    ]

    // function that delete one row
    const deleteRows = (checked) => {
        checked.forEach(id => {
            dispatch({
                type: 'delete',
                id: id
            })
        })
    }
    return (
        <>
            <Link to='/'>Create a new Employee</Link>
            <h2>Current Employees</h2>
            <DataTable
                rows={employees}
                columns={columns}
                id='employeeTable'
                selectionActions={[
                    {
                        name: 'Delete selected',
                        icon: deleteIcon,
                        fn: deleteRows 
                    }
                ]}

            />
        </>


    )
}