import { ExecutionContext } from '@nestjs/common';
import { Connection } from 'typeorm';
declare const JwtTokenGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtTokenGuard extends JwtTokenGuard_base {
    private connection;
    private accessTokenRepository;
    constructor(connection: Connection);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
