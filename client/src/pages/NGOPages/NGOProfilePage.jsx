import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

// import Navbar from "components/Navbar.js";
// import Footer from "components/Footer.js";

import img from '../../assets/team-4-470x470.png'
import { useDarkMode } from "../../context/DarkModeContext";

export default function RestaurantProfilePage() {

  const [userInfo, setUserInfo] = useState(null);
  const { user } = useAuth();

  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/ngo/profile/${user._id}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // console.log(userInfo);

  const renderReviews = () => {
    return userInfo.reviews.map((review, index) => (
      <div key={index} className="mb-4">
        <h4 className={`font-bold ${!isDarkMode ? 'text-gray-600' : 'text-white'}`}>{review}</h4>
      </div>
    ));
  };

  return (
    <>
      {/* <Navbar transparent /> */}
      <main className="profile-page">
        {userInfo && (
          <>
            <section className="relative block" style={{ height: "500px" }}>
              <div
                className="absolute top-0 w-full h-full bg-center bg-cover"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/2792186/pexels-photo-2792186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
                }}
              >
                <span
                  id="blackOverlay"
                  className="w-full h-full absolute opacity-50 bg-black"
                ></span>
              </div>
              <div
                className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                style={{ height: "70px" }}
              >
                <svg
                  className="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="text-gray-300 fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>
            </section>
            <section className="relative py-16 bg-gray-300">
              <div className="container mx-auto px-4">
                <div className={`relative flex flex-col min-w-0 break-words ${isDarkMode ? 'bg-gray-800' : 'bg-white'} w-full mb-6 shadow-xl rounded-lg -mt-64`}>
                  <div className="px-6">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                        <div className="relative">
                          <img
                            alt="..."
                            src={img}
                            className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                            style={{ maxWidth: "150px" }}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                        <div className="py-6 px-3 mt-32 sm:mt-0">
                          <Link to='/'>
                            <button
                              className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                              type="button"
                              style={{ transition: "all .15s ease" }}
                            >
                              HOME
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4 lg:order-1">
                        <div className="flex justify-center py-4 lg:pt-4 pt-8">
                          <div className="mr-4 p-3 text-center">
                            <span className={`text-xl font-bold block uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {userInfo.fulfilledOrders}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>Fulfilled Orders</span>
                          </div>
                          <div className="mr-4 p-3 text-center">
                            <span className={`text-xl font-bold block uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {userInfo.cancelledOrders}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>Cancelled Orders</span>
                          </div>
                          <div className="lg:mr-4 p-3 text-center">
                            <span className={`text-xl font-bold block uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {userInfo.dismissedOrders}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>Dismissed Orders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-12">
                      <h3 className={`text-4xl uppercase font-semibold leading-normal ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                        {userInfo.username}
                      </h3>
                      <div className={`text-sm leading-normal mt-0 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-500'} font-bold uppercase`}>
                        {user.locationName}
                      </div>
                      <div className={`mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mt-10`}>
                        {userInfo.email}
                      </div>
                      <div className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        TOTAL ORDERS: {userInfo.totalOrders}
                      </div>
                    </div>
                    <div className="mt-10 py-10 border-t border-gray-300 text-center">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-9/12 px-4">
                          <p className={`mb-4 text-lg leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            This NGO has participated in {userInfo.totalOrders || 0} charitable initiatives.
                            {userInfo.totalOrders > 0 &&
                              ` They have successfully completed ${userInfo.fulfilledOrders || 0} projects, reflecting their commitment to making a positive impact on society.`
                            }
                            {userInfo.totalOrders > 0 &&
                              ` Despite challenges, they have persevered, with only ${userInfo.cancelledOrders || 0} projects being halted.`
                            }
                            FoodLink proudly supports {userInfo.username}'s noble cause. Their dedication to philanthropy and community welfare is truly commendable. Together, we strive to create a better world for all.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-10 py-10 border-t border-gray-300 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-9/12 px-4">
                          <h3 className="text-2xl font-semibold underline mb-4">Order Reviews: </h3>
                          {renderReviews()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )
        }
      </main >
      {/* <Footer /> */}
    </>
  );
}