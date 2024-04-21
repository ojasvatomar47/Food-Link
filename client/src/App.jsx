import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
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

// NGO Pages
import NGOListingsPage from './pages/NGOPages/NGOListingsPage';
import NGOTransactionsPage from './pages/NGOPages/NGOTransactionsPage';

// Chat-Interface
import ChatRoomPage from './pages/ChatInterfacePages/ChatRoomPage/ChatRoomPage';

// Other Pages
import AboutPage from './pages/AboutPage/AboutPage';

// Error Pages
import NotFoundPage from './pages/ErrorPages/NotFoundPage/NotFoundPage';
import InternalServerErrorPage from './pages/ErrorPages/InternalServerErrorPage/InternalServerErrorPage';

const Layout = () => {

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )

};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/restaurant/listings",
        element: <RestaurantListingsPage />,
      },
      {
        path: "/restaurant/transactions",
        element: <RestaurantTransactionsPage />,
      },
      {
        path: "/ngo/listings",
        element: <NGOListingsPage />,
      },
      {
        path: "/ngo/transactions",
        element: <NGOTransactionsPage />,
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
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App