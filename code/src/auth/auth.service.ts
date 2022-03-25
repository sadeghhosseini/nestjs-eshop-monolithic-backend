import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { signUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {

    }

    async validateUser(email, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password === password) {
            const { password, ...rest } = user;
            return rest;
        }
        return null;
    }

    async login(info: any) {
        const { email, password } = info;
        const user = await this.usersService.findOne({ email });
        if (!(await bcrypt.compare(password, user?.password))) {
            throw new BadRequestException('Email or Password wrong');
        }
        const payload = { email: user.email, userId: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        }

    }

    async register(body: signUpDto) {
        const saltOrRound = 10;
        const hashedPassowrd = await bcrypt.hash(body.password, saltOrRound);
        const user = await this.usersService.create({
            email: body.email,
            password: hashedPassowrd,
        });
        const payload = { email: user.email, userId: user.id };
        console.log(payload);
        console.log(user);
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
