import React, { useState, useEffect } from 'react';
import CardImage from '../../assets/food-link-card-img.jpg';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';

const NGOListingsPage = () => {
    const [selectedListings, setSelectedListings] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
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
        <div className={`container mx-auto p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            {Object.keys(restaurants).map((restaurantName, index) => (
                <div key={index} className="mb-8">
                    <h2 className={`text-md md:text-xl font-semibold uppercase mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                        {restaurantName}
                    </h2>
                    <div className="flex overflow-x-auto">
                        {restaurants[restaurantName].map((listing, idx) => (
                            <div key={idx} className="card mr-4 md:min-w-[250px] min-w-[150px]">
                                <img src={imageUrls[index % 10]} alt={listing.name} className="object-cover w-full h-32 md:h-48 sm:w-auto sm:max-w-full" />
                                <h2 className={`text-md md:text-lg font-semibold mt-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                                    {listing.name}
                                </h2>
                                <div className={`mt-4 p-2 h-12 rounded-sm w-full ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-600'}`}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-xs font-semibold`}>Quantity</span>
                                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-xs font-bold`}>{listing.quantity} kgs</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-xs font-semibold`}>Expiry</span>
                                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-xs font-bold`}>{listing.expiry} hr</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSelect(listing)}
                                    className={`mt-4 p-2 text-xs md:text-md ${isDarkMode ? 'bg-blue-700' : 'bg-blue-700'} text-white rounded-md`}
                                >
                                    {selectedListings.some((item) => item.name === listing.name) ? 'Unselect' : 'Select'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleRequest} className={`mt-4 p-2 text-xs md:text-md bg-blue-700 text-white rounded-md ${isDarkMode ? 'w-14 h-8' : 'w-19 h-10'}`}>
                        Request
                    </button>
                </div>
            ))}
        </div>
    );


};

export default NGOListingsPage;