import { useEffect } from 'react'
import { createContext, useContext, useReducer } from 'react'
import { employees } from '../fixtures/employees'

const EmployeesContext = createContext([])

// get initial employees state : localStorage or if empty the employee fixtures
const initialEmployees = () => {
  const storage = localStorage.getItem('employees')
  return storage && JSON.parse(storage).length > 0? JSON.parse(storage) : employees
}

//context provider component that has to be added on top of the app
export function EmployeesProvider({ children }) {
  const [employees, dispatch] = useReducer(
    employeesReducer,
    initialEmployees()
  )
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees))
  }, [employees])
  return (
    <EmployeesContext.Provider value={[employees, dispatch]}>
      {children}
    </EmployeesContext.Provider>
  )
}

//custom hook to return the employee list state
export function useEmployeesContext() {
  const [employees] = useContext(EmployeesContext)
  return employees
}

//custom hook to return the dispatch function needed to update the state
export function useEmployeesDispatch() {
  const dispatch = useContext(EmployeesContext)[1]
  return dispatch

}

// Employee reducer
function employeesReducer(employees, action) {
  switch (action.type) {
    case 'add': {
      // function that increments id for each new employee
      const getNewId = () => {
        //if no employees exists return '1'
        if (employees.length === 0) {
          return 1
        // else find the max id number and add 1 to get a new id number
        } else {
          const ids = employees.map(empl => { return typeof empl.id === 'number' ? empl.id : 0 })
          return Math.max(...ids) + 1
        }
      }
      // add the id property to the employee object
      const newEmployee = { ...action.employee, id: getNewId() }
      // add the new employee to the employees list
      const updatedEmployees = [...employees, newEmployee]
      //returns the updated list to update the context state
      return updatedEmployees
    }
    case 'delete': {
      //create a new employee list without the employee to delete
      const updatedEmployees = employees.filter(employee => employee.id !== action.id)
      //returns the updated list to update the context state
      return updatedEmployees
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

