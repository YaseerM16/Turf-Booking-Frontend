"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { setUser } from "@/store/slices/UserSlice";
import { User } from "@/utils/type";
import { AppStore, makeStore } from "@/store/store";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>(makeStore());

    useEffect(() => {
        const userJson = localStorage.getItem("auth");
        if (userJson) {
            const user: User = JSON.parse(userJson);
            storeRef.current?.dispatch(setUser(user));
        }
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}