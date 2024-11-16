// Home.jsx
'use client';

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          Welcome to VahanSeva
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Your go-to ride booking service, fast and reliable.
        </p>
      </header>

      {/* CTA Section */}
      <div className="text-center space-y-8">
        <a
          href="/sign-in"
          className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-cyan-500 transition duration-300 shadow-lg"
        >
          Sign In
        </a>

        <a
          href="/sign-up"
          className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-purple-500 transition duration-300 shadow-lg"
        >
          Sign Up
        </a>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-5 text-gray-500 text-sm">
        <p>© 2024 VahanSeva. All rights reserved.</p>
      </footer>
    </div>
  );
}
