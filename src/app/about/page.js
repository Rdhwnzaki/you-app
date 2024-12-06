"use client";
import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import axios from "axios";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function About() {
    const router = useRouter()
    const [profile, setProfile] = useState(null);
    const [isEditAbout, setIsEditAbout] = useState(false);
    const [form, setForm] = useState({
        name: "",
        birthday: "",
        height: "",
        weight: "",
    });

    const fetchData = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            toast.error("Token not found");
            return;
        }

        try {
            const response = await axios.get("https://techtest.youapp.ai/api/getProfile", {
                headers: { "x-access-token": token },
            });
            setProfile(response.data.data);
            sessionStorage.setItem("profile", JSON.stringify(response.data.data))
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error(error.response?.data?.message || "Failed to fetch profile");
        }
    };

    useEffect(() => {
        if (!profile) {
            fetchData();
        } else {
            setForm({
                name: profile.name || "",
                birthday: profile.birthday || "",
                height: profile.height || "",
                weight: profile.weight || "",
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleDateChange = (e) => {
        const rawDate = e.target.value;
        const [year, month, day] = rawDate.split("-");
        setForm({ ...form, birthday: `${day}/${month}/${year}` });
    };

    const handleSave = async () => {
        if (!form.name || !form.birthday || !form.height || !form.weight) {
            toast.error("All fields are required");
            return;
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Token not found");
            return;
        }

        try {
            const response = await axios.put(
                "https://techtest.youapp.ai/api/updateProfile",
                {
                    name: form.name,
                    birthday: form.birthday,
                    height: parseInt(form.height),
                    weight: parseInt(form.weight),
                    interests: [],
                },
                { headers: { "x-access-token": token } }
            );
            toast.success(response.data.message);
            setProfile({ ...profile, ...form });
            setIsEditAbout(false);
            fetchData()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save profile");
        }
    };

    const calculateAge = (date) => {
        const [day, month, year] = date.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return `(Age ${age})`;
    };

    const toggleEditAbout = () => setIsEditAbout(!isEditAbout);

    return (
        <div className="bg-[#09141a] h-screen">
            <BackButton />
            <div className="flex absolute top-6 left-44">
                {profile?.username ? (
                    <p className="text-white font-medium">{`@${profile.username}`}</p>
                ) : (
                    <p className="text-gray-500">Loading...</p>
                )}
            </div>
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="card bg-[#0e191f] w-96 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between">
                            <span className="text-white font-semibold text-lg mb-3">About</span>
                            <span>
                                {!isEditAbout ? (
                                    <PencilSquareIcon
                                        className="h-6 w-6 text-white cursor-pointer"
                                        onClick={toggleEditAbout}
                                    />
                                ) : (
                                    <span
                                        className="cursor-pointer text-sm bg-gradient-to-r from-yellow-100  to-yellow-200 bg-clip-text text-transparent"
                                        onClick={handleSave}
                                    >
                                        Save & Update
                                    </span>
                                )}
                            </span>
                        </div>
                        {!isEditAbout && profile ? (
                            <div>
                                <div className="flex flex-row mb-2 font-medium">
                                    <span className="text-gray-500">Birthday : </span>
                                    <span className="text-white ms-1">{`${profile.birthday} ${calculateAge(profile.birthday)}`}</span>
                                </div>
                                <div className="flex flex-row mb-2 font-medium">
                                    <span className="text-gray-500">Horoscope : </span>
                                    <span className="text-white ms-1">{profile.horoscope}</span>
                                </div>
                                <div className="flex flex-row mb-2 font-medium">
                                    <span className="text-gray-500">Zodiac : </span>
                                    <span className="text-white ms-1">{profile.zodiac}</span>
                                </div>
                                <div className="flex flex-row mb-2 font-medium">
                                    <span className="text-gray-500">Height : </span>
                                    <span className="text-white ms-1">{`${profile.height} cm`}</span>
                                </div>
                                <div className="flex flex-row font-medium">
                                    <span className="text-gray-500">Weight : </span>
                                    <span className="text-white ms-1">{`${profile.weight} kg`}</span>
                                </div>
                            </div>
                        ) : !isEditAbout ? (
                            <p className="text-gray-500">Add in your your to help others know you better</p>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mt-4">
                                    <span>Display name : </span>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Enter name"
                                        className="input input-bordered w-44 max-w-xs"
                                        value={form.name || profile?.name || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span>Birthday : </span>
                                    <input
                                        type="date"
                                        className="input input-bordered w-44 max-w-xs"
                                        onChange={handleDateChange}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span>Horoscope : </span>
                                    <input
                                        name="horoscope"
                                        type="text"
                                        placeholder="--"
                                        className="input input-bordered w-44 max-w-xs"
                                        value={profile?.horoscope || ""}
                                        disabled
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span>Zodiac : </span>
                                    <input
                                        name="zodiac"
                                        type="text"
                                        placeholder="Add zodiac"
                                        className="input input-bordered w-44 max-w-xs"
                                        value={profile?.zodiac || ""}
                                        disabled
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span>Height : </span>
                                    <input
                                        name="height"
                                        type="text"
                                        placeholder="Add height"
                                        className="input input-bordered w-44 max-w-xs"
                                        value={form.height || profile?.height || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span>Weight : </span>
                                    <input
                                        name="weight"
                                        type="text"
                                        placeholder="Add weight"
                                        className="input input-bordered w-44 max-w-xs"
                                        value={form.weight || profile?.weight || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="card bg-[#0e191f] w-96 shadow-xl mt-6">
                    <div className="card-body">
                        <div className="flex justify-between">
                            <span className="text-white font-semibold text-lg mb-3">Interest</span>
                            <span>
                                <PencilSquareIcon
                                    className="h-6 w-6 text-white cursor-pointer"
                                    onClick={() => router.push("/interest")}
                                />
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4">

                            {profile && profile.interests.length > 0 ? (
                                profile.interests.map((interest, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-2 rounded-full text-md bg-[#1c272c] text-white text-center font-medium "
                                    >
                                        {interest}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">Add in your interest to find a better match</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
