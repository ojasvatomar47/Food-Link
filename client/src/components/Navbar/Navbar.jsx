import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from '../../context/DarkModeContext';
import { BiSun, BiMoon } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';

export default function Navbar(props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  let location = useLocation();

  // console.log(location)

  const { user } = useAuth();

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const type = (user.userType === 'Restaurant') ? 'restaurant' : 'ngo';

  // Loading Dark Mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode !== isDarkMode) {
      toggleDarkMode();
    }
  }, [isDarkMode, toggleDarkMode]);

  const handleSignOut = () => {
    logout();
    navigate('/sign-in');
  };

  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav
      className={`top-0 z-50 w-full ${(location.pathname === '/' || location.pathname === '/ngo/profile' || location.pathname === '/restaurant/profile') ? 'bg-transparent absolute text-white' : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} shadow-2xl flex flex-wrap items-center justify-between px-2 py-3`}
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link
            className={`
              ${(location.pathname === '/' || location.pathname === '/ngo/profile' || location.pathname === '/restaurant/profile') ? 'text-white' : isDarkMode ? 'text-white' : 'text-gray-600'} font-mono text-lg md:text-2xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase
            `}
            to="/"
          >
            FOOD-LINK
          </Link>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            x
          </button>
          <button
            onClick={handleSignOut}
            className="bg-cyan-500 hover:bg-blue-600 text-white font-bold md:py-2 md:px-4 px-2 text-sm md:text-md rounded transition duration-300 ease-in-out"
          >
            Sign Out
          </button>
        </div>
        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none" +
            (navbarOpen ? " block rounded shadow-lg " : " hidden ")
          }
          id="example-navbar-warning"
        >
          <ul className="flex flex-col lg:flex-row text-xl list-none lg:ml-auto gap-5">
            <li>
              <button
                onClick={toggleDarkMode}
                className={`flex items-center text-lg md:text-xl lg:text-xl font-bold p-2 ${isDarkMode ? 'text-white' : 'text-gray-500'} border-gray-400 transition-colors duration-300`}
              >
                <span>
                  {isDarkMode ? <BiSun /> : <BiMoon />}
                </span>
              </button>
            </li>
            <Link to={`/${type}/listings`}>
              <li className="flex items-center">
                <p
                  className={`bg-gradient-to-r ${navbarOpen ? 'text-black' : isDarkMode ? 'text-white' : 'text-gray-500'} font-bold font-serif uppercase ${(location.pathname === '/' || location.pathname === '/ngo/profile' || location.pathname === '/restaurant/profile') ? (navbarOpen ? 'text-black' : 'text-white') : (navbarOpen && 'text-black')} px-4 py-2 rounded transition duration-300`}
                  type="button"
                >
                  Listings
                </p>
              </li>
            </Link>

            <Link to={`/${type}/transactions`}>
              <li className="flex items-center">
                <p
                  className={`bg-gradient-to-r ${navbarOpen ? 'text-black' : isDarkMode ? 'text-white' : 'text-gray-500'} font-bold font-serif uppercase ${(location.pathname === '/' || location.pathname === '/ngo/profile' || location.pathname === '/restaurant/profile') ? (navbarOpen ? 'text-black' : 'text-white') : (navbarOpen && 'text-black')} px-4 py-2 rounded transition duration-300`}
                  type="button"
                >
                  Transactions
                </p>
              </li>
            </Link>

            <Link to={`/${type}/profile`}>
              <li className="flex items-center">
                <p
                  className={`bg-gradient-to-r ${navbarOpen ? 'text-black' : isDarkMode ? 'text-white' : 'text-gray-500'} font-bold font-serif uppercase ${(location.pathname === '/' || location.pathname === '/ngo/profile' || location.pathname === '/restaurant/profile') ? (navbarOpen ? 'text-black' : 'text-white') : (navbarOpen && 'text-black')} px-4 py-2 rounded transition duration-300`}
                  type="button"
                >
                  Profile
                </p>
              </li>
            </Link>

            <Link to={`/about`}>
              <li className="flex items-center">
                <p
                  className={`bg-gradient-to-r ${navbarOpen ? 'text-black' : isDarkMode ? 'text-white' : 'text-gray-500'} font-bold font-serif uppercase ${(location.pathname === '/' || location.pathname === '/ngo/profile' || location.pathname === '/restaurant/profile') ? (navbarOpen ? 'text-black' : 'text-white') : (navbarOpen && 'text-black')} px-4 py-2 rounded transition duration-300`}
                  type="button"
                >
                  About Us
                </p>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
}