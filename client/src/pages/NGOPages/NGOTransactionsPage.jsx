import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CardImage from '../../assets/food-link-card-img.jpg';
import { Link, useNavigate } from 'react-router-dom';

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
        <div className="container mx-auto p-8">
            {orders.map((order) => {
                const canReview = canReviewOrder(order);
                const reviewAdded = order.restReview || order.ngoReview;

                return (
                    <div key={order._id} className="order-card shadow-lg p-4 mb-4 flex items-center hover:bg-gray-100 transition duration-300 ease-in-out relative">
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
                        <img src={CardImage} alt="Order" className="w-1/4 h-auto mr-4 rounded-md" />
                        <div className="w-3/4 flex flex-col">
                            <p className="text-lg font-semibold">Restaurant: {order.restaurantName}</p>
                            {order.status === 'accepted' && (
                                <div className="flex mt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowCancelModal(true);
                                        }}
                                        className="btn btn-red mr-2 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white hover:text-white transition duration-300 ease-in-out"
                                    >
                                        Cancelled
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowFulfillModal(true);
                                        }}
                                        className="btn btn-green mr-2 px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white hover:text-white transition duration-300 ease-in-out"
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
                                    <div className="ml-4">
                                        <label className="block text-sm font-medium text-gray-700">Unique NGO Code:</label>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={order.ngoCode}
                                                readOnly
                                            />
                                            <button
                                                className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

                            {(order.status === 'accepted' || order.status === 'fulfilled' || order.status === 'cancelled' || order.status === 'dismissed') && (
                                <Link to={`/chat/${order._id}`}>
                                    <button
                                        className="btn btn-blue px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition duration-300 ease-in-out"
                                    >
                                        Chat
                                    </button>
                                </Link>
                            )}
                            {canReview && (
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowReviewModal(true);
                                    }}
                                    className="btn btn-blue px-4 font-semibold py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition duration-300 ease-in-out"
                                >
                                    Review
                                </button>
                            )}
                            {order.restReview && (
                                <div className="bg-gray-100 p-4 rounded-md mt-2">
                                    <p className="text-sm font-semibold">Restaurant Review:</p>
                                    <p>{order.restReview}</p>
                                </div>
                            )}
                            {order.ngoReview && (
                                <div className="bg-gray-100 p-4 rounded-md mt-2">
                                    <p className="text-sm font-semibold">NGO Review:</p>
                                    <p>{order.ngoReview}</p>
                                </div>
                            )}
                            <button
                                onClick={() => handleViewListings(order)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
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
