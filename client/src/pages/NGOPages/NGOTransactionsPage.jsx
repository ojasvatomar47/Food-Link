import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CardImage from '../../assets/food-link-card-img.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../context/DarkModeContext';

const NGOTransactionsPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cancelCode, setCancelCode] = useState('');
    const [cancelMessage, setCancelMessage] = useState('');
    const [showFulfillModal, setShowFulfillModal] = useState(false);
    const [fulfillCode, setFulfillCode] = useState('');
    const [fulfillMessage, setFulfillMessage] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const { isDarkMode } = useDarkMode();

    const imageUrls = [
        "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/262918/pexels-photo-262918.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/693269/pexels-photo-693269.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/671956/pexels-photo-671956.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/api/orders/ngo`, {
                params: { ngoId: user._id },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancel = async () => {
        try {
            const response = await axios.put(`http://localhost:8800/api/orders/${selectedOrder._id}/cancel`, {
                code: cancelCode,
                userType: user.userType
            });
            setCancelMessage(response.data.message);
            setShowCancelModal(false);
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const handleFulfill = async () => {
        try {
            const response = await axios.put(`http://localhost:8800/api/orders/${selectedOrder._id}/fulfill`, {
                code: fulfillCode,
                userType: user.userType
            });
            setFulfillMessage(response.data.message);
            setShowFulfillModal(false);
            fetchOrders();
        } catch (error) {
            console.error('Error fulfilling order:', error);
        }
    };

    const postReview = async () => {
        try {
            const response = await axios.post(`http://localhost:8800/api/addNgoReview/${selectedOrder._id}`, {
                review: reviewText
            });
            setReviewMessage(response.data.message);
            setShowReviewModal(false);
            fetchOrders();
        } catch (error) {
            console.error('Error posting review:', error);
        }
    };

    const handleViewListings = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const canReviewOrder = (order) => {
        return (order.status === 'cancelled' || order.status === 'fulfilled') && !order.ngoReview;
    };

    return (
        <div className={`container mx-auto p-8 pb-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            {orders.map((order, index) => {
                const canReview = canReviewOrder(order);
                const reviewAdded = order.restReview || order.ngoReview;

                return (
                    <div key={order._id} className={`order-card shadow-lg p-4 mb-4 flex flex-col md:flex-row items-center relative ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out'}`}>
                        <div
                            className={`absolute top-0 right-0 mt-2 mr-2 text-white font-semibold py-1 px-2 capitalize rounded 
                ${order.status === 'requested' ? 'bg-yellow-500'
                                    : order.status === 'accepted' ? 'bg-green-500'
                                        : order.status === 'fulfilled' ? 'bg-blue-500'
                                            : order.status === 'cancelled' ? 'bg-red-500'
                                                : order.status === 'dismissed' ? 'bg-brown-500'
                                                    : 'bg-gray-500'}`}
                        >
                            {order.status}
                        </div>
                        <img src={imageUrls[index % 10]} alt="Order" className="h-1/2 w-auto mb-4 md:w-1/4 md:h-auto md:mr-4 rounded-md" />
                        <div className="h-1/2 w-full md:w-3/4 flex flex-col">
                            <p className="text-md md:text-lg uppercase font-bold">Restaurant: {order.restaurantName}</p>
                            {order.status === 'accepted' && (
                                <div className="flex mt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowCancelModal(true);
                                        }}
                                        className="btn btn-red font-bold text-xs mr-1 w-1/4 px-2 py-1 md:text-lg md:mr-2 md:w-1/4 md:px-4 md:py-2 lg:mr-2 lg:w-1/4 lg:px-4 lg:py-2 rounded-md bg-red-500 hover:bg-red-600 text-white hover:text-white transition duration-300 ease-in-out"
                                    >
                                        Cancelled
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowFulfillModal(true);
                                        }}
                                        className="btn btn-green font-bold text-xs mr-1 w-1/4 px-2 py-1 md:text-lg md:mr-2 md:w-1/4 md:px-4 md:py-2 lg:mr-2 lg:w-1/4 lg:px-4 lg:py-2 rounded-md bg-green-500 hover:bg-green-600 text-white hover:text-white transition duration-300 ease-in-out"
                                    >
                                        Fulfilled
                                    </button>
                                    {/* <Link to={`/chat/${order._id}`}>
                                        <button
                                            className="btn btn-blue px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition duration-300 ease-in-out"
                                        >
                                            Chat
                                        </button>
                                    </Link> */}
                                    <div className="w-1/2 md:ml-4">
                                        <label className={`block text-xs font-medium md:text-sm text-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unique NGO Code:</label>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                className={`flex-1 block w-2/3 md:text-md md:w-2/3 md:py-2 lg:w-3/4 lg:py-2 border-gray-300 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 ${isDarkMode ? 'bg-gray-600' : ''}`}
                                                value={order.ngoCode}
                                                readOnly
                                            />
                                            <button
                                                className="w-1/3 text-xs font-bold px-2 py-1 ml-1 md:text-sm md:ml-2 md:w-1/3 md:px-4 md:py-2 lg:ml-2 lg:w-1/4 lg:px-4 lg:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(order.ngoCode);
                                                    alert('Code copied to clipboard!');
                                                }}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.restReview && (
                                <div className={`bg-gray-100 p-2 md:p-4 rounded-md mt-2 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 transition duration-300 ease-in-out' : 'hover:bg-gray-200 transition duration-300 ease-in-out'}`}>
                                    <p className="text-xs md:text-sm font-semibold hover:bg-gray-200 transition duration-300 ease-in-out">Restaurant Review:</p>
                                    <p className="text-xs md:text-sm">{order.restReview}</p>
                                </div>
                            )}
                            {order.ngoReview && (
                                <div className={`bg-gray-100 p-2 md:p-4 rounded-md mt-2 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 transition duration-300 ease-in-out' : 'hover:bg-gray-200 transition duration-300 ease-in-out'}`}>
                                    <p className="text-xs md:text-sm font-semibold">NGO Review:</p>
                                    <p className="text-xs md:text-sm">{order.ngoReview}</p>
                                </div>
                            )}

                            {canReview && (
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowReviewModal(true);
                                    }}
                                    className="btn btn-blue font-bold mt-2 px-2 py-1 md:px-4 md:py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition duration-300 ease-in-out"
                                >
                                    Review
                                </button>
                            )}

                            {(order.status === 'accepted' || order.status === 'fulfilled' || order.status === 'cancelled' || order.status === 'dismissed') && (
                                <Link to={`/chat/${order._id}`} className="block w-full mt-2">
                                    <button
                                        className="btn btn-blue px-2 py-1 md:px-4 md:py-2 w-full font-bold rounded-md bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition duration-300 ease-in-out"
                                    >
                                        Chat
                                    </button>
                                </Link>
                            )}

                            <button
                                onClick={() => handleViewListings(order)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 md:py-2 md:px-4 rounded mt-2"
                            >
                                View Listings Requested
                            </button>
                        </div>
                    </div>
                )
            })}

            {/* Modal for viewing listings */}
            {selectedOrder && showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="modal bg-white p-8 rounded-lg z-50 relative">
                        <button onClick={() => setShowModal(false)} className="modal-close absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                            &#x2715;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Listings for Order ID: {selectedOrder._id}</h2>
                        <ul>
                            {selectedOrder.listings.map((listing, index) => (
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
            {selectedOrder && showCancelModal && (
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
            {selectedOrder && showFulfillModal && (
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

            {/* Review Modal */}
            {selectedOrder && showReviewModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="modal bg-white p-8 rounded-lg z-50 relative">
                        <button onClick={() => setShowReviewModal(false)} className="modal-close absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                            &#x2715;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Review for Order ID: {selectedOrder._id}</h2>
                        <textarea
                            className="border p-2 rounded-md w-full mb-4"
                            placeholder="Write your review here"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <button onClick={postReview} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                            Submit Review
                        </button>
                        {reviewMessage && <p className="mt-4 text-green-500">{reviewMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NGOTransactionsPage;
