import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UserRepository} from "../users/users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
    constructor(configService: ConfigService, private usersRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate(payload: any) {
        const user = await this.usersRepository.findOne(payload.userId, {relations: ['permissions']});

        return {
            id: payload.userId,
            email: payload.email,
            permissions: user.permissions,
        }
    }
}