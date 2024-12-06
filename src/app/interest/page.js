"use client";
import React, { useState } from "react";
import Creatable from 'react-select/creatable';
import BackButton from '../components/BackButton';
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Interest() {
    const router = useRouter()
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleChange = (newValue) => {
        setSelectedOptions(newValue);
    };

    const handleCreate = (inputValue) => {
        const newOption = { label: inputValue, value: inputValue };
        setSelectedOptions([...selectedOptions, newOption]);
    };

    const handleSave = async () => {
        const token = sessionStorage.getItem("token");
        const profile = JSON.parse(sessionStorage.getItem("profile"));

        if (!token || !profile) {
            console.error("Missing token or profile data.");
            return;
        }

        const { name, birthday, height, weight } = profile;
        const interests = selectedOptions.map(option => option.label);

        const payload = {
            name,
            birthday,
            height,
            weight,
            interests
        };
        try {
            const response = await axios.put(
                "https://techtest.youapp.ai/api/updateProfile",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    }
                }
            );
            toast.success(response.data.message)
            router.push("/about")
        } catch (error) {
            toast.error(error.response ? error.response.data : error.message)
        }
    };


    return (
        <div className='flex items-center justify-start h-screen px-10'>
            <BackButton />
            <div className="flex absolute top-6 right-8">
                <h1 className="text-md font-bold bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent cursor-pointer" onClick={handleSave}>
                    Save
                </h1>
            </div>
            <div className='flex flex-col'>
                <span className='text-lg font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 bg-clip-text text-transparent'>
                    Tell everyone about yourself
                </span>
                <span className='text-2xl font-bold text-white'>What interests you?</span>
                <div className="mt-6 w-full">
                    <Creatable
                        isMulti
                        value={selectedOptions}
                        onChange={handleChange}
                        onCreateOption={handleCreate}
                        options={[]}
                        className=" w-full"
                        classNamePrefix="react-select"
                        placeholder="Enter your interests"
                        inputValue={inputValue}
                        onInputChange={(newInputValue) => setInputValue(newInputValue)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Interest;
