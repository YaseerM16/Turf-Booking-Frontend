"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import FireLoading from "../FireLoading";
import { getChats, onGetMessages } from "@/services/userApi";
import { ChatRoom, Message } from "@/utils/type";
import { useSearchParams } from "next/navigation";


interface Company {
    companyname: string;
    companyemail: string;
    phone: number | string;
    profilePicture: string;
    _id: string;
};


const ChatPage = () => {
    const [loadingChats, setLoadingChats] = useState(false)
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadMessages, setLoadMsgs] = useState<boolean>(false)
    const [selectedChat, setSelectedChat] = useState<{ Company: Company, roomId: string } | null>(null);
    const roomIdRef = useRef<string | null>(null);
    roomIdRef.current = selectedChat?.roomId || null;
    const user = useAppSelector(state => state.users.user)
    const [chats, setChats] = useState<ChatRoom[] | null>(null)
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<Socket | null>(null);

    const searchParams = useSearchParams();
    const roomId = (() => {
        const roomId = searchParams?.get("roomId");
        if (!roomId) return null;

        try {
            const decodedDets = decodeURIComponent(roomId);
            return JSON.parse(decodedDets) as string;
        } catch (error) {
            console.error("Failed to parse roomId :", error);
            return null;
        }
    })();

    console.log("ROOM ID by the REQUEST :", roomId);




    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchChats = useCallback(async () => {
        try {
            setLoadingChats(true);
            const response = await getChats(user?._id as string)

            if (response?.success) {
                const { data } = response
                // setChats(data.rooms)
                setChats(data.chats)
                setLoadingChats(false)
            }

        } catch (error) {
            console.error("Error fetching Turfs [] data:", error);
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
        } finally {
            setLoadingChats(false);
        }
    }, [user?._id])

    const fetchChatMessages = useCallback(async (roomId: string, company: Company) => {
        try {
            setLoadMsgs(true)
            // const response = await getChatMessages(roomId)
            // console.log("ROOMID TO THE APICALL GETMSG :- ", roomId);

            const response = await onGetMessages(roomId)

            if (response.success) {
                setLoadMsgs(false)
                const { data } = response
                // console.log("Updated Chat :", data.messages.chat)
                setMessages(data.messages.messages)
                setSelectedChat({ Company: company, roomId })
                setChats((prevChats) => {
                    if (!prevChats) return null; // Handle null case
                    return prevChats.map((chat) =>
                        chat._id === roomId ? { ...chat, ...data.messages.chat } : chat
                    );
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
    }, [])

    // const roomId = selectedChat?.roomId
    // const response = await onSendMessage(user?._id as string, selectedChat?.Company._id as string, { message, timestamp, roomId })

    // if (response.success) {
    //     const { data } = response
    //     console.log("MEsss Age Res : ", data);
    //     setMessages(prevMessages => [
    //         ...prevMessages,
    //         data.message
    //     ]);
    // }


    // socket.emit('sendMessage', { roomId: _id, message, sender: userId, timestamp });
    const handleSendMessage = async () => {
        try {
            if (!message.trim()) return;

            const timestamp = new Date().toISOString();

            // Initialize the socket if it's not already connected
            if (!socketRef.current) {
                socketRef.current = io("http://localhost:5000");
            }

            // Emit the message event using the socket
            socketRef.current.emit('sendMessage', {
                roomId: selectedChat?.roomId,
                content: message,
                senderId: user?._id,
                sender: "user",
                receiverId: selectedChat?.Company._id,
                timestamp,
            });

            // Clear the input field after sending the message
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



    useEffect(() => {
        if (user?._id) {
            fetchChats();
        }
    }, [user?._id, fetchChats]);

    useEffect(() => {

        // console.log("RomId Befroe :", selectedChat?.roomId);
        socketRef.current = io("http://localhost:5000");
        if (socketRef.current !== null) {
            socketRef.current.emit("joinRoom", selectedChat?.roomId);
        }

        const handleReceiveMessage = (msg: Message) => {

            const messageWithTimestamp = {
                ...msg,
                timestamp: msg.createdAt || new Date().toISOString()
            };

            setMessages(prev => [...(prev ?? []), messageWithTimestamp])

        };

        socketRef.current.on("receiveMessage", handleReceiveMessage);

        return () => {
            const performUnmountApiCall = async () => {
                try {
                    const roomId = roomIdRef.current; // Use the value stored in the ref
                    // console.log("RoomId to the unmount API:", roomId); // This will log the correct roomId

                    if (roomId) {
                        const response = await onGetMessages(roomId);
                        if (response.success) {
                            console.log("Unmount API call successful :)");
                        }
                    }
                } catch (error) {
                    console.log("Error in unmount API call:", error);
                }
            };

            performUnmountApiCall();

            socketRef.current?.off("receiveMessage", handleReceiveMessage);
        };
    }, [selectedChat?.roomId]);

    return (
        <div className="h-screen bg-green-50 flex mb-4 h-[600px]">
            {/* Sidebar */}
            <aside className="w-1/4 bg-white shadow-md border-r border-gray-200">
                {loadingChats ?
                    <FireLoading renders={"Loading Chats"} />
                    :
                    <>
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800">Chats</h2>
                        </div>
                        <ul className="divide-y">
                            {chats?.map((chat, index) => (
                                <li
                                    key={index}
                                    className="flex items-center p-4 hover:bg-green-50 cursor-pointer relative transition duration-300"
                                    onClick={() => fetchChatMessages(chat._id, chat.companyId)}
                                >
                                    {/* Profile Picture */}
                                    <div className="h-12 w-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 relative">
                                        <Image
                                            src={chat.companyId.profilePicture ? chat.companyId.profilePicture : "/logo.jpeg"}
                                            alt={chat.companyId.companyname}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Chat Info */}
                                    <div className="ml-4 flex-grow overflow-hidden">
                                        <h3 className="text-md font-semibold text-green-800 truncate">{chat.companyId.companyname}</h3>
                                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                    </div>

                                    {/* Additional Info (Timestamp and Notification) */}
                                    <div className="flex flex-col items-end justify-center gap-1 ml-4">
                                        {/* Timestamp */}
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </span>
                                        {/* Notification Count */}
                                        {chat.isReadUc > 0 && (
                                            <span className="bg-green-500 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full shadow-lg">
                                                {chat.isReadUc}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>}
            </aside>

            {/* Chat Section */}
            {loadMessages ?
                <div className="d-flex justify-center w-3/4">
                    <FireLoading renders={"Lodaing Chats"} />
                </div>
                :
                <>
                    {selectedChat ?
                        <main className="h-screen flex-1 flex flex-col h-[600px]">
                            {/* Chat Header */}
                            <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                                        <Image
                                            src={selectedChat.Company.profilePicture ? selectedChat.Company.profilePicture : "/logo.jpeg"}
                                            alt={selectedChat.Company.companyname}
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-gray-800">{selectedChat.Company.companyname}</h3>
                                        <p className="text-sm text-gray-600">Online</p>
                                    </div>
                                </div>
                            </header>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar bg-green-50">

                                {messages?.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`p-4 text-sm ${msg.senderId === user?._id
                                                ? "bg-green-800 text-white"
                                                : "bg-gray-300 text-gray-800"
                                                } rounded-lg shadow-lg`}
                                            style={{
                                                maxWidth: "70%",
                                                wordWrap: "break-word",
                                                borderRadius: "15px",
                                            }}
                                        >
                                            <p className="leading-relaxed">{msg.content}</p>
                                            <p className="text-xs text-white mt-2 text-right">
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
                        </main>

                        :

                        <div className="flex items-center justify-center flex-1 text-yellow-600">
                            Select a Company to start chatting
                        </div>
                    }
                </>
            }

        </div>
    );
};

export default ChatPage;
