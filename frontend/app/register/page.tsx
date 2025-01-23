"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    setMessage(data.message || "Registration successful!");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md w-full">
        {/* Form Section */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <a href="#" className="bg-black text-white font-bold text-xl px-4 py-2 inline-block rounded">
              Logo
            </a>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Seu username"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="Senha"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirme a senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirme a senha"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800"
            >
              Register
            </button>
          </form>
          {message && (
            <p className="text-center text-green-500 text-sm mt-4">{message}</p>
          )}
          <p className="text-center text-gray-500 text-sm mt-6">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-500 underline">
              Entre aqui.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
