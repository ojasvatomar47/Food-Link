import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import RestaurantProfilePage from './pages/ProfilePages/RestaurantProfilePage/RestaurantProfilePage';
import CharityProfilePage from './pages/ProfilePages/CharityProfilePage/CharityProfilePage';
import SignUpPage from './pages/AuthenticationPages/SignUpPage/SignUpPage';
import SignInPage from './pages/AuthenticationPages/SignInPage/SignInPage';
import AboutPage from './pages/AboutPage/AboutPage';
import NotFoundPage from './pages/ErrorPages/NotFoundPage/NotFoundPage';
import InternalServerErrorPage from './pages/ErrorPages/InternalServerErrorPage/InternalServerErrorPage';
import FoodListingsPage from './pages/FoodListingsPages/FoodListingsPage/FoodListingsPage';
import SingleFoodListingPage from './pages/FoodListingsPages/SingleFoodListingPage/SingleFoodListingPage';
import RestaurantDashboardPage from './pages/DashboardPages/RestaurantDashboardPage/RestaurantDashboardPage';
import CharityDashboardPage from './pages/DashboardPages/CharityDashboardPage/CharityDashboardPage';

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
        path: "/dashboard/restaurant",
        element: <RestaurantDashboardPage />,
      },
      {
        path: "/dashboard/charity",
        element: <CharityDashboardPage />,
      },
      {
        path: "/profile/restaurant/:id", // Dynamic route for restaurant profile
        element: <RestaurantProfilePage />,
      },
      {
        path: "/profile/charity/:id", // Dynamic route for charity profile
        element: <CharityProfilePage />,
      },
      {
        path: "/foodListings/:restaurantId", // Dynamic route for food listings
        element: <FoodListingsPage />,
      },
      {
        path: "/singleFoodListing/:foodId", // Dynamic route for single food listing
        element: <SingleFoodListingPage />,
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