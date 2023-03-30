import { useEmployeesContext } from "../EmployeeContext"

export default function ViewEmployees() {
    const employees = useEmployeesContext()
    console.log(employees)
    return (
        <>
            {employees.map(employee => {
                return <div>{employee.firstName}</div>
            })}
        </>

    )
}