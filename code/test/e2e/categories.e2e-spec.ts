import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {getRepository} from 'typeorm';
import { expect } from 'chai';
import { Category } from '../../src/categories/category.entity';
import { setupTestModule } from '../helpers';
import { CategoryFactory } from '../factories.helper';

describe(`POST /categories`, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    })

    describe(`success`, () => {
        it('returns 201 - creates a new category', async () => {
            const category = await CategoryFactory.get().make();
            const response = await request(app.getHttpServer())
                .post('/categories')
                .send(category);
            expect(response.status).to.equal(201);
            const categoryRepository = getRepository(Category);
            const allCategories = await categoryRepository.find();
            expect(allCategories).to.have.length(1);
            /* expect(allCategories[0]).to.containSubset({
                title: category.title,
                description: category.description,
            }); */
        });
    });
});

describe(`GET /categories`, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    })

    it('returns 200 - gets all the categories', async () => {
        const categories = await CategoryFactory.get().count(15).create();
        const response = await request(app.getHttpServer())
            .get('/categories')
            .send();
        expect(response.status).to.equal(200);

        const returnedCategories = response.body;
        expect(returnedCategories).to.have.length(categories.length);
        categories.forEach(category => {
            const foundCategory = returnedCategories.filter(rc => category.id == rc.id)?.[0];
            /* expect(category).to.containSubset(foundCategory); */
        });
    });
})

describe(`GET /categories/:id`, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    })

    it('returns 200 - gets category by id', async () => {
        const category = await CategoryFactory.get().create();
        const response = await request(app.getHttpServer())
            .get(`/categories/${category.id}`)
            .send();
        expect(response.status).to.equal(200);
        const returnedCategory = response.body;
        /* expect(category).to.containSubset(returnedCategory); */
    });
});

describe(`DELETE /categories/:id`, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });

    it('returns 200 - deletes a category', async () => {
        const category = await CategoryFactory.get().create();
        const response = await request(app.getHttpServer())
            .delete(`/categories/${category.id}`)
            .send();
        expect(response.status).to.equal(200);
        const repository = getRepository(Category);
        const foundCategory = await repository.find(category.id);
        expect(foundCategory).to.have.length(0);
    });
});

describe(`PATCH /categories/:id`, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });

    it('returns 200 - updates a category', async () => {
        await patchTest(
            app,
            CategoryFactory,
            Category,
            {title: 'updated-title'},
            200,
            record => `/categories/${record.id}`,
            record => record.id,
        );
        /*const updatedTitle = 'updated-title';
        const category = await CategoryFactory.get().create();
        const response = await request(app.getHttpServer())
            .patch(`/categories/${category.id}`)
            .send({title: updatedTitle});
        expect(response.status).to.equal(200);
        const repository = getRepository(Category);
        const foundCategory = (await repository.find(category.id))?.[0];
        expect(foundCategory.title).to.equal(updatedTitle);*/
    });
});

async function patchTest(
    app: INestApplication,
    FactoryClass,
    EntityClass: any,
    dataForUpdate: Record<string, string>,
    expectedStatus: number,
    getUrl: (record: any) => string,
    getPk: (record: any) => string
) {
    const record = await FactoryClass.get().create();
    const response = await request(app.getHttpServer())
        .patch(getUrl(record))
        .send(dataForUpdate);
    expect(response.status).to.equal(expectedStatus);
    const repository = getRepository(EntityClass);
    const foundRecord = await repository.findOne(getPk(record));

    for (const key in dataForUpdate) {
        expect(foundRecord[key]).to.equal(dataForUpdate[key]);
    }
}