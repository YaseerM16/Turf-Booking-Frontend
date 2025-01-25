"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import Header from "@/components/company/CompanyHeader";
import Sidebar from "@/components/company/CompanySidebar";
import { getChatLists, getChatMessages } from "@/services/companyApi";
import { useAppSelector } from "@/store/hooks";
import { ChatRoom, Message } from "@/utils/type"
import Swal from "sweetalert2";
import FireLoading from "@/components/FireLoading";

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
    }, [])

    useEffect(() => {
        if (company?._id) {
            fetchChats();
        }

    }, [company?._id, fetchChats]);

    useEffect(() => {
        console.log("SOCKET Initial");

        console.log("RomId Befroe :", chat);
        socketRef.current = io("http://localhost:5000");
        if (socketRef.current !== null) {
            socketRef.current.emit("joinRoom", chat);
        }
        console.log("RomId After :", chat);

        const handleReceiveMessage = (msg: Message) => {
            // console.log("THSI recevy is called in front :", msg);
            const messageWithTimestamp = {
                ...msg,
                timestamp: msg.createdAt || new Date().toISOString()
            };
            setMessages(prev => [...(prev ?? []), messageWithTimestamp])
        };

        socketRef.current.on("receiveMessage", handleReceiveMessage);

        return () => {
            socketRef.current?.off("receiveMessage", handleReceiveMessage);
        };
    }, [chat]);


    console.log("CHATS :", chats);
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
                socketRef.current = io("http://localhost:5000");
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


    return (
        <>
            <div className="flex h-screen">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />

                    <div
                        className="bg-gray-100 flex-1 p-6 overflow-y-auto"
                        style={{ maxHeight: 'calc(100vh - 150px)' }}
                    >
                        <div className="bg-white rounded-lg shadow-md flex h-full">
                            {/* User List Section */}
                            <div className="w-full md:w-1/4 bg-green-50 border-r border-green-200 p-4 overflow-y-auto">
                                {loadingChats ?
                                    <FireLoading renders={"Loading Chats"} />
                                    :
                                    <>
                                        <h2 className="text-lg font-semibold text-green-800 mb-4">Chat Users</h2>
                                        <ul className="space-y-4">
                                            {chats?.map((chat) => (
                                                <li
                                                    key={chat._id}
                                                    className={`p-4 rounded-md shadow-md cursor-pointer transition-all ${company?._id === chat._id ? 'bg-green-200' : 'bg-white'
                                                        } hover:shadow-lg hover:bg-green-100`}
                                                    onClick={() => fetchChatMessages(chat._id, chat.userId._id)}
                                                >
                                                    <div className="flex items-center gap-4">
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
                                                        <div className="flex-grow overflow-hidden">
                                                            <h3 className="text-md font-medium text-green-800 truncate">{chat.userId.name}</h3>
                                                            <p className="text-sm text-green-600 truncate">{chat.lastMessage}</p>
                                                        </div>

                                                        {/* Additional Info (Timestamp and Notification) */}
                                                        <div className="flex flex-col items-end justify-center gap-1 ml-4">
                                                            {/* Timestamp */}
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                            </span>
                                                            {/* Notification Count */}
                                                            {chat.isReadCc > 0 && (
                                                                <span className="bg-green-500 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full shadow-lg">
                                                                    {chat.isReadCc}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            </div>


                            {/* Chat Section */}
                            {loadMessages ?
                                <div className="d-flex justify-center w-3/4">
                                    <FireLoading renders={"Loading Chats"} />
                                </div>
                                :
                                <>
                                    <div className="flex-1 bg-green-100 p-6 flex flex-col">
                                        {selectedUser ? (
                                            <>
                                                {/* Chat Header */}
                                                <div className="border-b border-green-200 pb-4 mb-4">
                                                    <h2 className="text-lg font-semibold text-green-800">
                                                        Chat with {chats?.find((u) => u.userId._id === selectedUser)?.userId.name}
                                                    </h2>
                                                </div>

                                                {/* Chat Messages */}
                                                <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                                                    {messages?.map((message, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex ${message.senderId == company?._id
                                                                ? 'justify-end'
                                                                : 'justify-start'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`p-4 rounded-lg shadow-md ${message.senderId == company?._id
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-white text-black'
                                                                    } max-w-sm`}
                                                            >
                                                                {message.content}
                                                                <p className="text-xs text-black mt-2 text-right">
                                                                    {message.createdAt
                                                                        ? new Date(message.createdAt).toLocaleTimeString([], {
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
                                                    <div ref={messagesEndRef} />

                                                </div>

                                                {/* Message Input */}
                                                <div className="mt-4">
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="text"
                                                            className="flex-1 px-4 py-2 border border-yellow-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                            placeholder="Type your message..."
                                                            value={newMessage}
                                                            onChange={(e) => setNewMessage(e.target.value)}
                                                        />
                                                        <button
                                                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium shadow-md transition-all"
                                                            onClick={handleSendMessage}
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center flex-1 text-yellow-600">
                                                Select a user to start chatting
                                            </div>
                                        )}
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                </div>
            </div>


            {/* Footer */}
            <footer className="bg-green-700 text-white py-4">
                <div className="container mx-auto text-center">
                    <p className="text-sm">© 2024 Turf Booking. All rights reserved.</p>
                </div>
            </footer>
        </>
    );


};

export default CompanyChatPage;
