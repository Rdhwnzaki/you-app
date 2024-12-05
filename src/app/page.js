"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useRouter } from "next/navigation";
import axios from "axios";
import BackButton from "./components/BackButton";
import toast from "react-hot-toast";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post('https://techtest.youapp.ai/api/login', {
        email,
        password,
        username: email,
      });

      const responseString = response.request.response
      const responseObject = JSON.parse(responseString);
      const message = responseObject.message;

      if (message && message === "User has been logged in successfully") {
        toast.success(message);
        if (response.data.access_token) {
          sessionStorage.setItem("token", response.data.access_token)
        }
        router.push('/about');
      } else {
        toast.error(message)
      }
    } catch (err) {
      toast.error(err)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <BackButton />
      <div className="w-full max-w-md px-8 py-6 rounded-lg shadow-lg">
        <h1 className="text-start text-4xl font-bold text-white">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <input
              type="email"
              placeholder="Enter Username/Email"
              className="input input-bordered w-full mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mt-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="input input-bordered w-full mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 mt-1"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full mt-6 py-2 px-4 bg-gradient-to-r from-cyan-300 to-blue-500 text-white font-bold rounded-lg shadow-lg h-12"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-10">
          <span className="text-white me-2">No account?</span>
          <span
            className="underline text-yellow-200 underline-offset-2 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}
