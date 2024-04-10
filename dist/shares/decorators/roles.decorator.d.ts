import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class OnlyAdmin implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare class OnlySuperAdmin implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare class AdminAndSuperAdmin implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
