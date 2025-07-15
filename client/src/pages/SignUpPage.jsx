import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import { AppContext } from "../context/AppContext"


const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { backendUrl, setUser, setToken, setIsLoggedin } = useContext(AppContext);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!firstName || !email || !password) {
            return setError('First name, email, and password are required.');
        }

        if (!validateEmail(email)) {
            return setError('Invalid email format.');
        }

        try {
            setLoading(true);
            const res = await axios.post(backendUrl + '/api/user/signup', {
                firstName,
                lastName,
                email,
                password,
            }, { withCredentials: true });

            if (res.data.success) {
         
                setUser(res.data.user);
                setToken(res.data.token);
                setIsLoggedin(true)
                alert('Signup successful!');

                navigate('/');
            } else {
                setError(res.data.message || 'Signup failed');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Signup failed. Try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-sm text-gray-500 mt-1">Signup to get started</p>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">First Name</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 bg-blue-600 text-white rounded-lg font-medium transition hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Signing up...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{' '}
                    <Link to={'/login'} className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
