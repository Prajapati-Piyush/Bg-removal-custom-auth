import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { backendUrl, handleAuthSuccess } = useContext(AppContext);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!firstName || !email || !password) return setError('All fields are required.');
        if (!validateEmail(email)) return setError('Invalid email format.');

        try {
            setLoading(true);

            const res = await axios.post(`${backendUrl}/api/user/signup`, {
                firstName,
                lastName,
                email,
                password,
            });

            if (res.data.success) {
                const { token, user } = res.data;

                // ✅ Save token and set axios default header
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // ✅ Update context state
                handleAuthSuccess(token, user);

                alert('Signup successful!');
                navigate('/');
            } else {
                setError(res.data.message || 'Signup failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
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

                {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                        {loading ? 'Signing up...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
