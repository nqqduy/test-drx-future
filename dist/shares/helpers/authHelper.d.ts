export interface AuthMessage {
    timestamp: number;
    method: string | undefined;
    url: string | undefined;
    data: unknown;
    query: unknown;
}
export declare const serializeMessage: (message: AuthMessage) => string;
