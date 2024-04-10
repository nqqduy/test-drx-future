import { ExecutionContext } from '@nestjs/common';
import { Connection } from 'typeorm';
declare const JwtAdminGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAdminGuard extends JwtAdminGuard_base {
    private connection;
    private accessTokenRepository;
    constructor(connection: Connection);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
