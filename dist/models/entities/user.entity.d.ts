export declare const ADMIN_ID = 1475;
export declare class UserEntity {
    id: number;
    email: string;
    position: string;
    role: string;
    status: string;
    isLocked: string;
    userType: string;
    antiPhishingCode?: string;
    location: string;
    notification_token: string;
    createdAt: Date;
    updatedAt: Date;
}
