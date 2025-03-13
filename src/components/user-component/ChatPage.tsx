"use client";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import FireLoading from "../FireLoading";
import { deleteNotification, getChats, messageDeleteForEveryone, messageDeleteForMe, onGetMessages, updateNotifications } from "@/services/userApi";
import { ChatRoom, Message } from "@/utils/type";
import { useSearchParams } from "next/navigation";
import EmojiPicker from 'emoji-picker-react';  // Import emoji picker
import { IoArrowBack, IoSend } from "react-icons/io5"; // Import send icon
import { format, isToday, isYesterday, parseISO } from "date-fns";

interface Company {
    companyname: string;
    companyemail: string;
    phone: number | string;
    profilePicture: string;
    _id: string;
};

type ChatPageProps = {
    navbarSocket: React.RefObject<Socket | null>;
};
const ChatPage: React.FC<ChatPageProps> = () => {
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
                    //     prevMessages.map((msg) =>
                    //         msg._id === data.message._id ? data.message : msg
                    //     )
                    // );
                    if (!socketRef.current) {
                        socketRef.current = io("https://api.turfbooking.online", {
                            path: "/socket.io/",
                            transports: ["websocket", "polling"], // Ensure both transports are enabled
                            withCredentials: true
                        });
                    }

                    socketRef.current.emit('deleteNotify', { message: data.message, roomId: selectedChat?.roomId })
                }
            } else {
                const response = await messageDeleteForMe(msgId)
                if (response.success) {
                    const { data } = response
                    // setMessages((prevMessages) =>
                    //     prevMessages.map((msg) =>
                    //         msg._id === data.message._id ? data.message : msg
                    //     )
                    // );
                    if (!socketRef.current) {
                        socketRef.current = io("https://api.turfbooking.online", {
                            path: "/socket.io/",
                            transports: ["websocket", "polling"], // Ensure both transports are enabled
                            withCredentials: true
                        });
                    }

                    socketRef.current.emit('deleteNotify', { message: data.message, roomId: selectedChat?.roomId })
                }
            }
            setShowDeletePopup(false);
        } catch (error) {
            console.log("Error while Deleting the Message :", error);
        }
    };

    // const sfsd: Notification
    const searchParams = useSearchParams();

    // console.log("ROOM ID by the REQUEST :", queries);

    const groupedMessages = messages?.reduce((acc, msg) => {
        const messageDate = msg.createdAt ? parseISO(msg.createdAt) : new Date();

        let dateLabel = format(messageDate, "MMMM d, yyyy"); // Default: formatted date

        if (isToday(messageDate)) dateLabel = "Today";
        else if (isYesterday(messageDate)) dateLabel = "Yesterday";

        if (!acc[dateLabel]) acc[dateLabel] = [];
        acc[dateLabel].push(msg);

        return acc;
    }, {} as Record<string, typeof messages>);


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
                const isNotifiyDeleted = await deleteNotification(roomId, user?._id as string, "user")
                if (isNotifiyDeleted.success) {
                    console.log("RESponse by DelNotify :: ", response);
                    setMessages(data.messages.messages)
                    setSelectedChat({ Company: company, roomId })
                    setChats((prevChats) => {
                        if (!prevChats) return null; // Handle null case
                        return prevChats.map((chat) =>
                            chat._id === roomId ? { ...chat, ...data.messages.chat } : chat
                        );
                    });
                }

                // const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');


                // // Find if a notification with the roomId exists
                // const notificationIndex = notifications.findIndex((notif: Notification) => notif.roomId === roomId);
                // console.log("notificationIndex :", notificationIndex);

                // if (notificationIndex !== -1) {
                //     // Remove the notification from the list
                //     notifications.splice(notificationIndex, 1);

                //     // Update localStorage with the modified list

                //     localStorage.setItem('notifications', JSON.stringify(notifications));
                //     setNotifications(notifications)
                //     console.log(`Notification with roomId: ${roomId} has been removed from localStorage.`);
                // }
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
    }, [user?._id])



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
            if (!socketRef.current) {
                socketRef.current = io("https://api.turfbooking.online", {
                    path: "/socket.io/",
                    transports: ["websocket", "polling"], // Ensure both transports are enabled
                    withCredentials: true
                });
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
        const queries = (() => {
            const roomId = searchParams?.get("roomId");
            const company = searchParams?.get("company");
            if (!roomId) return null;
            if (!company) return null;

            try {
                const decodedDets = decodeURIComponent(roomId);
                const companyDets = decodeURIComponent(company)
                return { roomId: JSON.parse(decodedDets) as string, company: JSON.parse(companyDets) }
            } catch (error) {
                console.error("Failed to parse roomId :", error);
                return null;
            }
        })();

        if (queries?.roomId) {
            fetchChatMessages(queries.roomId, queries.company)
        }
    }, [user?._id, fetchChats, fetchChatMessages, searchParams]);

    useEffect(() => {

        // console.log("RomId Befroe :", selectedChat?.roomId);
        socketRef.current = io("https://api.turfbooking.online", {
            path: "/socket.io/",
            transports: ["websocket", "polling"], // Ensure both transports are enabled
            withCredentials: true
        });
        if (socketRef.current !== null) {
            socketRef.current.emit("joinRoom", selectedChat?.roomId);
            socketRef.current.emit("userOnline", { roomId: selectedChat?.roomId, userId: user?._id });
        }

        const handleReceiveMessage = (msg: Message) => {

            const messageWithTimestamp = {
                ...msg,
                timestamp: msg.createdAt || new Date().toISOString()
            };

            setMessages(prev => [...(prev ?? []), messageWithTimestamp])

        };

        const handleMessageDeleted = (deletedMsg: Message) => {
            // setMessages(msgs)
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
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

            console.log("Handling NewNotification :!!:");
            console.log("USER_ID :", user?._id);
            console.log("RECEiverID :", message.receiverId);

            if (selectedChat?.roomId == message.room._id) return  // prevent the notification count if you inside the chat

            if (user?._id !== message.receiverId) {
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
                userId: user?._id,
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

            console.log("NEWnotify :", newNotification);


            const saveNotifications = async () => {
                try {
                    const response = await updateNotifications(newNotification, "user")
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
            socketRef.current?.off("updateOnlineStatus");
            socketRef.current?.off("receiveMessage", handleReceiveMessage);
            socketRef.current?.off("newNotification", handleNewNotification);
            socketRef.current?.off("messageDeleted", handleMessageDeleted);

            socketRef.current?.emit("userOffline", { roomId: selectedChat?.roomId, userId: user?._id });
        };
    }, [selectedChat?.roomId, user?._id]);

    const isOnline = (userId: string) => onlineUsers.includes(userId);

    const handleEmojiClick = (emoji: { emoji: string }) => {
        setMessage(prev => prev + emoji.emoji);  // Append the selected emoji to the message
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
                socketRef.current = io("https://api.turfbooking.online", {
                    path: "/socket.io/",
                    transports: ["websocket", "polling"], // Ensure both transports are enabled
                    withCredentials: true
                });
            }
            const imagesWithMetadata = selectedImages.map(file => ({
                buffer: file,
                originalname: file.name,  // Filename
                mimetype: file.type       // Mimetype
            }));

            // Emit the message event using the socket
            socketRef.current.emit('sendMessage', {
                roomId: selectedChat?.roomId,
                content: imagesWithMetadata,
                senderId: user?._id,
                sender: "user",
                receiverId: selectedChat?.Company._id,
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
    console.log("Mesages :", messages);


    return (
        <Suspense fallback={<div>Loading...</div>}>

            <div className="h-screen bg-green-50 flex flex-col">
                {/* Sidebar */}
                <aside
                    className={`w-full md:w-1/4 bg-green-50 border-r border-green-200 p-4 overflow-y-auto 
                    ${selectedChat ? "hidden" : "block"} md:block`}
                >
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
                                        className={`flex items-center p-4 hover:bg-green-50 cursor-pointer relative transition duration-300 ${selectedChat?.Company._id === chat.companyId._id ? 'bg-green-200' : 'bg-white'
                                            }`}
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
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-3 h-3 rounded-full ${isOnline(chat.companyId._id) ? "bg-green-500" : "bg-gray-400"}`}></span>
                                                {/* <span>{chat.companyId.companyname}</span> */}
                                            </div>

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
                            <>
                                <main className="flex-1 flex flex-col overflow-y-auto">
                                    {/* Chat Header */}
                                    <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200 sticky top-0 w-full z-10">
                                        <div className="flex items-center">
                                            {/* Back Icon (Only for Mobile) */}
                                            <button className="text-green-800 text-2xl mb-2" onClick={() => setSelectedChat(null)}>
                                                <IoArrowBack />
                                            </button>
                                            <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                                                <Image
                                                    src={selectedChat.Company.profilePicture ? selectedChat.Company.profilePicture : "/logo.jpeg"}
                                                    alt={selectedChat.Company.companyname}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-gray-800">{selectedChat.Company.companyname}</h3>

                                            <div className="ml-4 flex flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className={`w-3 h-3 rounded-full shadow-md ${isOnline(selectedChat.Company._id) ? "bg-green-500" : "bg-gray-400"
                                                            }`}
                                                    ></span>
                                                    <span className="text-sm text-gray-600">
                                                        {isOnline(selectedChat.Company._id) ? "Online" : "Offline"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </header>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar bg-green-50 p-4 md:p-6">
                                        <div>
                                            {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
                                                <div key={dateLabel}>
                                                    {/* Date Separator */}
                                                    <div className="relative flex items-center my-6">
                                                        <div className="flex-grow border-t border-gray-300"></div>
                                                        <span className="px-4 text-gray-600 text-xs bg-white shadow-md rounded-full py-1">
                                                            {dateLabel}
                                                        </span>
                                                        <div className="flex-grow border-t border-gray-300"></div>
                                                    </div>


                                                    {msgs.map((msg) => (
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
                                                                onClick={() => handleDeleteClick(msg._id)}
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

                                                </div>
                                            ))}
                                        </div>

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
                                                        width={700} // Adjust as per your requirements
                                                        height={700} // Adjust as per your requirements
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
                                                    {messages.find((msg) => msg._id === selectedMessage)?.senderId === user?._id ? (
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


                                    <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 rounded-b-lg shadow-md flex items-center space-x-3 md:space-x-4">
                                        {/* Image Preview Section */}
                                        {selectedImages.length > 0 && (
                                            <div className="flex gap-2 mb-2">
                                                {selectedImages.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <Image
                                                            src={URL.createObjectURL(image)}
                                                            alt="preview"
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                            width={48}
                                                            height={48}
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

                                    </div>
                                </main>
                                {/* Input Section */}
                                <div className="bg-gray-100 px-4 md:px-2 py-3 md:py-4 border-t border-gray-200 rounded-b-lg shadow-md flex items-center space-x-3 md:space-x-4 sticky bottom-0 w-full max-w-full">
                                    {/* Emoji Button */}
                                    <button className="text-xl text-gray-600 hover:text-gray-800 transition-all duration-300" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
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
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-white text-gray-800 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                                    />

                                    <button
                                        onClick={handleSendMessage}
                                        className="px-3 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300"
                                    >
                                        <IoSend size={20} />
                                        {/* <div className="flex items-center">
                                            <button
                                                onClick={handleImageSend}
                                                className="bg-green-600 text-white p-1 w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-green-700 transition-all duration-300"
                                            >
                                            </button>
                                        </div> */}
                                    </button>
                                </div>
                            </>
                            :
                            <div className="hidden md:flex items-center justify-center flex-1 text-yellow-600">
                                Select a Company to start chatting
                            </div>
                        }
                    </>
                }

            </div>
        </Suspense>
    );

};

export default ChatPage;
