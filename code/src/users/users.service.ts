import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { signUpDto } from 'src/auth/dto/sign-up.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
    ) {

    }
    async create(body: { email: string, password: string }): Promise<User> {
        const { email, password } = body;
        return this.repository.save({
            email: email,
            password: password,
        });
    }
    findOne(info: { email: string }): Promise<User> {
        return this.repository.findOne(info);
    }
}
