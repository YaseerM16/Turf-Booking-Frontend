export type ReactSetState = React.Dispatch<React.SetStateAction<string>>;

// https://nominatim.openstreetmap.org/reverse?lat=17.406498&lon=78.4772439&format=json

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
    isBlocked: boolean;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    location: {
        latitude: number;
        longitude: number;
    };
};

export type TurfDetails = {
    companyId: string;
    createdAt: string;
    description: string;
    facilities: string[]; // Array of strings
    supportedGames: string[]; // Array of strings
    images: string[]; // Array of URLs (strings)
    isActive: boolean;
    isBlocked: boolean;
    isDelete: boolean;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    };
    price: number;
    turfName: string;
    turfSize: string;
    turfType: string;
    updatedAt: string;
    workingSlots: {
        fromTime: string; // Time in HH:mm format
        toTime: string; // Time in HH:mm format
        workingDays: string[]; // Array of working days
    };
    __v: number;
    _id: string;
};

export type TurfData = {
    turf?: TurfDetails | null
}

export type CompanyData = {
    company?: Company | null
}


export type AuthData = {
    user?: User | null;
};