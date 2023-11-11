// SignUp.jsx
import React, { useState } from 'react';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utilities/axiosInstance';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitForm = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('user/', {
                name,
                email,
                password,
            });

            window.location.href = '/';
            // Optionally, you can redirect the user or perform any other actions after successful sign-up.
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
            // Handle error - display a message to the user, or perform other actions.
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitForm}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <div className="mt-1">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign Up
                        </button>
                        <Link to='/login'>
                            <button
                                className="w-full flex justify-center mt-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Login
                            </button>

                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
