import { Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/users.service';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { UserEntity } from 'src/models/entities/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<UserEntity>;
}
export {};
