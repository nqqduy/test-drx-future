import { AxiosInstance } from 'axios';
export declare class HttpClient {
    readonly client: AxiosInstance;
    constructor();
    private _initializeResponseInterceptor;
    private _handleResponse;
    private _handleError;
}
