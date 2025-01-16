"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { setUser } from "@/store/slices/UserSlice";
import { setCompany } from "@/store/slices/CompanySlice"
import { User, Company } from "@/utils/type";
import { AppStore, makeStore } from "@/store/store";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>(makeStore());

    useEffect(() => {
        const userJson = localStorage.getItem("auth");
        const companyJson = localStorage.getItem("companyAuth")

        if (userJson) {
            const user: User = JSON.parse(userJson);
            // console.log("UserJOSN : ", user);
            storeRef.current?.dispatch(setUser(user));
        }

        if (companyJson) {
            const company: Company = JSON.parse(companyJson);
            // console.log("CompanyJSON : ", company);
            storeRef.current?.dispatch(setCompany(company))
        }
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}