import React, { useState } from 'react';

const ShoppingList = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'demo' && password === 'demo123') {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            setUsername('');
            setPassword('');
        } else {
            alert('Invalid credentials (hint: demo / demo123)');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-300">
                <div className="bg-white shadow-md rounded-lg p-8 w-80">
                    <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                        <input
                            className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <input
                            className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            className="bg-blue-700 text-white py-2 rounded hover:bg-blue-600 transition"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Use <b>demo / demo123</b> to log in.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
           <h2 className="text-3xl font-bold text-blue-700 mb-6">Shopping List</h2>
            <button
                className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default ShoppingList;
