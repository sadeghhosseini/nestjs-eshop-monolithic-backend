import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import * as path from 'path';
import { expect } from 'chai';
import { setupTestModule } from '../helpers';

describe(`POST /images`, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });

    afterEach(async() => {
        await app.close();
    })

    describe(`validation test`, () => {
        it(`returns 400 file.wrongFileFormat`, async () => {
            const response = await request(app.getHttpServer())
                .post('/images')
                .attach('images[0][file]', path.join(__dirname) + '/resources/test.txt')
                .field('images[0][path]', 'images');

            expect(response.status).to.equal(400);
            expect(response.body.errorCodes).to.contain('file.wrongFileFormat');
            expect(response.body.errorCodes).to.have.length(1);
        });
        it('returns 400 file.notDefined', async () => {
            const response = await request(app.getHttpServer())
                .post('/images')
                .field('images[0][path]', 'images');
            expect(response.status).to.equal(400);
            expect(response.body.errorCodes).to.contain('file.notDefined');
        });
        it('returns 400 file.notFile', async () => {
            const response = await request(app.getHttpServer())
                .post('/images')
                .field('file', 'some text')
                .field('images[0][path]', 'images');
            expect(response.status).to.equal(400);
            expect(response.body.errorCodes).to.contain('file.notDefined');
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

            expect(response.status).to.equal(201);
        });
    });
});
