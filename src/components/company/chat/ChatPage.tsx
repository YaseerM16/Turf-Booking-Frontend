"use client";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import Header from "@/components/company/CompanyHeader";
import Sidebar from "@/components/company/CompanySidebar";
import { deleteNotification, getChatLists, getChatMessages, updateNotifications } from "@/services/companyApi";
import { useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { ChatRoom, Message } from "@/utils/type"
import Swal from "sweetalert2";
import FireLoading from "@/components/FireLoading";
import EmojiPicker from 'emoji-picker-react';  // Import emoji picker
import { IoSend } from "react-icons/io5"; // Import send icon
import { IoArrowBack } from "react-icons/io5";
import { messageDeleteForEveryone, messageDeleteForMe } from "@/services/userApi";



const CompanyChatPage: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const company = useAppSelector(state => state.companies.company)
    const [chats, setChats] = useState<ChatRoom[] | null>(null);
    const [chat, setChat] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[] | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [loadingChats, setLoadingChats] = useState(false)
    const [loadMessages, setLoadMsgs] = useState<boolean>(false)
    const socketRef = useRef<Socket | null>(null); // Use useRef to persist the socket instance
    const searchParams = useSearchParams();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);

    const handleDeleteClick = (msgId: string) => {
        setSelectedMessage(msgId);
        setShowDeletePopup(true);
    };

    const deleteMessage = async (msgId: string, forEveryone: boolean = false) => {
        try {
            if (forEveryone) {
                const response = await messageDeleteForEveryone(msgId)
                if (response.success) {
                    const { data } = response
                    // setMessages((prevMessages) =>
                    //     (prevMessages || []).map((msg) =>
                    //         msg._id === data.message._id ? data.message : msg
                    //     )
                    // );
                    if (!socketRef.current) {
                        socketRef.current = io("https://api.turfbooking.online");
                    }

                    socketRef.current.emit('deleteNotify', { message: data.message, roomId: chat })
                }
            } else {
                const response = await messageDeleteForMe(msgId)
                if (response.success) {
                    const { data } = response
                    if (!socketRef.current) {
                        socketRef.current = io("https://api.turfbooking.online");
                    }

                    socketRef.current.emit('deleteNotify', { message: data.message, roomId: chat })
                    // setMessages((prevMessages) =>
                    //     (prevMessages || []).map((msg) =>
                    //         msg._id === data.message._id ? data.message : msg
                    //     )
                    // );
                }
            }
            setShowDeletePopup(false);
        } catch (error) {
            console.log("Error while Deleting the Message :", error);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchChats = useCallback(async () => {
        try {
            setLoadingChats(true);
            const response = await getChatLists(company?._id as string)

            if (response?.success) {
                const { data } = response
                setChats(data.rooms)
                setLoadingChats(false)
            }

        } catch (error) {
            console.error("Error fetching Turfs [] data:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Something went wrong!',
                text: (error as Error).message || 'Please try again later.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        } finally {
            setLoadingChats(false);
        }
    }, [company?._id])


    const fetchChatMessages = useCallback(async (roomId: string, userId: string) => {
        try {
            setLoadMsgs(true)
            const response = await getChatMessages(roomId)
            if (response.success) {
                setLoadMsgs(false)
                const { data } = response
                const isNotifiyDeleted = await deleteNotification(roomId, company?._id as string, "company")
                if (isNotifiyDeleted.success) {
                    console.log("UpdateDD CHat :", data.messages.chat);
                    setMessages(data.messages.messages)
                    setSelectedUser(userId)
                    setChat(roomId)
                    setChats((prevChats) => {
                        if (!prevChats) return null; // Handle null case
                        return prevChats.map((chat) =>
                            chat._id === roomId ? { ...chat, ...data.messages.chat } : chat
                        );
                    });
                    console.log("MESsGAes REsponser :", data);
                }
            }
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Something went wrong!',
                text: (error as Error).message || 'Please try again later.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        } finally {
            setLoadMsgs(false)
        }
    }, [company?._id])

    useEffect(() => {
        if (company?._id) {
            fetchChats();
        }
        const queries = (() => {
            const roomId = searchParams?.get("roomId");
            const user = searchParams?.get("user");
            if (!roomId) return null;
            if (!user) return null;

            try {
                const decodedDets = decodeURIComponent(roomId);
                const userDets = decodeURIComponent(user)
                return { roomId: JSON.parse(decodedDets) as string, user: JSON.parse(userDets) }
            } catch (error) {
                console.error("Failed to parse roomId :", error);
                return null;
            }
        })();
        if (queries?.roomId) {
            fetchChatMessages(queries.roomId, queries.user)
        }
    }, [company?._id, fetchChats, fetchChatMessages, searchParams]);

    useEffect(() => {
        // console.log("SOCKET Initial");

        // console.log("RomId Befroe :", chat);
        socketRef.current = io("https://api.turfbooking.online");
        if (socketRef.current !== null) {
            socketRef.current.emit("joinRoom", chat);
            socketRef.current.emit("userOnline", { roomId: chat, userId: company?._id });
        }
        // console.log("RomId After :", chat);

        const handleReceiveMessage = (msg: Message) => {
            // console.log("THSI recevy is called in front :", msg);
            const messageWithTimestamp = {
                ...msg,
                timestamp: msg.createdAt || new Date().toISOString()
            };
            setMessages(prev => [...(prev ?? []), messageWithTimestamp])
        };

        const handleMessageDeleted = (deletedMsg: Message) => {
            // setMessages(msgs)
            setMessages((prevMessages) =>
                (prevMessages || []).map((msg) =>
                    msg._id === deletedMsg._id ? deletedMsg : msg
                )
            );
        };

        const handleNewNotification = (message: {
            room: {
                companyId: { _id: string; companyname: string; companyemail: string; phone: string; profilePicture: string };
                userId: { name: string; email: string; phone: string; profilePicture: string };
                lastMessage: string | null;
                isReadUc: number;
                updatedAt: string;
                _id: string;
            };
            receiverId: string;
            content: string; // Add content for the last message
            timestamp: string;
        }) => {

            // console.log("Handling NewNotification :!!:");
            // console.log("USER_ID :", company?._id);
            // console.log("RECEiverID :", message.receiverId);

            if (chat == message.room._id) return  // prevent the notification count if you inside the chat

            if (company?._id !== message.receiverId) {
                console.log("ITSz not Equal :!");

                return; // Ignore notifications not meant for this user
            }

            setChats(prevChats => {
                if (!prevChats) return null; // If chats are null, return null

                const updatedChats = [...prevChats];
                const chatIndex = updatedChats.findIndex(chat => chat._id === message.room._id);

                if (chatIndex > -1) {
                    // Update the existing chat
                    updatedChats[chatIndex] = {
                        ...updatedChats[chatIndex],
                        isReadUc: updatedChats[chatIndex].isReadUc + 1, // Increment the count
                        lastMessage: message.content, // Update the last message
                        updatedAt: message.timestamp, // Update the updatedAt field
                    };
                    // Move the updated chat to the top of the list
                    const [movedChat] = updatedChats.splice(chatIndex, 1);
                    updatedChats.unshift(movedChat);
                } else {
                    // Add the new chat to the top of the list
                    updatedChats.unshift({
                        ...message.room,
                        isReadUc: 1,
                        isReadCc: 0, // Provide a default value for isReadCc
                        createdAt: message.timestamp,
                        lastMessage: message.content,
                    } as unknown as ChatRoom);
                }

                // Sort chats by updatedAt in descending order
                updatedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                return updatedChats;
            });

            const { companyId, userId, isReadUc, _id } = message.room;
            const newNotification = {
                userId: userId,
                roomId: _id,
                companyId: companyId._id,
                companyname: companyId.companyname,
                lastMessage: message.content,
                unreadCount: isReadUc,
                updatedAt: message.timestamp,
                user: {
                    name: userId.name,
                    email: userId.email,
                    phone: userId.phone,
                    profilePicture: userId.profilePicture,
                },
                company: {
                    companyname: companyId.companyname,
                    companyEmail: companyId.companyemail,
                    phone: companyId.phone,
                    profilePicture: companyId.profilePicture,
                },
            };

            // console.log("NEWnotify :", newNotification);


            const saveNotifications = async () => {
                try {
                    const response = await updateNotifications(newNotification, "company")
                    if (response.success) {
                        const { data } = response
                        console.log("DATA BY SaveNotified :: ", data);
                        // setNotifications(data.notifications);
                    }
                } catch (error) {
                    console.log("Error while save the notification to DB :: ", error);
                }
            }

            saveNotifications()
        };

        socketRef.current.on("receiveMessage", handleReceiveMessage);
        socketRef.current.on("newNotification", handleNewNotification);
        socketRef.current.on("messageDeleted", handleMessageDeleted);

        socketRef.current.on("updateOnlineStatus", (users) => {
            console.log("Online USERS UpdateONlinSats :: ", users);
            setOnlineUsers(users);
        });


        return () => {
            socketRef.current?.off("updateOnlineStatus");
            socketRef.current?.off("receiveMessage", handleReceiveMessage);
            socketRef.current?.off("newNotification", handleNewNotification);
            socketRef.current?.off("messageDeleted", handleMessageDeleted);
            socketRef.current?.emit("userOffline", { roomId: chat, userId: company?._id });

        };
    }, [chat, company?._id]);

    const isOnline = (userId: string) => onlineUsers.includes(userId);

    // console.log("CHATS :", chats);
    // const data = { roomId: chat, message: newMessage }
    // const response = await onSendMessage(company?._id as string, selectedUser as string, data)
    // if (response.success) {
    //     const { data } = response
    //     console.log("Message Send Succefully ! ", data);
    //     setMessages(prev => [...(prev ?? []), data.message])
    //     setNewMessage('');
    // }


    const handleSendMessage = async () => {
        try {
            if (!newMessage.trim()) return;
            const timestamp = new Date().toISOString();
            if (!socketRef.current) {
                socketRef.current = io("https://api.turfbooking.online");
            }
            socketRef.current.emit('sendMessage', { roomId: chat, content: newMessage, senderId: company?._id, sender: "company", receiverId: selectedUser, timestamp });
            setNewMessage('');
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Something went wrong!',
                text: (error as Error).message || 'Please try again later.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        }
    };

    const handleEmojiClick = (emoji: { emoji: string }) => {
        setNewMessage(prev => prev + emoji.emoji);  // Append the selected emoji to the message
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            console.log("target FIles :", event.target.files);

            const filesArray = Array.from(event.target.files);
            setSelectedImages((prev) => [...prev, ...filesArray]); // Append new images
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImageSend = () => {
        if (selectedImages.length > 0) {
            const timestamp = new Date().toISOString();
            if (!socketRef.current) {
                socketRef.current = io("https://api.turfbooking.online");
            }
            const imagesWithMetadata = selectedImages.map(file => ({
                buffer: file,
                originalname: file.name,  // Filename
                mimetype: file.type       // Mimetype
            }));

            // Emit the message event using the socket
            socketRef.current.emit('sendMessage', {
                roomId: chat,
                content: imagesWithMetadata,
                senderId: company?._id,
                sender: "company",
                receiverId: selectedUser,
                timestamp,
                isImage: true, // Flag to identify that the message is an image
            });
            console.log("Sending Images:", selectedImages);
            // Here you can emit images using socket.emit or other logic
            setSelectedImages([]); // Clear images after sending
        }
    };

    const handleImageClick = (imageUrl: string) => {
        setCurrentImage(imageUrl);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentImage('');
    };

    console.log("MEssages : ", messages);

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <div className="h-screen flex flex-col bg-green-50">
                    {/* Header */}
                    <Header />

                    <div className="flex h-screen">
                        {!selectedUser ? <Sidebar /> : <></>}
                        {/* Chat List (Sidebar) */}
                        <div className="w-full md:w-1/4 bg-green-50 border-r border-green-200 p-4 overflow-y-auto max-h-screen">
                            {loadingChats ? (
                                <FireLoading renders={"Loading Chats"} />
                            ) : (
                                <>
                                    <h2 className="text-lg font-semibold text-green-800 mb-4 text-center md:text-left">Chat Users</h2>
                                    {/* Back Icon (Only for Mobile) */}
                                    <button className="text-green-800 text-2xl mb-2" onClick={() => setSelectedUser(null)}>
                                        <IoArrowBack />
                                    </button>
                                    <ul className="divide-y">
                                        {chats?.map((chat) => (
                                            <li
                                                key={chat._id}
                                                className={`p-3 md:p-4 rounded-md shadow-md cursor-pointer transition-all ${selectedUser === chat.userId._id ? 'bg-green-200' : 'bg-white'
                                                    } hover:shadow-lg hover:bg-green-100`}
                                                onClick={() => fetchChatMessages(chat._id, chat.userId._id)}
                                            >
                                                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                                                    {/* Profile Picture */}
                                                    <div className="w-12 h-12 flex-shrink-0 relative">
                                                        {chat.userId.profilePicture ? (
                                                            <Image
                                                                src={chat.userId.profilePicture}
                                                                alt={chat.userId.name}
                                                                width={48}
                                                                height={48}
                                                                className="rounded-full shadow-md object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-green-100 flex items-center justify-center rounded-full">
                                                                <span className="text-green-700 font-bold">U</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Chat Info */}
                                                    <div className="flex-grow overflow-hidden text-center md:text-left">
                                                        <h3 className="text-md font-medium text-green-800 truncate">{chat.userId.name}</h3>
                                                        <div className="flex items-center justify-center md:justify-start space-x-2">
                                                            <span className={`w-3 h-3 rounded-full ${isOnline(chat.userId._id) ? "bg-green-500" : "bg-gray-400"}`}></span>
                                                        </div>
                                                        <p className="text-sm text-green-600 truncate">{chat.lastMessage}</p>
                                                    </div>

                                                    {/* Timestamp & Notification */}
                                                    <div className="flex md:flex-col items-center md:items-end justify-center gap-1 md:ml-4 text-xs">
                                                        <span className="text-gray-500 whitespace-nowrap">
                                                            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </span>
                                                        {chat.isReadCc > 0 && (
                                                            <span className="bg-green-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg">
                                                                {chat.isReadCc}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* Chat Section */}
                        {loadMessages ?
                            <div className="d-flex justify-center w-3/4">
                                <FireLoading renders={"Loading Chats"} />
                            </div>
                            :
                            <>
                                {selectedUser ? (
                                    <main className="h-screen flex-1 flex flex-col h-[600px]">
                                        <div className="border-b border-green-200 pb-4 mb-4">
                                            <h2 className="text-lg font-semibold text-green-800">
                                                Chat with {chats?.find((u) => u.userId._id === selectedUser)?.userId.name}
                                            </h2>
                                        </div>

                                        {/* Chat Messages */}
                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar bg-green-50">
                                            {messages?.map((msg) => (
                                                <div
                                                    key={msg._id}
                                                    className={`group flex ${msg.senderId === company?._id ? "justify-end" : "justify-start"
                                                        } mb-4 mx-6`}
                                                >
                                                    <div
                                                        className={`relative p-4 text-sm ${msg.senderId === company?._id
                                                            ? "bg-green-800 text-white"
                                                            : "bg-gray-300 text-gray-800"
                                                            } rounded-xl shadow-lg max-w-[75%] break-words group-hover:opacity-100`}
                                                        onClick={() => handleDeleteClick(msg._id)}
                                                    >
                                                        {/* Handle deleted messages */}
                                                        {msg.deletedForSender && company?._id === msg.senderId ? (
                                                            <p className="italic opacity-70">Deleted by you</p>
                                                        ) : msg.deletedForSender && company?._id !== msg.senderId ? (
                                                            <p className="italic opacity-70">Deleted by User</p>
                                                        ) : msg.deletedForReceiver && company?._id === msg.receiverId ? (
                                                            <p className="italic opacity-70">Deleted by you</p>
                                                        ) : msg.deletedForReceiver && company?._id !== msg.receiverId ? (
                                                            <p className="leading-relaxed">{msg.content}</p>
                                                        ) : msg.isImage ? (
                                                            <Image
                                                                src={msg.content}
                                                                alt="Message Image"
                                                                width={220}
                                                                height={220}
                                                                objectFit="contain"
                                                                className="rounded-lg mb-2 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleImageClick(msg.content)
                                                                }}
                                                            />
                                                        ) : (
                                                            <p className="leading-relaxed cursor-pointer">{msg.content}</p>
                                                        )}

                                                        {/* Message Time */}
                                                        <p
                                                            className={`text-xs mt-1 text-right ${msg.senderId === company?._id ? "text-white" : "text-gray-500"
                                                                }`}
                                                        >
                                                            {msg.createdAt
                                                                ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })
                                                                : new Date().toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Full Image Modal */}
                                            {isModalOpen && (
                                                <div
                                                    className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                                                    onClick={handleCloseModal} // Close the modal when clicking anywhere on the screen
                                                >
                                                    <div
                                                        className="relative"
                                                        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking on the image
                                                    >
                                                        <Image
                                                            src={currentImage} // Full-size image URL
                                                            alt="Full Image"
                                                            width={800} // Adjust as per your requirements
                                                            height={800} // Adjust as per your requirements
                                                            objectFit="contain"
                                                            className="rounded-lg"
                                                        />
                                                        <button
                                                            onClick={handleCloseModal} // Close button to close the modal
                                                            className="absolute top-4 right-4 text-white text-2xl"
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {showDeletePopup && selectedMessage && (
                                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                                    <div className="bg-white p-4 rounded-lg shadow-md w-64">
                                                        <p className="text-center text-gray-800 mb-4">Delete message?</p>

                                                        {/* If the user is the sender, show both options */}
                                                        {messages?.find((msg) => msg._id === selectedMessage)?.senderId === company?._id ? (
                                                            <>
                                                                <button
                                                                    onClick={() => deleteMessage(selectedMessage, true)}
                                                                    className="w-full bg-red-600 text-white py-2 rounded-md mb-2 hover:bg-red-700"
                                                                >
                                                                    Delete for Everyone
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteMessage(selectedMessage)}
                                                                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
                                                                >
                                                                    Delete for Me
                                                                </button>
                                                            </>
                                                        ) : (
                                                            // If the user is the receiver, show only "Delete for Me"
                                                            <button
                                                                onClick={() => deleteMessage(selectedMessage)}
                                                                className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
                                                            >
                                                                Delete for Me
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => setShowDeletePopup(false)}
                                                            className="w-full mt-2 text-gray-500 hover:text-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Show Emoji Picker */}
                                            {showEmojiPicker && (
                                                <div className="absolute bottom-16 right-4 z-50">
                                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Message Input */}
                                        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-lg shadow-md">
                                            {/* Image Preview Section */}
                                            {selectedImages.length > 0 && (
                                                <div className="flex gap-2 mb-2">
                                                    {selectedImages.map((image, index) => (
                                                        <div key={index} className="relative">
                                                            <Image
                                                                src={URL.createObjectURL(image)}
                                                                alt="preview"
                                                                className="w-16 h-16 rounded-lg object-cover"
                                                                width={40}
                                                                height={40}
                                                            />
                                                            <button
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {/* Send Button for Images */}
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={handleImageSend}
                                                            className="bg-green-600 text-white p-1 w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-green-700 transition-all duration-300"
                                                        >
                                                            <IoSend size={20} />
                                                        </button>
                                                    </div>


                                                </div>
                                            )}

                                            {/* Input Section */}
                                            <div className="flex items-center gap-4">
                                                {/* Emoji Button */}
                                                <button className="text-2xl text-gray-600 hover:text-gray-800 transition-all duration-300" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                                    😊
                                                </button>

                                                {/* Image Button */}
                                                <label htmlFor="image-upload" className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer transition-all duration-300">
                                                    📷
                                                </label>
                                                <input
                                                    type="file"
                                                    id="image-upload"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Type a message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    className="flex-1 px-4 py-3 bg-white text-gray-800 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                                                />

                                                <button
                                                    onClick={handleSendMessage}
                                                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </main>
                                ) : (
                                    <div className="flex items-center justify-center flex-1 text-yellow-600">
                                        Select a user to start chatting
                                    </div>
                                )}
                            </>
                        }
                    </div>
                </div>
            </Suspense>
        </>
    );


};

export default CompanyChatPage;
