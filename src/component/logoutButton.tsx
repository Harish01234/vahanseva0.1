import React from 'react';
import axios from 'axios';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      // Call the sign-out API using Axios to clear cookies
      await axios.post('/api/signout');

      // Clear localStorage
      localStorage.removeItem('userid'); // Replace 'user' with the key you're using for user data
      localStorage.removeItem('role');
      // Optionally, redirect to the login page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, handle error state here (e.g., show an error message)
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:from-gray-700 hover:to-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-opacity-50 tracking-wide"
    >
      Log Out
    </button>
  );
}

export default LogoutButton;
