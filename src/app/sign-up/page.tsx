'use client';
import React, { useState, useEffect } from 'react';
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
    const [location, setLocation] = useState<[number, number]>([11, 11]); // Default location
    const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
        type: '',
        registration_number: '',
        model: '',
    });
    const [error, setError] = useState(''); // To store error messages
    const [success, setSuccess] = useState(''); // To store success messages
    const [loading, setLoading] = useState(false); // Loading state
    const [isLocationAvailable, setIsLocationAvailable] = useState<boolean>(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setIsLocationAvailable(false);
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (isNaN(value)) return;
        setLocation((prevLocation) => [
            e.target.name === 'latitude' ? value : prevLocation[0],
            e.target.name === 'longitude' ? value : prevLocation[1],
        ]);
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
                    setError('Unable to retrieve your location. Using default location.');
                    setLocation([11, 11]); // Default location when location fetch fails
                    console.error(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            name,
            email,
            password,
            phone,
            role,
            location,
            vehicle_details: role === 'rider' ? vehicleDetails : null,
        };

        try {
            const response = await axios.post<SignupResponse>('/api/signup', userData);

            if (response.status === 201) {
                setSuccess('Signup successful!');
                console.log(response.data);
            }
        } catch (error: any) {
            if (error.response) {
                setError(`Signup failed: ${error.response?.data?.message || error.message}`);
                console.error("Error Response Data:", error.response.data);
            } else if (error.request) {
                setError('Signup failed: No response from server.');
                console.error("Error Request:", error.request);
            } else {
                setError(`Signup failed: ${error.message}`);
                console.error("Error Message:", error.message);
            }
        } finally {
            setLoading(false);
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
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            {error && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-red-600 text-white p-4 rounded-md shadow-lg">
                    <p className="font-semibold">{error}</p>
                </div>
            )}
            {success && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-green-600 text-white p-4 rounded-md shadow-lg">
                    <p className="font-semibold">{success}</p>
                </div>
            )}

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-3xl font-extrabold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Your Phone Number"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="customer">Customer</option>
                            <option value="rider">Rider</option>
                        </select>
                    </div>

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
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
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
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                                    placeholder="Vehicle Registration"
                                />
                            </div>
                            <div>
                                <label htmlFor="model" className="block text-sm font-medium">Model</label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={vehicleDetails.model}
                                    onChange={handleVehicleChange}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                                    placeholder="e.g., Honda Civic"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium">Latitude</label>
                        <input
                            type="number"
                            id="latitude"
                            name="latitude"
                            value={location[0]}
                            onChange={handleLocationChange}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Latitude"
                        />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium">Longitude</label>
                        <input
                            type="number"
                            id="longitude"
                            name="longitude"
                            value={location[1]}
                            onChange={handleLocationChange}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Longitude"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        {isLocationAvailable ? 'Fetch Current Location' : 'Default Location Used'}
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-md focus:outline-none focus:ring focus:ring-green-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
