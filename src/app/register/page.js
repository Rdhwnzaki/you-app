"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useRouter } from "next/navigation";
import axios from "axios";
import BackButton from "../components/BackButton";
import toast from "react-hot-toast";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('https://techtest.youapp.ai/api/register', {
                email,
                username,
                password,
            });

            const responseString = response.request.response
            const responseObject = JSON.parse(responseString);
            const message = responseObject.message;

            if (message && message === "User has been created successfully") {
                toast.success(message);
                router.push('/');
            } else {
                toast.error(message);
            }
        } catch (err) {
            toast.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <BackButton />
            <div className="w-full max-w-md px-8 py-6 rounded-lg shadow-lg">
                <h1 className="text-start text-4xl font-bold text-white">Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="mt-4">
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="input input-bordered w-full mt-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Create Username"
                            className="input input-bordered w-full mt-2"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create Password"
                            className="input input-bordered w-full mt-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                    <div className="mt-4 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className="input input-bordered w-full mt-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
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
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="text-center mt-10">
                    <span className="text-white me-2">Have an account?</span>
                    <span
                        className="underline text-yellow-200 underline-offset-2 cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        Login here
                    </span>
                </div>
            </div>
        </div>
    );
}
