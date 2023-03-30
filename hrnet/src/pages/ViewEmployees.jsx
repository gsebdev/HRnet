import { useEmployeesContext } from "../EmployeeContext"

export default function ViewEmployees() {
    const employees = useEmployeesContext()
    console.log(employees)
    return (
        <>
            {employees.map((employee) => {
                return (<div>
                    {
                        Object.keys(employee).map(key => {
                            return <div>{key} : {employee[key]}</div>
                        })
                    }
                </div>)

            })
            }
        </>

    )
}