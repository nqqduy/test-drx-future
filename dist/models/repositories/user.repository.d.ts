import { UserEntity } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserRepository extends Repository<UserEntity> {
    findUserByAccountId(accountId: number): Promise<UserEntity>;
}
