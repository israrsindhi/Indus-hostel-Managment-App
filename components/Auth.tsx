import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
    users: User[];
    onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ users, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.email === email);

        // NOTE: In a real app, password would be hashed and checked securely.
        // For this demo, we'll use a dummy password 'password123' for all users.
        if (user && password === 'password123') {
            onLogin(user);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <div className="flex items-center justify-center mx-auto mb-4">
                        <img src="https://i.postimg.cc/RFFccnLV/2-removebg-preview.png" alt="Hostel Logo" className="h-24 w-24"/>
                    </div>
                    <h2 className="text-3xl font-bold text-dark">Indus Boys Hostel Sukkur</h2>
                    <p className="mt-2 text-gray-500">Sign in to the management portal</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-lg border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-input" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-lg border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-center text-danger">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center text-gray-500 bg-secondary p-4 rounded-lg">
                    <p className="font-semibold">Demo Credentials:</p>
                    <p><strong>Admin:</strong> admin@hostel.com</p>
                    <p><strong>Resident:</strong> sajid@indus.com</p>
                    <p><strong>Password (for all):</strong> password123</p>
                </div>
            </div>
        </div>
    );
};