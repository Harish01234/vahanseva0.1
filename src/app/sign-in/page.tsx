'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FloatingLabelInput from '@/components/FloatingLabelInput'; // Import FloatingLabelInput component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<any>(null);  // Local state for user
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        if (user) {
            console.log("Updated user state:", user);
        }
    }, [user]);  // useEffect will run every time 'user' is updated

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password,
        };

        try {
            await axios.post('/api/signin', userData).then((response) => {
                const role = response.data.role;  // Get the user's role
                console.log(response.data);

                const newUser = {
                    id: response.data.userid,
                    name: response.data.name || 'John Doe',  // Adjust based on response
                    email: response.data.email || email,     // Adjust based on response
                };
                
                setUser(newUser); // Set the user in local state

                // Store user data in localStorage
                localStorage.setItem('userid', response.data.userid); // Store userid
                localStorage.setItem('role', role); // Store role

                // Redirect based on role
                if (role === 'rider') {
                    router.push('/dashboard/rider'); // Redirect to rider dashboard
                } else if (role === 'customer') {
                    router.push('/dashboard/customer'); // Redirect to customer home
                } else {
                    console.error("Unknown role:", role);
                }

                // Show success message
                setSuccess('Login successful!');
            }).catch((error) => {
                console.error("Login failed:", error);
                setError('Login failed. Please check your credentials.');
            });
        } catch (error) {
            console.error("Login error:", error);
            setError('An error occurred while logging in.');
        }

        // Optionally, reset the form fields
        setEmail('');
        setPassword('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            {error && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-red-600 text-white p-4 rounded-md shadow-lg z-50">
                    <p className="font-semibold">{error}</p>
                </div>
            )}
            {success && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-green-600 text-white p-4 rounded-md shadow-lg z-50">
                    <p className="font-semibold">{success}</p>
                </div>
            )}

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <FloatingLabelInput
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                        <FloatingLabelInput
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-400">
                    Don&apos;t have an account? <Link href="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
