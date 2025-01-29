import React from 'react';
import { useNavigate } from 'react-router-dom';
import AI from '../images/AI.png';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
      {/* Main Content Container */}
      <div className="text-center max-w-3xl p-10 bg-gray-800/30 backdrop-blur-lg rounded-2xl">
        {/* Logo */}
        <img 
          src={AI} 
          alt="Cratoss Logo" 
          className="w-60 h-60 mx-auto mb-8 rounded-full object-cover md:w-48 md:h-48"
        />

        {/* Text Content */}
        <h1 className="text-5xl mb-4 text-gray-100 md:text-4xl">
          Welcome to
        </h1>
        <h1 className="text-5xl font-bold mb-4 text-blue-500 md:text-4xl">
          Cratoss
        </h1>
        <p className="text-2xl mb-10 text-gray-300 md:text-xl">
          Your Personal IOT Assistant!
        </p>

        {/* Button */}
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 text-xl bg-blue-600 text-white rounded-full 
                   hover:bg-blue-700 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   md:px-6 md:py-3 md:text-lg"
        >
          Get Started!
        </button>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden md:h-16">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
          <path 
            d="M0,50 Q250,10 500,50 T1000,50" 
            className="fill-none stroke-blue-600 stroke-2"
          />
        </svg>
      </div>
    </div>
  );
};

export default IntroPage;