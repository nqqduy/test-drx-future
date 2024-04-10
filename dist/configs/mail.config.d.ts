interface IEmailConfig {
    auth: {
        user: string;
        pass: string;
    };
    from: {
        address: string;
        name: string;
    };
    service: string;
    enable: boolean;
    port: string;
    host: string;
}
export declare const mailConfig: IEmailConfig;
export {};
