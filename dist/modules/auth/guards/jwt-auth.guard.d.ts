import { ExecutionContext } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RedisService } from 'nestjs-redis';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private connection;
    private readonly redisService;
    private accessTokenRepository;
    constructor(connection: Connection, redisService: RedisService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    checkPermissionRead(permission: string, request: any): void;
    handleEncrypt(data: any, signature: any): void;
    encryptSHA256(input: any): any;
    decodeAPIKEY(apiKey: string): string;
}
export {};
