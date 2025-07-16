import { createContext, useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credits, setCredits] = useState(false);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://bg-removal-backend-beta.vercel.app";
  const navigate = useNavigate();

  // 🚀 Load token from localStorage and set axios headers
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/user/me');
        if (data.success) {
          setUser(data.user);
          setIsLoggedin(true);
        } else {
          setUser(null);
          setIsLoggedin(false);
        }
      } catch (error) {
        console.log("Fetch user failed:", error.message);
        setUser(null);
        setIsLoggedin(false);
      }
    };

    fetchUser();
  }, []);

  // 🔑 Login or Signup Success Handler
  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsLoggedin(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsLoggedin(false);
    navigate('/login');
  };

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/credits');
      if (data.success) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const removeBg = async (image) => {
    try {
      setImage(image);
      setResultImage(false);
      navigate('/result');

      const formData = new FormData();
      if (image) formData.append('image', image);

      const { data } = await axios.post(
        backendUrl + '/api/image/remove-bg',
        formData
      );

      if (data.success) {
        setResultImage(data.resultImage);
        if (data.creditBalance) setCredits(data.creditBalance);
      } else {
        toast.error(data.message);
        if (data.creditBalance !== undefined) setCredits(data.creditBalance);
        if (data.creditBalance === 0) navigate('/buy');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    credits,
    setCredits,
    loadCreditsData,
    backendUrl,
    image,
    setImage,
    removeBg,
    resultImage,
    setResultImage,
    user,
    isLoggedin,
    setUser,
    setIsLoggedin,
    handleAuthSuccess, // 👈 call this after login/signup
    logout,            // 👈 use this to log out user
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
