import React, { useState, useEffect } from 'react';
import CardImage from '../../assets/food-link-card-img.jpg';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const NGOListingsPage = () => {
    const [selectedListings, setSelectedListings] = useState([]);
    const [restaurants, setRestaurants] = useState([]);

    console.log(selectedListings);

    const { user } = useAuth();

    useEffect(() => {
        const { longitude, latitude } = user;
        const ngoId = user._id;

        const fetchNearbyListings = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/api/nearbyRestaurants`, {
                    params: {
                        ngoId,
                        longitude,
                        latitude,
                    },
                });
                // Group listings by restaurantName
                const groupedRestaurants = {};
                response.data.forEach((listing) => {
                    if (!groupedRestaurants[listing.restaurantName]) {
                        groupedRestaurants[listing.restaurantName] = [];
                    }
                    groupedRestaurants[listing.restaurantName].push(listing);
                });
                setRestaurants(groupedRestaurants);
            } catch (error) {
                console.error('Error fetching nearby listings:', error);
            }
        };

        fetchNearbyListings();
    }, [user]);

    const handleSelect = (listing) => {
        if (selectedListings.some((item) => item.name === listing.name)) {
            setSelectedListings(selectedListings.filter((item) => item.name !== listing.name));
        } else {
            setSelectedListings([...selectedListings, listing]);
        }
    };

    const handleRequest = async () => {
        console.log('Inside handleRequest');
        console.log('User:', user);

        if (selectedListings.length === 0) {
            alert('Please select at least one listing to request.');
            return;
        }

        try {
            console.log('Selected Listings:', selectedListings);

            const listingsData = selectedListings.map((listing) => ({
                listing: String(listing.listingId),
                name: listing.name,
                quantity: listing.quantity,
                expiry: listing.expiry,
                restaurantId: String(listing.restaurantId),
                restaurantName: listing.restaurantName,
                view: 'not blocked'
            }));
            console.log(listingsData);

            const orderData = {
                restaurantId: String(selectedListings[0].restaurantId),
                ngoId: String(user._id),
                listings: listingsData
            };

            console.log('Order Data:', orderData);

            const response = await axios.post('http://localhost:8800/api/orders', orderData);

            if (response.status === 201) {
                alert('Order requested successfully!');
                setSelectedListings([]);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        }
    };


    return (
        <div className="container mx-auto p-8">
            {Object.keys(restaurants).map((restaurantName, index) => (
                <div key={index} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{restaurantName}</h2>
                    <div className="flex overflow-x-auto">
                        {restaurants[restaurantName].map((listing, idx) => (
                            <div key={idx} className="card mr-4" style={{ minWidth: '250px' }}> {/* Added minWidth */}
                                <img src={CardImage} alt={listing.name} className="object-cover w-full h-48" />
                                <h2 className="text-lg font-semibold mt-4">{listing.name}</h2>
                                <div className="bg-gray-100 mt-4 p-2 rounded-sm w-full">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-gray-600">Quantity</span>
                                            <span className="text-xs font-bold">{listing.quantity} kgs</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-gray-600">Expiry</span>
                                            <span className="text-xs font-bold">{listing.expiry} hr</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSelect(listing)}
                                    className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                                >
                                    {selectedListings.some((item) => item.name === listing.name) ? 'Unselect' : 'Select'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleRequest} className="mt-4 p-2 bg-blue-500 text-white rounded-md">
                        Request
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NGOListingsPage;