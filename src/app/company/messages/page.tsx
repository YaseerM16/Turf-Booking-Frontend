"use client";
import CompanyChatPage from "@/components/company/chat/ChatPage";
import { Suspense, useEffect, useState } from "react";

export default function Register() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient ? (
        <div className="flex flex-col h-screen overflow-hidden">
            <Suspense fallback={<div>Loading...</div>}>
                <CompanyChatPage />
            </Suspense>
        </div>
    ) : null;
}