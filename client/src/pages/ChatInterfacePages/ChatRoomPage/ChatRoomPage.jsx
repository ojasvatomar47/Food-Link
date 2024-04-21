import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatRoomPage = () => {

  const { orderId } = useParams();

  const [orderDetails, setOrderDetails] = useState(null);

  console.log(orderDetails);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8800/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error('Error fetching order details');
    }
  };

  useEffect(() => {
    const getOrder = async () => {
      try {
        const data = await fetchOrderDetails(orderId);
        setOrderDetails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    getOrder();
  }, [orderId]); // Dependency array with orderId

  return (
    <div>ChatRoomPage</div>
  )
}

export default ChatRoomPage