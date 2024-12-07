'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingLabelInput from '@/components/FloatingLabelInput';

interface VehicleDetails {
    type: string;
    registration_number: string;
    model: string;
}

interface SignupResponse {
    userId: string;
}

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('customer');
    const [location, setLocation] = useState<[number, number]>([11, 11]);
    const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
        type: '',
        registration_number: '',
        model: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLocationAvailable, setIsLocationAvailable] = useState<boolean>(true);
    const [success, setSuccess] = useState(false); // To handle the success popup visibility

    useEffect(() => {
        if (!navigator.geolocation) {
            setIsLocationAvailable(false);
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    const resetForm = () => {
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
        setLocation([11, 11]);
    };

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
                    setLocation([11, 11]);
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
                setSuccess(true); // Show success popup
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
            resetForm(); // Reset the form fields after successful signup
        }
    };

    const closeSuccessPopup = () => {
        setSuccess(false); // Close the success popup
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            {error && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-red-600 text-white p-4 rounded-md shadow-lg z-50" role="alert" aria-live="assertive">
                    <p className="font-semibold">{error}</p>
                </div>
            )}

            {/* Success popup */}
            {success && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <h3 className="font-bold text-xl">Signup Successful!</h3>
                        <button
                            onClick={closeSuccessPopup}
                            className="mt-4 px-4 py-2 bg-white text-green-600 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-3xl font-extrabold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FloatingLabelInput id="name" label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    <FloatingLabelInput id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <FloatingLabelInput id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <FloatingLabelInput id="phone" label="Phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                    <div className="relative mb-6">
                        <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500 text-white"
                        >
                            <option value="customer">Customer</option>
                            <option value="rider">Rider</option>
                        </select>
                    </div>

                    {role === 'rider' && (
                        <>
                            <FloatingLabelInput
                                id="vehicle_type"
                                label="Vehicle Type"
                                type="text"
                                value={vehicleDetails.type}
                                onChange={handleVehicleChange}
                                name="type"
                                required
                            />
                            <FloatingLabelInput
                                id="registration_number"
                                label="Registration Number"
                                type="text"
                                value={vehicleDetails.registration_number}
                                onChange={handleVehicleChange}
                                name="registration_number"
                                required
                            />
                            <FloatingLabelInput
                                id="model"
                                label="Model"
                                type="text"
                                value={vehicleDetails.model}
                                onChange={handleVehicleChange}
                                name="model"
                                required
                            />
                        </>
                    )}

                    <FloatingLabelInput id="latitude" label="Latitude" type="number" value={location[0].toString()} onChange={handleLocationChange} name="latitude" />
                    <FloatingLabelInput id="longitude" label="Longitude" type="number" value={location[1].toString()} onChange={handleLocationChange} name="longitude" />

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500 mb-4"
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
