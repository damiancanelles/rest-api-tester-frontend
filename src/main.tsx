import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './queryCient'
import "./index.css"
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Request from './pages/Request'
import Tests from './pages/Tests'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    
  },
  {
    path: "/apps/:appId",
    element: <Dashboard/>,
    children: [
      {
        path: "/apps/:appId/request/:requestId",
        element: <Request/>
      },
    ]
  },
  {
    path: "/apps/:appId/tests/",
    element: <Tests/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)