// "use client";

// import { useEffect, useRef } from "react";
// import { Provider } from "react-redux";
// import { setUser } from "@/store/slices/UserSlice";
// import { User } from "@/utils/type";
// import { AppStore, makeStore } from "@/store/store";
// import { SessionProvider } from "next-auth/react";

// type NextAuthProviderProps = {
//     children: React.ReactNode;
// };

// export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
//     // Use a ref to ensure the store is created only once
//     const storeRef = useRef<AppStore>(makeStore());

//     useEffect(() => {
//         const userJson = localStorage.getItem("auth");
//         if (userJson) {
//             const user: User = JSON.parse(userJson);
//             storeRef.current?.dispatch(setUser(user));
//         }
//     }, []);

//     return (
//         <SessionProvider>
//             <Provider store={storeRef.current}>{children}</Provider>
//         </SessionProvider>
//     );
// };
