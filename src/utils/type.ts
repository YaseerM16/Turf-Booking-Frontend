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

export type Company = {
    _id: string;
    companyname: string;
    companyemail: string;
    phone: string;
    profilePicture?: string;
    isActive: boolean;
    isVerified: boolean;
    isApproved: boolean;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    location: {
        latitude: number;
        longitude: number;
    };
};

export type CompanyData = {
    company?: Company | null
}


export type AuthData = {
    user?: User | null;
};