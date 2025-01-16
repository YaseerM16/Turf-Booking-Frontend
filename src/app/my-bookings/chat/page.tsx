'use client'
// import { CHAT_SERVICE_URL } from '@/utils/constants';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
// import io from "socket.io-client";

// const socket = io("https://jobclub.live", {
//     path: "/socket.io", // Matches the server's path
//     transports: ["websocket", "polling"], // Ensure compatibility
//     withCredentials: true, // Matches the server's CORS settings
// });
interface Message {
    sender: string;
    receiver: string;
    message: string;
    roomId: string;
    timestamp: string;
}


function Page() {
    const searchParams = useSearchParams();
    const roomDetailsString = searchParams!.get('roomDetails');
    let roomDetails = null;
    if (roomDetailsString) {
        roomDetails = JSON.parse(decodeURIComponent(roomDetailsString));
    }
    // const { _id, userId, companyId } = roomDetails;
    let roomId = "_id";

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        // socket.emit("joinRoom", roomId);

        const handleReceiveMessage = (msg: Message) => {
            const messageWithTimestamp = {
                ...msg,
                timestamp: msg.timestamp || new Date().toISOString()
            };

            setMessages(prevMessages => {
                if (!prevMessages.some((message) => message.message === messageWithTimestamp.message && message.sender === messageWithTimestamp.sender)) {
                    return [...prevMessages, messageWithTimestamp];
                }
                return prevMessages;
            });
        };

        // socket.on("receiveMessage", handleReceiveMessage);

        async function getAllUserMessages() {
            // const response = await axios.get(`${CHAT_SERVICE_URL}/getMessages`, {
            //     params: { companyId, roomId },
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     withCredentials: true
            // })
            const response: any = []
            // setMessages((prevMessages) => {
            //     if (prevMessages.length === 0) {
            //         return response.data.getMessages.map((msg: { timestamp: any }) => ({
            //             ...msg,
            //             timestamp: msg.timestamp || new Date().toISOString()
            //         }));
            //     }
            //     return prevMessages;
            // });
        }
        getAllUserMessages();

        // return () => {
        //     socket.off("receiveMessage", handleReceiveMessage);
        // };
    }, [roomId]);



    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const timestamp = new Date().toISOString();


        let response = await axios.post(`${"CHAT_SERVICE_URL"}/postMessage`, {
            sender: "userId",
            receiver: "companyId",
            message,
            timestamp
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });


        // socket.emit('sendMessage', { roomId: _id, message, sender: userId, timestamp });


        // setMessages(prevMessages => [
        //     ...prevMessages,
        //     { sender: userId, receiver: companyId, message, roomId: _id, timestamp }
        // ]);

        setMessage('');
    };




    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col w-3/4 h-3/4 bg-gray-100 text-gray-800 rounded-lg shadow-lg">
                {/* Header */}
                <div className="p-4 bg-green-700 rounded-t-lg shadow-md flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Chat Room</h1>
                    <span className="text-gray-200 text-sm italic">Online</span>
                </div>

                {/* Chat Messages Section */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === "userId" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`p-4 text-sm ${msg.sender === "userId"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-300 text-gray-800"
                                    } rounded-lg shadow-lg`}
                                style={{
                                    maxWidth: "70%",
                                    wordWrap: "break-word",
                                    borderRadius: "15px",
                                }}
                            >
                                <p className="leading-relaxed">{msg.message}</p>
                                <p className="text-xs text-gray-400 mt-2 text-right">
                                    {msg.timestamp
                                        ? new Date(msg.timestamp).toLocaleTimeString([], {
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

export default Page;