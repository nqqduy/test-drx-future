export declare class ResponseDto<T> {
    data: T;
    metadata?: {
        totalPage?: number;
        [key: string]: unknown;
    };
}
