import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import registerimage from '../../../assets/registerimage.png';
import { useDarkMode } from '../../../context/DarkModeContext.jsx';
import ErrorModal from '../../../Modals/ErrorModal.jsx';

const SignInPage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      console.log("Login successful");
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while logging in.');
      }
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setError('');
    setShowModal(false);
  };

  return (
    <div className={`min-h-screen flex items-center px-3 ${isDarkMode ? 'shadow bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-white shadow-xl'}`}>
      {error && (
        <ErrorModal
          errorGrade="Error"
          errorDescription={error}
          onClose={handleCloseModal}
        />
      )}
      <div className="container mx-auto px-2 py-4 sm:px-0">
        <div className={`flex flex-col sm:flex-row w-full sm:w-10/12 lg:w-8/12 py-12 px-2 md:py-0 md:px-0 ${isDarkMode ? 'bg-white' : 'bg-gray-300'} rounded-xl mx-auto shadow-lg overflow-hidden`}>
          <div className="w-full hidden lg:w-1/2 lg:flex flex-col items-center justify-center gap-4 p-2 sm:p-12 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${registerimage})` }}>
            <h1 className="text-white text-4xl mb-3 font-mono">Welcome back to Food-Link</h1>
            {/* <div> */}
            <p className="text-white tracking-wide">Welcome back to FoodLink! Connect, donate, and make a difference. Whether you're a restaurant or an NGO, our platform streamlines your efforts to combat hunger. Together, let's create a world where no one goes hungry.</p>
            {/* </div> */}
            <p className='text-white mt-10'>Sign up if you don't have an account</p>
            <Link to="/sign-up" className='w-1/2 rounded-md bg-purple-500 py-3 hover:bg-blue-700 disabled:cursor-not-allowed text-center text-white transition duration-200 ease-in-out hover:scale-105'>
              <button
                // disabled={passwordMatch || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.verificationCode || !formData.locationName ? true : false}
                className="">
                Sign Up
              </button>
            </Link>
          </div>
          <div className="w-full lg:w-1/2 py-2 sm:py-16 px-2 sm:px-12 font-serif">
            <h2 className="text-3xl mb-4 font-semibold lg:mt-20 xl:mt-12">Sign-In</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mt-5">
                <input type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-md py-1 px-2 w-full"
                  required
                />
              </div>
              <div className="mt-5 input-group relative">
                <input type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="border border-gray-400 rounded-md py-1 px-2 w-full"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="mt-5 input-group">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2 right-3 text-gray-500"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 0a9 9 0 00-9 9c0 8 9 11 9 11s9-3 9-11a9 9 0 00-9-9zm0 15a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 0a9 9 0 00-9 9c0 8 9 11 9 11s9-3 9-11a9 9 0 00-9-9zm0 15a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="w-full bg-purple-500 py-3 hover:bg-blue-700 disabled:cursor-not-allowed text-center text-white transition duration-200 ease-in-out hover:scale-105">Sign In</button>
              </div>
            </form>
            <div className="mt-5">
              <p>
                Do not have an account? <Link to="/sign-up" className="text-purple-500 transition duration-200 ease-in-out hover:scale-105">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;