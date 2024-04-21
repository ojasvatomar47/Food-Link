import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../../../context/AuthContext';

const ChatRoomPage = () => {
  const { user } = useAuth();
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  const userId = user._id;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
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
      socketRef.current.emit('send_chat_message', { message, orderId, sender: userId });
      setMessage('');
    }
  };

  return (
    <div className="chat-room-page bg-gray-200 h-screen flex flex-col">
      <div className="order-details p-4 bg-white rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-2">Order #{orderId}</h2>
        <p className="text-md">Restaurant: {orderDetails?.restaurantId.username}</p>
        <p className="text-md">NGO: {orderDetails?.ngoId.username}</p>
      </div>

      <div className="chat-history flex-grow overflow-y-auto px-4 py-2">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`chat-message flex p-3 rounded-lg mb-2 ${message.sender === userId ? 'bg-blue-500 text-white justify-end' : 'bg-gray-100 text-black justify-start'
              }`}
          >
            {message.sender !== userId && (
              <span className="message-sender mr-2 font-bold">{message.sender}: </span>
            )}
            <span className="message-content text-sm">{message.message}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-form py-2 px-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md p-2 outline-none"
        />
        <button type="button" onClick={handleSendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
