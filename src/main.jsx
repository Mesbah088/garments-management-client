import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { router } from './Router/router.jsx'
import {  Router, RouterProvider } from 'react-router'
import AuthProvider from './AuthProvider/authProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   
     
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
     
   
  </StrictMode>,
)
