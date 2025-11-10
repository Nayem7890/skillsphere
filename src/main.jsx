import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import NotFound from './pages/NotFound';
import MainLayout from './Layouts/MainLayout';
import Home from './pages/Home';
import AllCourses from './pages/AllCourses';
import PrivateRoute from './Routes/PrivateRoute';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './Providers/AuthProvider';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, 
        element: <Home /> 
      },
      { path: "courses", 
        element: <AllCourses />,
        loader: () => fetch('http://localhost:3000/courses')
      },
      { path: "courses/:id", 
        element: <PrivateRoute><CourseDetails /></PrivateRoute> 
      },
      { path: "login", 
        element: <Login /> 
      },
      { path: "register", 
        element: <Register /> 
      },
    ],
  },
]);

const qc = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{ duration: 2000, style: { fontSize: "14px" } }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);