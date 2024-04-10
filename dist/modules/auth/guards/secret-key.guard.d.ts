import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class JwtSecretGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
