import React from 'react'
import { assets, plans } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from "../context/AppContext"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const BuyCredit = () => {
  const { backendUrl, loadCreditsData } = useContext(AppContext)
  const navigate = useNavigate();

  // const initPay = async (order) => {
  //   if (!window.Razorpay) {
  //     toast.error("Razorpay SDK not loaded. Please refresh the page.");
  //     return;
  //   }
  //   const options = {
  //     key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //     amount: order.amount,
  //     currency: order.currency,
  //     name: 'Credits payment',
  //     description: "Credits Payment",
  //     order_id: order.id,
  //     receipt: order.receipt,
  //     handler: async (response) => {
  //       try {
  //         const { data } = await axios.post(
  //           backendUrl + '/api/user/verify-razor',
  //           response,
  //           { withCredentials: true }
  //         );

  //         if (data.success) {
  //           loadCreditsData();
  //           navigate('/');
  //           toast.success('Credit Added');
  //         }
  //       } catch (error) {
  //         console.log(error);
  //         toast.error(error.message);
  //       }
  //     },
  //   };

  //   const rzp = new window.Razorpay(options);
  //   rzp.open();
  // };

  const initPay = async (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits payment',
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verify-razor',
            response,
            { withCredentials: true }
          );

          if (data.success) {
            loadCreditsData();
            navigate('/');
            toast.success('Credit Added');
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const paymentRazorpay = async (planId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/pay-razor',
        { planId },
        { withCredentials: true }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our plans</button>
      <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-10'>
        Choose the plan that's right for you
      </h1>
      <div className='flex flex-wrap justify-center gap-4 text-left'>
        {plans.map((item, index) => (
          <div
            className='bg-white drop-shadow-sm rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500'
            key={index}
          >
            <img width={40} src={assets.logo_icon} alt="logo" />
            <p className='mt-3 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${item.price}</span>/{item.credits} credits
            </p>
            <button
              onClick={() => paymentRazorpay(item.id)}
              className='w-full bg-gray-800 text-white mt-8 rounded-md py-2.5 min-w-52 cursor-pointer'
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
