import { createContext, useContext, useReducer } from 'react'
import { employees } from '../fixtures/employees'

const EmployeesContext = createContext([])

const initialEmployees = () => {
  const storage = localStorage.getItem('employees')
  return storage && JSON.parse(storage).length > 0? JSON.parse(storage) : employees
}
export function EmployeesProvider({ children }) {
  const [employees, dispatch] = useReducer(
    employeesReducer,
    initialEmployees()
  )
  return (
    <EmployeesContext.Provider value={[employees, dispatch]}>
      {children}
    </EmployeesContext.Provider>
  )
}

export function useEmployeesContext() {
  const [employees] = useContext(EmployeesContext)
  return employees
}
export function useEmployeesDispatch() {
  const [employees, dispatch] = useContext(EmployeesContext)
  return dispatch

}

function employeesReducer(employees, action) {
  switch (action.type) {
    case 'add': {
      const getNewId = () => {
        if (employees.length === 0) {
          return 1
        } else {
          const ids = employees.map(empl => { return typeof empl.id === 'number' ? empl.id : 0 })
          return Math.max(...ids) + 1
        }
      }
      const newEmployee = { ...action.employee, id: getNewId() }
      const updatedEmployees = [...employees, newEmployee]
      localStorage.setItem('employees', JSON.stringify(updatedEmployees))
      return updatedEmployees
    }
    case 'modify': {
      return employees.map(employee => {
        if (employee.id === action.employee.id) {
          return action.employee;
        } else {
          return employee;
        }
      });
    }
    case 'delete': {
      const updatedEmployees = employees.filter(employee => employee.id !== action.id)
      localStorage.setItem('employees', JSON.stringify(updatedEmployees))
      return updatedEmployees
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

