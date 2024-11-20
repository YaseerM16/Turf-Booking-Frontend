import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./features/userSlice";
// import chatReducer from "./features/chatSlice";
// import adminReducer from "./features/adminSlice";
// import notificationReducer from "./features/notificationSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
        },
    });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];