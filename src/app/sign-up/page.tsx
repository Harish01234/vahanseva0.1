'use client';
import React, { useState } from 'react';
import axios from 'axios';

interface VehicleDetails {
    type: string;
    registration_number: string;
    model: string;
}

interface SignupResponse {
    userId: string;
    // Add any other fields you expect from the response
}

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('customer'); // Default to customer
    const [location, setLocation] = useState<[number, number]>([0, 0]);
    const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
        type: '',
        registration_number: '',
        model: '',
    });
    const [error, setError] = useState(''); // To store error messages
    const [success, setSuccess] = useState(''); // To store success messages
    const [loading, setLoading] = useState(false); // Loading state

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value); // Convert input value to number
        if (isNaN(value)) return; // Exit if the value is not a valid number
    
        setLocation((prevLocation) => {
            // Update latitude or longitude based on the input name
            return [
                e.target.name === 'latitude' ? value : prevLocation[0],
                e.target.name === 'longitude' ? value : prevLocation[1],
            ];
        });
    };

    const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVehicleDetails({
            ...vehicleDetails,
            [e.target.name]: e.target.value,
        });
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation([
                        position.coords.latitude,
                        position.coords.longitude,
                    ]);
                },
                (error) => {
                    setError('Unable to retrieve your location.');
                    console.error(error);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const userData = {
            name,
            email,
            password,
            phone,
            role,
            location,
            vehicle_details: role === 'rider' ? vehicleDetails : null, // Only include vehicle details for riders
        };

        try {
            // Make the signup API request
            const response = await axios.post<SignupResponse>('/api/signup', userData);

            // Handle the response from the server
            if (response.status === 201) {
                setSuccess('Signup successful!'); // Set success message
                console.log(response.data); // Log response data
            }
        } catch (error: any) {
            if (error.response) {
                setError(`Signup failed: ${error.response?.data?.message || error.message}`);
                console.error("Error Response Data:", error.response.data); // Log the response data
            } else if (error.request) {
                setError('Signup failed: No response from server.');
                console.error("Error Request:", error.request);
            } else {
                setError(`Signup failed: ${error.message}`);
                console.error("Error Message:", error.message);
            }
        } finally {
            setLoading(false); // Stop loading
        }

        // Optionally, reset the form fields
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRole('customer');
        setVehicleDetails({
            type: '',
            registration_number: '',
            model: '',
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white"> {/* Black background with white text */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                {error && <p className="text-red-400">{error}</p>} {/* Display error message */}
                {success && <p className="text-green-400">{success}</p>} {/* Display success message */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                placeholder="Your Phone Number"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                            >
                                <option value="customer">Customer</option>
                                <option value="rider">Rider</option>
                            </select>
                        </div>

                        {/* Vehicle Details (only for riders) */}
                        {role === 'rider' && (
                            <>
                                <div>
                                    <label htmlFor="vehicle_type" className="block text-sm font-medium">Vehicle Type</label>
                                    <input
                                        type="text"
                                        id="vehicle_type"
                                        name="type"
                                        value={vehicleDetails.type}
                                        onChange={handleVehicleChange}
                                        className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                        placeholder="e.g., Bike, Car"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="registration_number" className="block text-sm font-medium">Registration Number</label>
                                    <input
                                        type="text"
                                        id="registration_number"
                                        name="registration_number"
                                        value={vehicleDetails.registration_number}
                                        onChange={handleVehicleChange}
                                        className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                        placeholder="e.g., ABC1234"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="model" className="block text-sm font-medium">Vehicle Model</label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        value={vehicleDetails.model}
                                        onChange={handleVehicleChange}
                                        className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                        placeholder="e.g., Yamaha R15"
                                    />
                                </div>
                            </>
                        )}

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium">Location</label>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    name="latitude"
                                    value={location[0]}
                                    onChange={handleLocationChange}
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                    placeholder="Latitude"
                                />
                                <input
                                    type="number"
                                    name="longitude"
                                    value={location[1]}
                                    onChange={handleLocationChange}
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
                                    placeholder="Longitude"
                                />
                            </div>
                            <button type="button" onClick={getCurrentLocation} className="mt-2 text-blue-500 hover:underline">
                                Get Current Location
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-4 w-full p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
