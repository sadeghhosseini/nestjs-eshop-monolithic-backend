import { INestApplication } from '@nestjs/common';
import * as req from 'supertest';


class Request {
    post(app: INestApplication, url: string, data: any) {
        return req(app.getHttpServer()).
            post(url)
            .send(data);
    }

    get(app: INestApplication, url) {
        return req(app.getHttpServer())
            .get(url);
    }

    patch(app: INestApplication, url: string, data: any) {
        return req(app.getHttpServer())
            .patch(url)
            .send(data);
    }

    delete(app: INestApplication, url: string) {
        return req(app.getHttpServer())
            .delete(url);
    }
}

export const request = new Request();