import React from 'react';
import './styles/app.scss';
import CreateEmployee from './pages/CreateEmployee';
import ViewEmployees from './pages/ViewEmployees';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";


function App() {
  // define the router
  const routerArray = [
    {
      path: '/',
      element: <CreateEmployee/>
    },
    {
      path: '/employees',
      element: <ViewEmployees/>
    }
  ]
  const router = process.env.REACT_APP_USE_HASH_ROUTER === 'true' ? createHashRouter(routerArray) : createBrowserRouter(routerArray)
  
  return (
    <div className="hr-app">
      <h1>HRnet</h1>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
