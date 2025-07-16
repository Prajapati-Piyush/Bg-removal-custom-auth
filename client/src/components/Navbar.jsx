import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const {
    isLoggedin,
    user,
    credits,
    loadCreditsData,
    logout, // ✅ Use context logout for cleaner flow
  } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedin) {
      loadCreditsData();
    }
  }, [isLoggedin]);

  const handleLogout = () => {
    logout(); // ✅ use global logout
  };

  return (
    <div className='flex items-center justify-between mx-4 py-3 lg:mx-44'>
      <div className='flex items-center'>
        <Link to={'/'}>
          <img className='w-32 sm:w-44' src={assets.Erazor} alt="logo" />
        </Link>
      </div>

      {isLoggedin ? (
        <div className='flex items-center gap-2 sm:gap-4'>
          <button
            onClick={() => navigate('/buy')}
            className='flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 rounded-full hover:scale-105 transition-all duration-700 cursor-pointer'
          >
            <img className='w-5' src={assets.credit_icon} alt="" />
            <p className='text-xs sm:text-sm font-medium text-gray-600'>
              Credits: {credits}
            </p>
          </button>

          <p className='text-gray-600 max-sm:hidden'>Hi, {user?.firstName}</p>

          {user?.photo && (
            <img
              src={user.photo}
              alt="Profile"
              className='w-8 h-8 rounded-full object-cover border'
            />
          )}

          <button
            onClick={handleLogout}
            className='bg-red-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full hover:bg-red-600 transition-all'
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 text-sm sm:py-3 rounded-full'
        >
          Get Started
          <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
