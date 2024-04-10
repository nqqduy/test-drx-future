import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/modules/user/users.service';
export declare class PrivateGuard implements CanActivate {
    private userService;
    constructor(userService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
