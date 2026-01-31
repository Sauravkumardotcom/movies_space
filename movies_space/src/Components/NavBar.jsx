import React from "react";

const NavBar = () => (
  <nav className="w-full bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#232526] shadow-xl fixed top-0 left-0 z-50 backdrop-blur-sm bg-opacity-90 rounded-b-2xl">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex  items-center gap-3">
          <img 
            src="/logo.png" 
            alt="NamasteCode" 
            className="h-8 w-auto rounded-xl  sm:h-10 transform transition-transform hover:scale-110 duration-300" />
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
              NamasteCode
            </span>
            <span className="text-xs text-gray-400 hidden sm:block">Your Movie Space</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#most-watched" className="text-gray-300 hover:text-white font-medium transition duration-200">
            Most Watched
          </a>
          <a href="#all-movies" className="text-gray-300 hover:text-white font-medium transition duration-200">
            All Movies
          </a>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search movies..."
                className="w-48 lg:w-64 px-4 py-2 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openRequestModal'))}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105"
            >
              Request Movie
            </button>
          </div>
        </div>
        
        <button className="md:hidden p-2 text-gray-400 hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
);

export default NavBar;
