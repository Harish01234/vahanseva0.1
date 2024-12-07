'use client';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Importing icons
import LogoutButton from '@/components/logoutButton';

type Ride = {
  _id: string; // Ride ID (ObjectId as a string)
  pickupLocation: string;
  dropoffLocation: string;
  status: 'Assigned' | 'Ongoing' | 'Completed' | 'Cancelled' | 'En Route';
  bookedAt: string; // Date when the ride was booked
  completedAt?: string; // Date when the ride was completed (optional)
};

const RiderDashboard: React.FC = () => {
  const [requestedRides, setRequestedRides] = useState<Ride[]>([]);
  const [ongoingRides, setOngoingRides] = useState<Ride[]>([]);
  const [pastRides, setPastRides] = useState<Ride[]>([]);

  const riderId = useMemo(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userid');
    }
    return null;
  }, []);

  useEffect(() => {
    if (!riderId) {
      console.error('No rider ID found in localStorage');
      return;
    }

    const fetchRides = async () => {
      try {
        const response = await axios.get(`/api/rides?riderId=${riderId}`);
        const rides = response.data.rides || [];
        setRequestedRides(rides.filter((ride: Ride) => ride.status === 'Assigned'));
        setOngoingRides(rides.filter((ride: Ride) => ride.status === 'En Route'));
        setPastRides(rides.filter((ride: Ride) => ride.status === 'Completed'));
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
  }, [riderId]);

  const handleAcceptRide = async (rideId: string): Promise<void> => {
    if (!rideId) {
      console.error('No ride ID available');
      return;
    }
    console.log('Accepting ride:', rideId);
    
  
    try {
      // Send a request to update the ride state to "En Route"
      const response = await axios.post(
        `/api/ridestate`, 
        { rideId, state: 'En Route' }
      );
      console.log('API response:', response.data);
      
  
      // Assuming the response contains the updated ride
      if (response.data?.ride) {
        // Remove the accepted ride from requestedRides
        setRequestedRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
  
        // Add the ride to ongoingRides
        setOngoingRides((prevRides) => [...prevRides, response.data.ride]);
      } else {
        console.error('Ride update failed: No updated ride data in response');
      }
    } catch (error) {
      console.error('Error accepting the ride:', error);
    }
  };
  
  const handleCancelRide = async (rideId: string): Promise<void> => {
    if (!riderId) {
      console.error('No rider ID available');
      return;
    }

    try {
      const response = await axios.post(
        `/api/ridestate`, 
        { rideId, state: 'Cancelled' }
      );
      console.log('API response:', response.data);
      setRequestedRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
    } catch (error) {
      console.error('Error canceling the ride:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen text-white">
      <div className="max-w-7xl mx-auto p-8 sm:p-6 md:p-12">
        {
          <LogoutButton/>
        }
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Rider Dashboard</h1>

        {/* Requested Rides Section */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Requested Rides</h2>
          {requestedRides.length > 0 ? (
            <ul className="space-y-4">
              {requestedRides.map((ride, index) => (
                <li key={`${ride._id}-${index}`} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                  <div>{`From: ${ride.pickupLocation} - To: ${ride.dropoffLocation}`}</div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAcceptRide(ride._id)}
                      className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() => handleCancelRide(ride._id)}
                      className="px-4 py-2 flex items-center gap-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No requested rides.</p>
          )}
        </section>

        {/* Ongoing Rides Section */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Ongoing Rides</h2>
          {ongoingRides.length > 0 ? (
            <ul className="space-y-4">
              {ongoingRides.map((ride, index) => (
                <li key={`${ride._id}-${index}`} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                  <div>{`From: ${ride.pickupLocation} - To: ${ride.dropoffLocation}`}</div>
                  <span className="bg-blue-500 text-black text-sm px-2 py-1 rounded-md">{ride.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No ongoing rides.</p>
          )}
        </section>

        {/* Completed Rides Section */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Completed Rides</h2>
          {pastRides.length > 0 ? (
            <ul className="space-y-4">
              {pastRides.map((ride, index) => (
                <li key={`${ride._id}-${index}`} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                  <div>{`From: ${ride.pickupLocation} - To: ${ride.dropoffLocation}`}</div>
                  <span className="bg-green-500 text-black text-sm px-2 py-1 rounded-md">{ride.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No completed rides.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default RiderDashboard;
