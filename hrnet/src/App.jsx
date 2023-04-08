import React from 'react';
import './app.scss';
import CreateEmployee from './pages/CreateEmployee';
import ViewEmployees from './pages/ViewEmployees';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <CreateEmployee/>
    },
    {
      path: '/employees',
      element: <ViewEmployees/>
    }
  ])
  return (
    <div className="hr-app">
      <h1>HRnet</h1>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
