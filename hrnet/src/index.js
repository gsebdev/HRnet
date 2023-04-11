import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { EmployeesProvider } from './context/EmployeeContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EmployeesProvider>
      <App />
    </EmployeesProvider>
  </React.StrictMode>
)
