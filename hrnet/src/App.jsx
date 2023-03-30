import React, { useState } from 'react';
import './app.scss';
import CreateEmployee from './pages/CreateEmployee';
import ViewEmployees from './pages/ViewEmployees';


function App() {
  const [view, setView] = useState('create')

  const onViewClick = (e) => {
    e.preventDefault()
    const newView = view === 'create' ? 'list' : 'create'
    setView(newView)
  }
  return (
    <div className="hr-app">
      <h1>HRnet</h1>
      {view === 'create' &&
        <>
          <a href='/' onClick={onViewClick}>View Current Employees</a>
          <h2>Create Employee</h2>
          <CreateEmployee />
        </>
      }
      {view === 'list' &&
        <>
          <a href='/' onClick={onViewClick}>Create a new Employee</a>
          <h2>Current Employees</h2>
          <ViewEmployees />
        </>
      }


    </div>
  )
}

export default App;
