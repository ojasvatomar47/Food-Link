import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Dashboard
import HomePage from './pages/HomePage/HomePage';

// Authentication Pages
import SignUpPage from './pages/AuthenticationPages/SignUpPage/SignUpPage';
import SignInPage from './pages/AuthenticationPages/SignInPage/SignInPage';

// Restaurant Pages
import RestaurantListingsPage from './pages/RestaurantPages/RestaurantListingsPage';
import RestaurantTransactionsPage from './pages/RestaurantPages/RestaurantTransactionsPage';
import RestaurantProfilePage from './pages/RestaurantPages/RestaurantProfilePage'

// NGO Pages
import NGOListingsPage from './pages/NGOPages/NGOListingsPage';
import NGOTransactionsPage from './pages/NGOPages/NGOTransactionsPage';
import NGOProfilePage from './pages/NGOPages/NGOProfilePage'

// Chat-Interface
import ChatRoomPage from './pages/ChatInterfacePages/ChatRoomPage/ChatRoomPage';

// Other Pages
import AboutPage from './pages/AboutPage/AboutPage';

// Context
import { DarkModeProvider } from './context/DarkModeContext';

// Error Pages
import NotFoundPage from './pages/ErrorPages/NotFoundPage/NotFoundPage';
import InternalServerErrorPage from './pages/ErrorPages/InternalServerErrorPage/InternalServerErrorPage';

const Layout = () => {

  return (
    <>
      <Navbar transparent />
      <Outlet />
      <Footer />
    </>
  )

};

const PrivateRoute = ({ children }) => {
  if (!localStorage.getItem('user')) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <PrivateRoute><HomePage /></PrivateRoute>,
      },
      {
        path: "/restaurant/listings",
        element: <PrivateRoute><RestaurantListingsPage /></PrivateRoute>,
      },
      {
        path: "/restaurant/transactions",
        element: <PrivateRoute><RestaurantTransactionsPage /></PrivateRoute>,
      },
      {
        path: "/restaurant/profile",
        element: <PrivateRoute><RestaurantProfilePage /></PrivateRoute>,
      },
      {
        path: "/ngo/listings",
        element: <PrivateRoute><NGOListingsPage /></PrivateRoute>,
      },
      {
        path: "/ngo/transactions",
        element: <PrivateRoute><NGOTransactionsPage /></PrivateRoute>,
      },
      {
        path: "/ngo/profile/",
        element: <PrivateRoute><NGOProfilePage /></PrivateRoute>,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ]
  },
  {
    path: "/sign-up",
    element: <SignUpPage />
  },
  {
    path: "/sign-in",
    element: <SignInPage />
  },
  {
    path: "/chat/:orderId",
    element: <ChatRoomPage />
  },
  {
    path: "/error/notfound",
    element: <NotFoundPage />,
  },
  {
    path: "/error/internalserver",
    element: <InternalServerErrorPage />,
  },
]);


const App = () => {

  return (
    <DarkModeProvider>
      <div className=''>
        <RouterProvider router={router} />
      </div>
    </DarkModeProvider>
  )
}

export default App