import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './components/UserContext.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import AuthForm from './components/AuthForm.jsx'
import BookingComponent from './components/BookingComponent.jsx'
import AllNails from './components/AllNails.jsx'
import OccupiedDatesDisplay from './components/OccupiedDatesDisplay.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children:[
      {path:"/", element: <BookingComponent></BookingComponent>},
      { 
        path:"/auth",
        element: (
          <GuestRoute>
            <AuthForm></AuthForm>
          </GuestRoute>
        ),
      },
      { 
        path:"/all-nails",
        element: (
          <AllNails></AllNails>
        ),
      },
      {
        path:'/my-bookings',
        element : (
          <OccupiedDatesDisplay></OccupiedDatesDisplay>
        )
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
