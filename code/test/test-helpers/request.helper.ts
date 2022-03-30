import {INestApplication} from '@nestjs/common';
import {Permission} from 'src/users/permission.entity';
import {User} from 'src/users/user.entity';
import * as req from 'supertest';
import {UserFactory} from 'test/factories.helper';
import {getManager} from 'typeorm';
import {commands, queries} from './query.helper';
import * as bcrypt from 'bcrypt';
import {access} from 'fs';
import {permissionSeeder} from "../../src/users/permission.seed";
import supertest from "supertest";

class UserCreator {
    async create(config: { user?: User, permissions?: string[] }) {
        await permissionSeeder.seed();
        let permissions = await queries.find(Permission);

        let user;
        if (config?.user) {
            user = await queries.findOne(User, config.user.id, {relations: ['permissions']});
        } else {
            user = await UserFactory.get().create();
        }
        const unHashedPassword = user.password;
        const saltOrRound = 10;
        const hashedPassword = await bcrypt.hash(unHashedPassword, saltOrRound);
        const userWithHashedPassword = {
            ...user,
            password: hashedPassword,
        }
        user = await commands.save(User, userWithHashedPassword);

        if ((config?.permissions || []).length > 0) {
            const filteredPermission = permissions.filter(perm => config?.permissions.includes(perm.title));
            user.permissions = filteredPermission;
            await commands.save(User, user);
        }
        return {
            ...user,
            unHashedPassword,
        };
    }
}

class Authenticator {
    async login(app: INestApplication, user: User & { unHashedPassword: string }) {
        try {
            const response = await req(app.getHttpServer())
                .post('/auth/login')
                .send({email: user.email, password: user.unHashedPassword});
            return response.body.access_token;
        } catch (e) {
            console.log('getAccessToken - error:', e);
            throw e;
        }
    }
}

class GeneralRequest {
    protected user: any;
    protected promiseAccessToken: Promise<string>;
    constructor(private userCreator: UserCreator, private authenticator: Authenticator) {

    }
    protected async getAccessToken(app, config?: { user?: User, permissions?: string[] }) {
        this.user = await this.userCreator.create(config);
        return await this.authenticator.login(app, this.user);
    }

    protected clearPromiseAccessToken() {
        this.promiseAccessToken = null;
    }

    protected async setBearerToken(request: supertest.Test) {
        if (this.promiseAccessToken) {//authenticate
            const accessToken = await this.promiseAccessToken;
            request.set({Authorization: `Bearer ${accessToken}`});
        }
    }

    public authenticate(app, config?: { user?: User, permissions?: string[] }) {
        this.promiseAccessToken = this.getAccessToken(app, config);
        return this;
    }
}
class Request extends GeneralRequest{

    async post(app: INestApplication, url: string, data: any) {
        let request = req(app.getHttpServer()).post(url).send(data);
        await this.setBearerToken(request);
        this.clearPromiseAccessToken();
        return request;
    }

    async get(app: INestApplication, url) {
        let request = req(app.getHttpServer()).get(url);
        await this.setBearerToken(request);
        this.clearPromiseAccessToken();
        return request;
    }


    async patch(app: INestApplication, url: string, data: any) {
        let request = req(app.getHttpServer())
            .patch(url)
            .send(data);
        await this.setBearerToken(request);
        this.clearPromiseAccessToken();
        return request;
    }

    async delete(app: INestApplication, url: string) {
        let request = req(app.getHttpServer()).delete(url);
        await this.setBearerToken(request);
        this.clearPromiseAccessToken();
        return request;
    }
}

class FormRequest extends GeneralRequest{
    private setData(request: supertest.Test, fields: Record<string, any> | undefined, files: Record<string, any | any[]> | undefined) {
        if (fields) {
            for (const key in fields) {
                request.field(key, fields[key]);
            }
        }

        if (files) {
            for (const key in files) {
                if (Array.isArray(files[key])) {
                    for (const fileItem of files[key]) {
                        request.attach(key, fileItem);
                    }
                } else {
                    request.attach(key, files[key]);
                }
            }
        }

        return request;
    }

    async post(app: INestApplication, url: string, data?: { fields?: Record<string, any>, files?: Record<string, any | any[]> }) {
        let request = req(app.getHttpServer()).post(url);
        await this.setBearerToken(request);
        const response = this.setData(request, data?.fields, data?.files);
        this.clearPromiseAccessToken();
        return response;
    }


    async patch(app: INestApplication, url: string, data?: { fields?: Record<string, any>, files?: Record<string, any | any[]> }) {
        let request = req(app.getHttpServer()).patch(url);
        await this.setBearerToken(request);
        const response = this.setData(request, data?.fields, data?.files);
        this.clearPromiseAccessToken();
        return response;
    }


}

export const request = new Request(new UserCreator(), new Authenticator());
export const formRequest = new FormRequest(new UserCreator(), new Authenticator());