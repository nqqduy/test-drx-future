import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/modules/user/users.service';
import { httpErrors } from 'src/shares/exceptions';
import { UserIsLocked, UserStatus } from 'src/shares/enums/user.enum';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { UserEntity } from 'src/models/entities/user.entity';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(config.get('jwt_key.public').toString(), 'base64').toString('ascii'),
      algorithms: ['RS256'],
    });
  }
  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userService.findUserById(+payload.sub);
    if (!user) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    if (user.isLocked == UserIsLocked.LOCKED) {
      throw new HttpException(httpErrors.LOCKED_USER, HttpStatus.FORBIDDEN);
    }
    if (user.status === UserStatus.DEACTIVE) {
      await this.userService.updateStatusUser(user.id, UserStatus.ACTIVE);
    }

    return user;
  }
}
