import { createContext, useContext, useReducer } from 'react'

const EmployeesContext = createContext([])

const initialEmployees = () => {
  const storage = localStorage.getItem('employees')
  return storage ? JSON.parse(storage) : []
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
  return useContext(EmployeesContext)[0]
}
export function useEmployeesDispatch() {
    return useContext(EmployeesContext)[1]
}

function employeesReducer(employees, action) {
  switch (action.type) {
    case 'add': {
      const updatedEmployees = [...employees, action.employee]
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
      return employees.filter(employee => employee.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

