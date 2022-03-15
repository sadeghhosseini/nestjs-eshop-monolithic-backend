import {INestApplication} from '@nestjs/common';
import {ImageFactory} from 'test/factories.helper';
import {setupTestModule} from 'test/helpers';
import * as request from 'supertest';
import {promises} from 'fs';
import * as path from 'path';

describe(`POST /images`, () => {
    let app: INestApplication;
    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });

    describe(`validation test`, () => {
        it(`returns 400 file.wrongFileFormat`, async () => {
            const response = await request(app.getHttpServer())
                .post('/images')
                .attach('images[0][file]', path.join(__dirname) + '/resources/test.txt')
                .field('images[0][path]', 'images');

            expect(response.status).toEqual(400);
            expect(response.body.errorCodes).toContain('file.wrongFileFormat');
            expect(response.body.errorCodes).toHaveLength(1);
        });
        it('returns 400 file.notDefined', async () => {
            const response = await request(app.getHttpServer())
                .post('/images')
                .field('images[0][path]', 'images');
            expect(response.status).toEqual(400);
            expect(response.body.errorCodes).toContain('file.notDefined');
        });
        it('returns 400 file.notFile', async () => {
            const response = await request(app.getHttpServer())
                .post('/images')
                .field('file', 'some text')
                .field('images[0][path]', 'images');
            expect(response.status).toEqual(400);
            expect(response.body.errorCodes).toContain('file.notDefined');
        });
    });

    describe(`success`, () => {
        it('returns 200 for', async () => {
            const response = await request(app.getHttpServer())
                .post('/images')
                .attach('images[0][file]', path.join(__dirname) + '/resources/test.png')
                .field('images[0][path]', 'images')
                .attach('images[1][file]', path.join(__dirname) + '/resources/test.jpg')
                .field('images[1][path]', 'images');

            expect(response.status).toEqual(201);
        });
    });
});
