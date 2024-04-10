export interface DatabaseConfig {
    type: 'mysql';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    logging: boolean;
}
export declare const masterConfig: {
    name: string;
    entities: string[];
    autoLoadEntities: boolean;
    loading: boolean;
    type: 'mysql';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging: boolean;
};
export declare const reportConfig: {
    name: string;
    entities: string[];
    autoLoadEntities: boolean;
    loading: boolean;
    type: 'mysql';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging: boolean;
};
