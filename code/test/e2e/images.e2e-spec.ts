import { INestApplication } from '@nestjs/common';
import { ImageFactory } from 'test/factories.helper';
import { setupTestModule } from 'test/test-helpers/setup-test-module.helper';
import { promises } from 'fs';
import * as path from 'path';
import { FileFacade } from 'src/common/file-facade.utils';
import {formRequest, request} from "../test-helpers/request.helper";

describe(`POST /images`, () => {
    describe('without mock FileFacade', () => {
        let app: INestApplication;

        beforeEach(async () => {
            app = await setupTestModule();
        });
        afterEach(async () => {
            await app.close();
        });

        describe(`validation test`, () => {
            it(`returns 400 file.wrongFileFormat`, async () => {
                /*const response = await request(app.getHttpServer())
                    .post('/images')
                    .attach('images[0][file]', path.join(__dirname) + '/resources/test.txt')
                    .field('images[0][path]', 'images');*/
                const response = await formRequest.authenticate(app, {permissions: ['add-image']})
                    .post(app, '/images', {
                        files: {
                            'images[0][file]': path.join(__dirname) + '/resources/test.txt',
                        },
                        fields: {
                            'images[0][path]': 'images',
                        }
                    })
                expect(response.status).toEqual(400);
                expect(response.body.errorCodes).toContain('file.wrongFileFormat');
                expect(response.body.errorCodes).toHaveLength(1);
            });
            it('returns 400 file.notDefined', async () => {
                /*const response = await request(app.getHttpServer())
                    .post('/images')
                    .field('images[0][path]', 'images');*/
                const response = await formRequest.authenticate(app, {permissions: ['add-image']})
                    .post(app, '/images', {
                        fields: {
                            'images[0][path]': 'images',
                        }
                    })
                expect(response.status).toEqual(400);
                expect(response.body.errorCodes).toContain('file.notDefined');
            });
            it('returns 400 file.notFile', async () => {
                /*const response = await request(app.getHttpServer())
                    .post('/images')
                    .field('file', 'some text')
                    .field('images[0][path]', 'images');*/
                const response = await formRequest.authenticate(app, {permissions: ['add-image']})
                    .post(app, '/images', {
                        fields: {
                            file: 'some text',
                            'images[0][path]': 'images',
                        }
                    })
                expect(response.status).toEqual(400);
                expect(response.body.errorCodes).toContain('file.notDefined');
            });
        });
    });

    describe('with mock FileFacade', () => {
        describe(`success`, () => {
            let app: INestApplication;
            beforeEach(async () => {
                const fileFacade = new FileFacade();
                jest.spyOn(fileFacade, 'save').mockImplementation((path: string, file: Buffer) => {
                    return Promise.resolve();
                });
                app = await setupTestModule(null, {
                    providers: [
                        {
                            provide: FileFacade,
                            useValue: fileFacade,
                        }
                    ]
                });

            });
            afterEach(async () => {
                await app.close();

            });
            it('returns 200 for', async () => {
                /*const response = await request(app.getHttpServer())
                    .post('/images')
                    .attach('images[0][file]', path.join(__dirname) + '/resources/test.png')
                    .field('images[0][path]', 'images')
                    .attach('images[1][file]', path.join(__dirname) + '/resources/test.jpg')
                    .field('images[1][path]', 'images');
*/
                const response = await formRequest.authenticate(app, {permissions: ['add-image']})
                    .post(app, '/images', {
                        fields: {
                            'images[0][path]': 'images',
                            'images[1][path]': 'images',
                        },
                        files: {
                            'images[0][file]': path.join(__dirname) + '/resources/test.png',
                            'images[1][file]': path.join(__dirname) + '/resources/test.jpg',
                        }
                    })
                expect(response.status).toEqual(201);
            });
        });
    })
});

