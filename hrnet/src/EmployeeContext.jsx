import { createContext, useContext, useReducer } from 'react'

const EmployeesContext = createContext([])

const initialEmployees = [
    { id: 0, firstName: 'Adam' },
    { id: 1, firstName: 'Seb' },
    { id: 2, firstName: 'Pierre'}
  ]
export function EmployeesProvider({ children }) {
  const [employees, dispatch] = useReducer(
    employeesReducer,
    initialEmployees
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
      return [...employees, action.employee];
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

