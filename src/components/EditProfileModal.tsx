"use client";
import { useAppSelector } from "@/store/hooks";
import { User } from "@/utils/type";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Spinner from "./Spinner";
Spinner


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (updatedUser: User) => void;
    loading: boolean
}

const EditProfileModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
    const user = useAppSelector((state) => state.users.user);


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<User>({
        defaultValues: {
            _id: "",
            name: "",
            email: "",
            phone: "",
            profilePicture: "",
            token: "",
            role: "",
            isActive: false,
            isVerified: false,
        },
    });

    useEffect(() => {
        if (isOpen && user) {
            // Populate the form fields with user data
            Object.keys(user).forEach((key) => {
                setValue(key as keyof User, user[key as keyof User]);
            });
        }
    }, [isOpen, user, setValue]);

    const onSubmitForm: SubmitHandler<User> = (data) => {
        onSubmit(data); // Pass validated data to parent
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Full Name is required.", minLength: {
                                    value: 4,
                                    message: "Name must be at least 4 characters long.",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required.",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address.",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                            readOnly
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            {...register("phone", {
                                required: "Phone number is required.",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Phone number must be 10 digits.",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                                Save
                            </button>
                        )}

                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
