"use client";
import { onGetMessages } from '@/services/userApi';
import { useAppSelector } from '@/store/hooks';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import Swal from 'sweetalert2';
import io, { Socket } from "socket.io-client";
import { Message } from '@/utils/type';
import Image from 'next/image';


// interface Message {
//     senderId: string;
//     receiverId: string;
//     content: string;
//     roomId: string;
//     timestamp: string;
// }


function ChatRoom() {
    const searchParams = useSearchParams();
    const roomDetailsString = searchParams!.get('chatRoom');
    let roomDetails = null;
    if (roomDetailsString) {
        roomDetails = JSON.parse(decodeURIComponent(roomDetailsString));
    }
    const user = useAppSelector(state => state.users.user)
    // console.log("ROOM Dets by SearchParams : ", roomDetails);

    const { _id, userId, companyId } = roomDetails;
    const roomId = _id;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<Socket | null>(null); // Use useRef to persist the socket instance


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    useEffect(() => {
        if (!roomId && socketRef.current) {
            socketRef.current.disconnect(); // Disconnect the socket if roomId is not provided
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off("receiveMessage"); // Remove the listener on cleanup
            }
        };
    }, [roomId]);


    const getAllUserMessages = useCallback(async () => {
        try {
            const response = await onGetMessages(roomId)
            if (response.success) {
                const { data } = response
                console.log("MESsages Got Successfulee :!!", data);
                console.log("MEssages :", data.messages);
                setMessages((prevMessages) => {
                    if (prevMessages.length === 0) {
                        return data.messages.messages.map((msg: { createdAt: string }) => ({
                            ...msg,
                            timestamp: msg.createdAt || new Date().toISOString()
                        }));
                    }
                    return prevMessages;
                });
            }
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end', // Position of the toast
                icon: 'error', // Icon type: 'success', 'error', 'warning', 'info', 'question'
                title: 'Something went wrong!', // Title of the toast
                text: (error as Error).message || 'Please try again later.', // Additional message
                showConfirmButton: false, // Removes the confirm button
                timer: 2000, // Toast duration in milliseconds
                timerProgressBar: true, // Shows a progress bar
            });
        }
    }, [roomId])

    useEffect(() => {
        console.log("SOCKET Initial");

        // Initialize the socket connection and store it in the ref
        socketRef.current = io("https://api.turfbooking.online");

        // Join the specified room
        socketRef.current.emit("joinRoom", roomId);

        const handleReceiveMessage = (msg: Message) => {
            console.log("THSI receive is called in front :", msg);

            const messageWithTimestamp = {
                ...msg,
                timestamp: msg.createdAt || new Date().toISOString(),
            };

            setMessages((prevMessages) => {
                if (
                    !prevMessages.some(
                        (message) =>
                            message.content === messageWithTimestamp.content &&
                            message.senderId === messageWithTimestamp.senderId
                    )
                ) {
                    return [...prevMessages, messageWithTimestamp];
                }
                return prevMessages;
            });
        };

        // Listen for the "receiveMessage" event
        socketRef.current.on("receiveMessage", handleReceiveMessage);

        // Fetch all user messages when the component mounts
        getAllUserMessages();

        // Cleanup function to remove the socket listener and disconnect the socket
        return () => {
            if (socketRef.current) {
                socketRef.current.off("receiveMessage", handleReceiveMessage);
                socketRef.current.disconnect();
            }
        };
    }, [roomId, getAllUserMessages]);


    // const response = await onSendMessage(userId, companyId, { message, timestamp, roomId })

    // if (response.success) {
    //     const { data } = response
    //     console.log("MEsss Age Res : ", data);
    //     setMessages(prevMessages => [
    //         ...prevMessages,
    //         data.message
    //     ]);
    // }
    // console.log("THe SendMesg EMITTTSSS");

    const handleSendMessage = async () => {
        try {
            if (!message.trim()) return; // Prevent sending empty messages

            if (!socketRef.current) {
                socketRef.current = io("https://api.turfbooking.online");
            }

            const timestamp = new Date().toISOString(); // Generate current timestamp

            socketRef.current.emit('sendMessage', {
                roomId,
                content: message,
                senderId: userId,
                sender: "user",
                receiverId: companyId,
                timestamp
            });

            setMessage('');

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
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col w-3/4 h-3/4 bg-gray-100 text-gray-800 rounded-lg shadow-lg">
                {/* Header */}
                <div className="p-4 bg-green-700 rounded-t-lg shadow-md flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Chat With Turf (view chats in Messages tab)</h1>
                </div>

                {/* Chat Messages Section */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white no-scrollbar">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`group flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"
                                } mb-4 mx-6`}
                        >
                            <div
                                className={`relative p-4 text-sm ${msg.senderId === user?._id
                                    ? "bg-green-800 text-white"
                                    : "bg-gray-300 text-gray-800"
                                    } rounded-xl shadow-lg max-w-[75%] break-words group-hover:opacity-100`}
                            // onClick={() => handleDeleteClick(msg._id)}
                            >
                                {/* Handle deleted messages */}
                                {msg.deletedForSender && user?._id === msg.senderId ? (
                                    <p className="italic opacity-70">Deleted by you</p>
                                ) : msg.deletedForSender && user?._id !== msg.senderId ? (
                                    <p className="italic opacity-70">Deleted by Compnany</p>
                                ) : msg.deletedForReceiver && user?._id === msg.receiverId ? (
                                    <p className="italic opacity-70">Deleted by you</p>
                                ) : msg.deletedForReceiver && user?._id !== msg.receiverId ? (
                                    <p className="leading-relaxed cursor-pointer">{msg.content}</p>
                                )
                                    : msg.isImage ? (
                                        <Image
                                            src={msg.content}
                                            alt="Message Image"
                                            width={220}
                                            height={220}
                                            objectFit="contain"
                                            className="rounded-lg mb-2 cursor-pointer"
                                        // onClick={(e) => {
                                        //     e.stopPropagation();
                                        //     handleImageClick(msg.content)
                                        // }}
                                        />
                                    ) : (
                                        <p className="leading-relaxed cursor-pointer">{msg.content}</p>
                                    )}

                                {/* Message Time */}
                                <p
                                    className={`text-xs mt-1 text-right ${msg.senderId === user?._id ? "text-white" : "text-gray-500"
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
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Section */}
                <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-lg shadow-md">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
            </div>
        </div>

    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatRoom />
        </Suspense>
    );
}