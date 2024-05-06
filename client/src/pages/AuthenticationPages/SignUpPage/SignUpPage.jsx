import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import registerimage from '../../../assets/registerimage.png';
import { useDarkMode } from '../../../context/DarkModeContext.jsx';

const SignUp = () => {
  const { isDarkMode } = useDarkMode();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: '',
    verificationCode: '',
    latitude: '',
    longitude: '',
    locationName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
    }

  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      console.log("Registration successfull: " + formData);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className={`min-h-screen font-serif text-sm md:text-lg flex justify-center items-center px-4 py-7 ${isDarkMode ? 'shadow bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-white shadow-xl'}`}>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row w-full sm:w-10/12 lg:w-8/1 bg-gray-300 rounded-xl mx-auto shadow-lg overflow-hidden">
          <div className="w-full hidden lg:w-1/2 lg:flex flex-col items-center justify-center gap-4 p-2 sm:p-12 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${registerimage})` }}>
            <h1 className="text-white text-4xl mb-3 font-mono">Welcome to Food-Link</h1>
            {/* <div> */}
            <p className="text-white tracking-wide">Sign up now and join the movement with FoodLink! Whether you're a restaurant looking to donate surplus food or an NGO seeking support, our platform empowers you to make a meaningful impact. Together, let's build a hunger-free world, one meal at a time.</p>
            {/* </div> */}
            <p className='text-white mt-10'>Sign in if you already have an account</p>
            <Link to="/sign-in" className='w-1/2 rounded-md bg-purple-500 py-3 hover:bg-blue-700 disabled:cursor-not-allowed text-center text-white transition duration-200 ease-in-out hover:scale-105'>
              <button
                // disabled={passwordMatch || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.verificationCode || !formData.locationName ? true : false}
                className="">
                Sign In
              </button>
            </Link>
          </div>
          <div className="w-full lg:w-1/2 py-2 sm:py-16  px-2 sm:px-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Register</h2>
            <p className="mb-4">
              Create your account. It’s free and only takes a minute.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mt-5">
                <input type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border border-gray-400 py-1 px-2 w-full rounded-md"
                  minLength={7}
                  required
                />
              </div>
              <div className="mt-5">
                <input type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded-md border-gray-400 py-1 px-2 w-full"
                  required
                />
              </div>
              <div className="mt-5 input-group relative">
                <input type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (one upper,one lower one special character)"
                  className="border rounded-md border-gray-400 py-1 px-2 w-full"
                  value={formData.password}
                  onChange={handleChange}
                  pattern="^(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                  required
                />
                <div className="mt-5 input-group">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute rounded-md top-2 right-0.5 text-gray-500"
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
              <div className="mt-2">
                {!passwordMatch && (
                  <p className="text-red-500">Passwords do not match</p>
                )}
              </div>
              <div className="mt-5">
                <input type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="border rounded-md border-gray-400 py-1 px-2 w-full"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  // pattern="^(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                  required
                />
              </div>
              <div className="mt-5">
                <select name="userType" onChange={handleChange} className='rounded-md text-sm md:text-md p-2' required>
                  <option value="">Select User Type</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Charity/NGO">Charity/NGO</option>
                </select>
              </div>
              <div className="mt-5">
                <input type="text"
                  name="verificationCode"
                  placeholder="Verification Code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  className="border font-mono border-gray-400 py-1 px-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="mt-5">
                <input type="text"
                  name="locationName"
                  placeholder="Location name"
                  value={formData.locationName}
                  onChange={handleChange}
                  className="border rounded-md border-gray-400 py-1 px-2 w-full"
                  required
                />
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleLocationClick}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M10 0a9 9 0 00-9 9c0 8 9 11 9 11s9-3 9-11a9 9 0 00-9-9zm0 15a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Add My Location
                </button>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  // disabled={passwordMatch || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.verificationCode || !formData.locationName ? true : false}
                  className="w-full bg-purple-500 py-3 hover:bg-blue-700 disabled:cursor-not-allowed text-center text-white transition duration-200 ease-in-out hover:scale-105">Sign Up</button>
              </div>
              <div className="mt-5">
                <p>
                  Already have an account? <Link to="/sign-in" className="text-purple-500 transition duration-200 ease-in-out hover:scale-105">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
