export type ReactSetState = React.Dispatch<React.SetStateAction<string>>;

export type User = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    token: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
};

export type AuthData = {
    user?: User | null;
};