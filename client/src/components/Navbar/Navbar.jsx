import React, { useEffect } from 'react'
import { useDarkMode } from '../../context/DarkModeContext';
import { BiSun, BiMoon } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Loading Dark Mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode !== isDarkMode) {
      toggleDarkMode();
    }
  }, [isDarkMode, toggleDarkMode]);

  return (
    <div className='flex'>
      <p>
        Navbar
      </p>
      <div>
        <button
          onClick={toggleDarkMode}
          className={`flex items-center text-lg md:text-xl lg:text-xl font-bold p-2 ${isDarkMode ? 'text-black' : 'text-black'} border-gray-400 transition-colors duration-300`}
        >
          <span>
            {isDarkMode ? <BiSun /> : <BiMoon />}
          </span>
        </button>
      </div>
    </div>
  )
}

export default Navbar