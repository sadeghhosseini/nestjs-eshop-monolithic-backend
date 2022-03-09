import {INestApplication} from '@nestjs/common';
import {CategoryFactory, ProductFactory, PropertyFactory} from 'test/factories.helper';
import {setupTestModule} from 'test/helpers';
import * as request from 'supertest';
import {getManager, getRepository} from "typeorm";
import {Category} from "../../src/categories/category.entity";
import {Product} from "../../src/products/product.entity";
import {Property} from 'src/properties/property.entity';


describe(`POST /products`, () => {
    let app: INestApplication;
    beforeAll(() => {
        console.time('before-after-all');
    });
    afterAll(() => {
        console.time('before-after-all');
    });
    beforeEach(async () => {
        console.time('beforeEach');
        app = await setupTestModule();
        console.time('beforeEach');
    });

    afterEach(async () => {
        await app.close();
    });

    it('returns 200 - creates a product with no images and properties', async () => {
        const product = await ProductFactory.get().make();
        const response = await request(app.getHttpServer())
            .post('/products')
            .send(product);
        expect(response.status).toEqual(201);
        const entityManger = getManager();
        const savedProduct = await entityManger.findOne(Product, product.id);
        expect(savedProduct).toBeDefined();
    });

    it('returns 200 - creates a product with new properties and not images', async () => {
        const product = await ProductFactory.get().make();
        const propertyTitles = (await PropertyFactory.get().count(5).make()).map(property => property.title);
        const response = await request(app.getHttpServer())
            .post('/products')
            .send({
                ...product,
                new_properties: propertyTitles,
            });
        expect(response.status).toEqual(201);
        const entityManager = getManager();
        const savedProduct = await entityManager.findOne(Product, product.id, {relations: ['images', 'properties']});
        expect(savedProduct).toBeDefined();
        console.log(propertyTitles, savedProduct.properties.map(value => value.title));
        expect(
            propertyTitles
        ).toMatchObject(
            savedProduct.properties.map(value => value.title)
        );
    });

    it('returns 200 - creates a product and add properties to it and not images', async () => {
        const properties = await PropertyFactory.get().count(5).create();
        const propertyIds = properties.map(property => property.id);
        const product = await ProductFactory.get().make();
        const response = await request(app.getHttpServer())
            .post('/products')
            .send({
                ...product,
                property_ids: propertyIds,
            });
        expect(response.status).toEqual(201);
        const em = getManager();
        const savedProduct = await em.findOne(Product, product.id, {relations: ['properties']});
        expect(savedProduct).toBeDefined();
        expect(
            propertyIds
        ).toMatchObject(
            savedProduct.properties.map(value => value.id)
        );
    });


});
