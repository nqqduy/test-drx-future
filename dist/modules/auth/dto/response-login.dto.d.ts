import { UserEntity } from 'src/models/entities/user.entity';
declare const ResponseLogin_base: import("@nestjs/common").Type<Partial<UserEntity>>;
export declare class ResponseLogin extends ResponseLogin_base {
    secret: string;
    accessToken: string;
    refreshToken: string;
}
export {};
