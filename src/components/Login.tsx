import React, { useState } from "react";

interface LoginProps {
    onLogin: (username: string, password: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onLogin(username, password);
        if (!success) {
            alert("Invalid credentials (hint: demo / demo123)");
        } else {
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="bg-white shadow-md rounded-lg p-8 w-80">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
};

export default Login;
