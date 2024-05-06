import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useRef } from 'react';
import { useDarkMode } from '../../../context/DarkModeContext';

const ChatRoomPage = () => {
  const { user } = useAuth();
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cancelCode, setCancelCode] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [fulfillCode, setFulfillCode] = useState('');
  const [fulfillMessage, setFulfillMessage] = useState('');
  const socketRef = useRef(null);
  const { isDarkMode } = useDarkMode();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/api/orders/${orderId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/api/orders/${orderId}/messages`);
      setChatMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchPreviousMessages();
  }, [orderId]);

  useEffect(() => {
    socketRef.current = io('http://localhost:8800');

    socketRef.current.emit('join_chat_room', orderId);

    socketRef.current.on('receive_chat_message', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [orderId]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      socketRef.current.emit('send_chat_message', { message, orderId, sender: user._id });
      setMessage('');
    }
  };

  const handleViewListings = () => {
    setShowModal(true);
  };

  const handleAccept = async () => {
    try {
      await axios.put(`http://localhost:8800/api/orders/${orderId}/accept`);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await axios.put(`http://localhost:8800/api/orders/${orderId}/decline`);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error declining order:', error);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axios.put(`http://localhost:8800/api/orders/${orderId}/cancel`, {
        code: cancelCode,
        userType: user.userType
      });
      setCancelMessage(response.data.message);
      setShowCancelModal(false);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleFulfill = async () => {
    try {
      const response = await axios.put(`http://localhost:8800/api/orders/${orderId}/fulfill`, {
        code: fulfillCode,
        userType: user.userType
      });
      setFulfillMessage(response.data.message);
      setShowFulfillModal(false);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error fulfilling order:', error);
    }
  };

  const currentUserType = user.userType;
  const isOrderAccepted = orderDetails?.status === 'accepted';

  return (
    <div className={`container mx-auto p-8 flex flex-col h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
      {orderDetails && (
        <div className={`flex flex-col order-details p-4 rounded-lg shadow-md mb-4 ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-white hover:bg-gray-100 transition duration-300 ease-in-out'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{orderId}</h2>
            <div className={`text-xs md:text-lg font-semibold py-1 px-2 text-white rounded capitalize 
                ${orderDetails.status === 'requested' ? 'bg-yellow-500'
                : orderDetails.status === 'accepted' ? 'bg-green-500'
                  : orderDetails.status === 'fulfilled' ? 'bg-blue-500'
                    : orderDetails.status === 'cancelled' ? 'bg-red-500'
                      : orderDetails.status === 'dismissed' ? 'bg-brown-500'
                        : 'bg-gray-500'}`}
            >
              {orderDetails.status}
            </div>
          </div>
          <p className="font-semibold">Restaurant: {orderDetails.restaurantId.username}</p>
          <p className="font-semibold">NGO: {orderDetails.ngoId.username}</p>
          {user.userType === 'restaurant' && orderDetails.status === 'requested' && (
            <div className="flex mt-2">
              <button
                onClick={handleAccept}
                className="btn btn-green mr-2"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="btn btn-red"
              >
                Decline
              </button>
            </div>
          )}
          <div className="flex">
            <Link to={user.userType === 'Restaurant' ? '/restaurant/transactions' : '/ngo/transactions'}
              className="w-1/2 mr-2 mt-2"
            >
              <button className="btn btn-blue px-2 py-3 md:px-4 md:py-2 w-full font-bold rounded-md bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition duration-300 ease-in-out">
                Back
              </button>
            </Link>
            <button
              onClick={handleViewListings}
              className="w-1/2 bg-blue-500 text-xs md:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-2"
            >
              View Listings Requested
            </button>
          </div>
          {orderDetails.status === 'accepted' && (
            <div className="flex mt-2">
              <button
                onClick={() => {
                  setShowCancelModal(true);
                }}
                className="btn btn-red w-1/4 mr-2 px-4 py-2 text-xs md:text-sm font-bold rounded-md bg-red-500 hover:bg-red-600 text-white hover:text-white transition duration-300 ease-in-out"
              >
                Cancelled
              </button>
              <button
                onClick={() => {
                  setShowFulfillModal(true);
                }}
                className="btn btn-green w-1/4 mr-2 px-4 py-2 text-xs md:text-sm font-bold rounded-md bg-green-500 hover:bg-green-600 text-white hover:text-white transition duration-300 ease-in-out"
              >
                Fulfilled
              </button>
              <div className="w-1/2 ml-4">
                <label className={`block text-xs font-medium md:text-sm text-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your Code:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className={`flex-1 block w-2/3 md:text-md md:w-2/3 md:py-2 lg:w-3/4 lg:py-2 border-gray-300 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 ${isDarkMode ? 'bg-gray-600' : ''}`}
                    value={currentUserType === "Restaurant" ? orderDetails.restCode : orderDetails.ngoCode}
                    readOnly
                  />
                  <button
                    className="w-1/3 text-xs font-bold px-2 py-1 ml-1 md:text-sm md:ml-2 md:w-1/3 md:px-4 md:py-2 lg:ml-2 lg:w-1/4 lg:px-4 lg:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      navigator.clipboard.writeText(orderDetails.restCode);
                      alert('Code copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for viewing listings */}
      {orderDetails && showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="modal bg-white p-8 rounded-lg z-50 relative">
            <button onClick={() => setShowModal(false)} className="modal-close absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &#x2715;
            </button>
            <h2 className="text-xl font-semibold mb-4">Listings for Order ID: {orderDetails._id}</h2>
            <ul>
              {orderDetails.listings.map((listing, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">Name:</span> {listing.name},
                  <span className="ml-2 font-semibold">Quantity:</span> {listing.quantity} kgs,
                  <span className="ml-2 font-semibold">Expiry:</span> {listing.expiry} hr
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {orderDetails && showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="modal bg-white p-8 rounded-lg z-50 relative">
            <button onClick={() => setShowCancelModal(false)} className="modal-close absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &#x2715;
            </button>
            <h2 className="text-xl font-semibold mb-4">Enter Code to Cancel Order</h2>
            <input
              type="text"
              className="border p-2 rounded-md w-full mb-4"
              placeholder="Enter code"
              value={cancelCode}
              onChange={(e) => setCancelCode(e.target.value)}
            />
            <button onClick={handleCancel} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Cancel Order
            </button>
            {cancelMessage && <p className="mt-4 text-red-500">{cancelMessage}</p>}
          </div>
        </div>
      )}

      {/* Fulfill Modal */}
      {orderDetails && showFulfillModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="modal bg-white p-8 rounded-lg z-50 relative">
            <button onClick={() => setShowFulfillModal(false)} className="modal-close absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &#x2715;
            </button>
            <h2 className="text-xl font-semibold mb-4">Enter Code to Fulfill Order</h2>
            <input
              type="text"
              className="border p-2 rounded-md w-full mb-4"
              placeholder="Enter code"
              value={fulfillCode}
              onChange={(e) => setFulfillCode(e.target.value)}
            />
            <button onClick={handleFulfill} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Fulfill Order
            </button>
            {fulfillMessage && <p className="mt-4 text-green-500">{fulfillMessage}</p>}
          </div>
        </div>
      )}

      {/* Chat Section */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`chat-message flex p-3 rounded-lg mb-2 ${((!isDarkMode) && (message.sender === user._id)) && 'bg-blue-500 text-white justify-end'} ${((!isDarkMode) && !(message.sender === user._id)) && 'bg-gray-100 text-black justify-start'} ${isDarkMode && (message.sender === user._id) && 'bg-gray-600 text-gray-200 justify-end'} ${isDarkMode && !(message.sender === user._id) && 'bg-gray-400 text-gray-800'}`}
          >
            {message.sender !== user._id && (
              <span className="message-sender mr-2 font-bold">{message.sender}: </span>
            )}
            <span className="message-content text-sm">{message.message}</span>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      {isOrderAccepted && (
        <div className={`chat-input-form flex py-2 px-3 border rounded-lg shadow-lg border-gray-200 ${isDarkMode ? 'bg-gray-700 text-gray-200' : ''}`}>
          <input
            type="text"
            placeholder="Enter message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full rounded-md p-2 outline-none ${isDarkMode ? 'bg-gray-600' : ''}`}
            disabled={!isOrderAccepted}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className={`ml-2 px-4 py-2 text-xs md:text-sm font-bold rounded-md ${isOrderAccepted ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
            disabled={!isOrderAccepted}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoomPage;
