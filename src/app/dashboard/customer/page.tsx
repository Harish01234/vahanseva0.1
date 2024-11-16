'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Ride = {
  id: string; // Ride ID (ObjectId as a string)
  pickupLocation: string;
  dropoffLocation: string;
  status: 'Pending' | 'Assigned' | 'En Route' | 'Completed' | 'Cancelled';
  bookedAt: string; // Date when the ride was booked
  completedAt?: string; // Date when the ride was completed (optional)
};

const CustomerDashboard: React.FC = () => {
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [enrouteRides, setEnrouteRides] = useState<Ride[]>([]);
  const [completedRides, setCompletedRides] = useState<Ride[]>([]);

  // Fetch customerId from localStorage
  const customerId = typeof window !== 'undefined' ? localStorage.getItem('userid') : null;

  // Ensure that customerId is available
  useEffect(() => {
    if (!customerId) {
      console.error('No customer ID found in localStorage');
      return;
    }

    const fetchRides = async () => {
      console.log('Fetching rides for customer ID:', customerId);

      try {
        const response = await axios.get(`http://localhost:3001/api/rides?customerId=${customerId}`);
        console.log('API response:', response.data);

        const rides = response.data.rides || [];
        const pending = rides.filter((ride: Ride) => ride.status === 'Pending');
        const enroute = rides.filter((ride: Ride) => ride.status === 'En Route');
        const completed = rides.filter((ride: Ride) => ride.status === 'Completed');

        setPendingRides(pending);
        setEnrouteRides(enroute);
        setCompletedRides(completed);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
  }, [customerId]);

  const handleRideBooking = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    const newRide = {
      customerId, // Pass the customerId dynamically
      pickupLocation: fromLocation,
      dropoffLocation: toLocation,
      rideType: 'car', // or 'bike' based on user's selection
      status: 'Pending',
      bookedAt: new Date(),
    };

    try {
      // Call your backend to book the ride
      const response = await axios.post('http://localhost:3001/api/rides', newRide);
      console.log('Ride booked successfully:', response.data);

      // After booking, refresh the ride list
      //fetchRides(); // You can re-fetch the rides or add the new ride to the state
    } catch (error) {
      console.error('Error booking the ride:', error);
    }
  };

  // Logging ride data (optional)
  useEffect(() => {
    console.log('Pending Rides:', pendingRides);
    console.log('Enroute Rides:', enrouteRides);
    console.log('Completed Rides:', completedRides);
  }, [pendingRides, enrouteRides, completedRides]);

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen text-white">
      <div className="max-w-7xl mx-auto p-8 sm:p-6 md:p-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Customer Dashboard</h1>

        {/* Ride Booking Form */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-md mb-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-4">Book a Ride</h2>
          <form onSubmit={handleRideBooking} className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-300">From</label>
              <input
                type="text"
                id="from"
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="Enter starting location"
                required
              />
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-300">To</label>
              <input
                type="text"
                id="to"
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="Enter destination"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full p-3 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Book Ride
            </button>
          </form>
        </div>

        {/* Ride Status Sections */}
        <div className="space-y-8">
          {/* Pending Rides */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Pending Rides</h3>
            {pendingRides.length > 0 ? (
              <ul className="space-y-4">
                {pendingRides.map((ride) => (
                  <li key={`${ride.id}-${ride.bookedAt}`} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                    <span>{`From: ${ride.pickupLocation} - To: ${ride.dropoffLocation}`}</span>
                    <span className="bg-yellow-500 text-black text-sm px-2 py-1 rounded-md">{ride.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No pending rides.</p>
            )}
          </div>

          {/* Enroute Rides */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Enroute Rides</h3>
            {enrouteRides.length > 0 ? (
              <ul className="space-y-4">
                {enrouteRides.map((ride) => (
                  <li key={`${ride.id}-${ride.bookedAt}`} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                    <span>{`From: ${ride.pickupLocation} - To: ${ride.dropoffLocation}`}</span>
                    <span className="bg-blue-500 text-black text-sm px-2 py-1 rounded-md">{ride.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No enroute rides.</p>
            )}
          </div>

          {/* Completed Rides */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Completed Rides</h3>
            {completedRides.length > 0 ? (
              <ul className="space-y-4">
                {completedRides.map((ride) => (
                  <li key={`${ride.id}-${ride.bookedAt}`} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                    <span>{`From: ${ride.pickupLocation} - To: ${ride.dropoffLocation}`}</span>
                    <span className="bg-green-500 text-black text-sm px-2 py-1 rounded-md">{ride.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No completed rides.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
