import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './Router/router.jsx';
import { RouterProvider } from 'react-router';
import AuthProvider from './AuthProvider/authProvider.jsx';
import { ThemeProvider } from './AuthProvider/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
