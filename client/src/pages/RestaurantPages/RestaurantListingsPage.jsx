import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CardImage from '../../assets/food-link-card-img.jpg';
import axios from 'axios';
import '../../App.css'

const RestaurantListingsPage = () => {
  const { user } = useAuth();
  const restaurantId = user._id;

  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const [selectedName, setSelectedName] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedExpiry, setSelectedExpiry] = useState('');

  const [listings, setListings] = useState([]);
  const [feedback, setFeedback] = useState('');

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const [buttonText, setButtonText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/listings/${restaurantId}`);
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setFeedback('Failed to fetch listings.');
      }
    };

    fetchListings();
  }, [restaurantId]);

  const handleAddListing = async () => {
    setButtonText('Adding...');
    try {
      const newListing = {
        restaurantId,
        name: newName,
        quantity: parseInt(newQuantity),
        expiry: parseInt(newExpiry),
        view: "not blocked",
        image: CardImage,
      };

      const response = await axios.post('http://localhost:8800/api/listings', newListing);
      setListings([...listings, response.data]);
      setNewName('');
      setNewQuantity('');
      setNewExpiry('');
      setFeedback('Listing added successfully.');
      setShowFeedback(true);
    } catch (error) {
      console.error('Error adding listing:', error);
      setFeedback('Failed to add listing.');
      setShowFeedback(true);
    }
    setTimeout(() => {
      setButtonText('');
      setShowFeedback(false);
    }, 1000);
  };

  const handleDeleteListing = async (id) => {
    setButtonText('Deleting...');
    try {
      await axios.delete(`http://localhost:8800/api/listings/${id}`);
      const updatedListings = listings.filter((listing) => listing._id !== id);
      setListings(updatedListings);
      setFeedback('Listing deleted successfully.');
      setShowFeedback(true);
    } catch (error) {
      console.error('Error deleting listing:', error);
      setFeedback('Failed to delete listing.');
      setShowFeedback(true);
    }
    setTimeout(() => {
      setButtonText('');
      setShowFeedback(false);
    }, 1000);
  };

  const handleOpenUpdateModal = (listing) => {
    setSelectedListing(listing);
    setSelectedName(listing.name);
    setSelectedQuantity(listing.quantity.toString());
    setSelectedExpiry(listing.expiry.toString());
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedListing(null);
  };

  const handleUpdateListing = async () => {
    setButtonText('Updating...');
    if (selectedListing) {
      try {
        const updatedListing = {
          ...selectedListing,
          name: selectedName,
          quantity: parseInt(selectedQuantity),
          expiry: parseInt(selectedExpiry),
        };

        const response = await axios.put(`http://localhost:8800/api/listings/${selectedListing._id}`, updatedListing);
        const updatedListings = listings.map((listing) =>
          listing._id === response.data._id ? response.data : listing
        );

        setListings(updatedListings);
        setShowUpdateModal(false);
        setSelectedListing(null);
        setSelectedName('');
        setSelectedQuantity('');
        setSelectedExpiry('');
        setFeedback('Listing updated successfully.');
        setShowFeedback(true);
      } catch (error) {
        console.error('Error updating listing:', error);
        setFeedback('Failed to update listing.');
        setShowFeedback(true);
      }
      setTimeout(() => {
        setButtonText('');
        setShowFeedback(false);
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto p-8">
      {showFeedback && <div className="feedback">{feedback}</div>}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">Add New Listing</h1>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Quantity in kgs"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="p-2 border rounded-md"
          />
          <select
            value={newExpiry}
            onChange={(e) => setNewExpiry(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Select Expiry</option>
            <option value="1">1 hr</option>
            <option value="2">2 hrs</option>
            <option value="3">3 hrs</option>
          </select>
          <button
            onClick={handleAddListing}
            className="col-span-3 p-2 bg-blue-500 text-white rounded-md relative"
          >
            {buttonText || 'Add'}
            {buttonText && <div className="overlay"></div>}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing, index) => (
          <div key={index} className="card">
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={CardImage}
                alt={listing.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-lg font-semibold mt-4">
              {listing.name}
            </h2>
            <div className="bg-gray-100 mt-4 p-2 rounded-sm w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-600">
                    Quantity
                  </span>
                  <span className="text-xs font-bold">
                    {listing.quantity}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-600">
                    Expiry
                  </span>
                  <span className="text-xs font-bold">
                    {listing.expiry} hr
                  </span>
                </div>
              </div>
            </div>
            {listing.view !== 'blocked' && (
              <div className="flex justify-between mt-4">
                <button onClick={() => handleOpenUpdateModal(listing)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Update
                </button>
                <button onClick={() => handleDeleteListing(listing._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md relative">
            <button onClick={handleCloseUpdateModal} className="absolute top-0 right-0 text-gray-600 p-2">
              Close
            </button>
            <h2 className="text-xl font-semibold mb-4">Update Listing</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="p-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Quantity in kgs"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
                className="p-2 border rounded-md"
              />
              <select
                value={selectedExpiry}
                onChange={(e) => setSelectedExpiry(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="">Select Expiry</option>
                <option value="1">1 hr</option>
                <option value="2">2 hrs</option>
                <option value="3">3 hrs</option>
              </select>
              <button onClick={handleUpdateListing} className="col-span-3 p-2 bg-blue-500 text-white rounded-md">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {showFeedback && <div className="feedback-box">{feedback}</div>}
    </div>
  );
};

export default RestaurantListingsPage;
