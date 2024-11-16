'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<any>(null);  // Local state for user
    const router = useRouter(); // Initialize useRouter

    // Log the updated user state after it changes
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
            }).catch((error) => {
                console.error("Login failed:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        }

        // Optionally, reset the form fields
        setEmail('');
        setPassword('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black"> {/* Black background */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-400">
                    Don&apos;t have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
