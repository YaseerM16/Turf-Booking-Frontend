export type ReactSetState = React.Dispatch<React.SetStateAction<string>>;

// https://nominatim.openstreetmap.org/reverse?lat=17.406498&lon=78.4772439&format=json
export interface APIError {
    response?: {
        data?: {
            error?: string;
        };
    };
}
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
    generatedSlots: {
        fromDate: string,
        toDate: string
    };
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
        toTime: string;
        fromTime: string;
        workingDays: [
            {
                day: string;  // Day of the week (e.g., "Tuesday")
                fromTime: string;  // Time in HH:mm format
                toTime: string;  // Time in HH:mm format
                price: number;  // Price for the time slot
                _id: string;  // Unique identifier for the slot
            }
        ];
    }

    __v: number;
    _id: string;
};

export type SlotDetails = {
    refundDate: string | number | Date;
    refundTransactionId: string;
    isCancelled: boolean;
    slotId(slotId: string): void;
    isUnavail: boolean;
    turfId: string,
    userId?: User,
    day: string,
    date: Date,
    slot: string,
    isBooked: boolean,
    _id: string,
    price?: number
}

export type SlotData = {
    slot?: SlotDetails | null
}

export type TurfData = {
    turf?: TurfDetails | null
}

export type CompanyData = {
    company?: Company | null
}


export type AuthData = {
    user?: User | null;
};

export type Wallet = {
    userId: string;
    walletBalance: number;
    walletTransaction: WalletTransaction[];
    __v: number;
    _id: string;
};

export type WalletTransaction = {
    transactionAmount: number;
    transactionMethod: string;
    transactionType: string;
    transactionDate: string | number | Date;
    // Define fields for WalletTransaction if known, otherwise leave it as an empty object type.
    // Example:
    date: string;
    type: string;
    method: string;
    balance: number;
};

export type ChatRoom = {
    companyId: {
        companyname: string;
        companyemail: string;
        phone: number | string;
        profilePicture: string;
        _id: string;
    };
    createdAt: string; // ISO date string
    isReadCc: number;
    isReadUc: number;
    lastMessage: string | null;
    updatedAt: string; // ISO date string
    userId: {
        email: string;
        name: string;
        phone: number;
        profilePicture: string;
        _id: string;
    };
    __v: number;
    _id: string;
};


export type Message = {
    content: string;
    createdAt: string;
    isRead: boolean;
    receiverId: string;
    roomId: string;
    senderId: string;
    updatedAt: string;
    __v: number;
    _id: string;
};


type NotificationUser = {
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
};

type NotificationRoom = {
    roomId: string;
    companyName: string;
    unreadCount: number;
    lastMessage: string | null;
    updatedAt: string;
    user: NotificationUser;
};

export type Notifications = Record<string, NotificationRoom>;
