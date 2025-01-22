'use client';

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setMessage(data.message || "Login successful!");
  };

  return (
    <div suppressHydrationWarning={true} className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md w-full">
        {/* Login Form Section */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <a href="#" className="bg-black text-white font-bold text-xl px-4 py-2 inline-block rounded">
              Logo
            </a>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Your username"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800"
            >
              Log In
            </button>
          </form>
          {message && (
            <p className="text-center text-green-500 text-sm mt-4">{message}</p>
          )}
          <p className="text-center text-gray-500 text-sm mt-6">
            Não tem uma conta?{" "}
            <a href="/register" className="text-blue-500 underline">
            Registre-se {" "}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
