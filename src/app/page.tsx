'use client';

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* 3D Animation Section */}
      <div className="absolute inset-0">
        <iframe
          src="https://my.spline.design/carastonmartinanimation-2081a0e694aa32b0785503d20e1d8df4/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="w-full h-full"
        ></iframe>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 text-center mt-16">
        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 animate-pulse">
            Welcome to VahanSeva
          </h1>
          <p className="text-gray-300 mt-4 text-base sm:text-lg tracking-wide">
            Your trusted ride booking platform for speed and reliability.
          </p>
        </header>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col space-y-6 items-center">
          <a
            href="/sign-in"
            className="px-12 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold hover:scale-105 hover:shadow-lg transform transition-all duration-300"
          >
            Sign In
          </a>

          <a
            href="/sign-up"
            className="px-12 py-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold hover:scale-105 hover:shadow-lg transform transition-all duration-300"
          >
            Sign Up
          </a>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-5 text-gray-400 text-xs sm:text-sm z-10">
        <p>© 2024 VahanSeva. All rights reserved.</p>
      </footer>

      {/* Background Overlay for Contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Tailwind Animation */}
      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-20px, 20px) scale(1.1);
          }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
      `}</style>
    </div>
  );
}
