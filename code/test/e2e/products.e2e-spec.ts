import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getManager } from "typeorm";
import { Product } from "../../src/products/product.entity";
import { expect } from 'chai';
import { setupTestModule } from '../helpers';
import { ProductFactory, PropertyFactory } from '../factories.helper';


describe(`POST /products`, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });

    afterEach(async () => {
        await app.close();
    });

    it('returns 200 - creates a product with no images and properties', async () => {
        const product = await ProductFactory.get().make();
        const response = await request(app.getHttpServer())
            .post('/products')
            .send(product);
        expect(response.status).to.equal(201);
        const entityManger = getManager();
        const savedProduct = await entityManger.findOne(Product, product.id);
        expect(savedProduct).to.exist;
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
        expect(response.status).to.equal(201);
        const entityManager = getManager();
        const savedProduct = await entityManager.findOne(Product, product.id, { relations: ['images', 'properties'] });
        expect(savedProduct).to.exist;
        console.log(propertyTitles, savedProduct.properties.map(value => value.title));
        /* expect(
            propertyTitles
        ).toMatchObject(
            savedProduct.properties.map(value => value.title)
        ); */
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
        expect(response.status).to.equal(201);
        const em = getManager();
        const savedProduct = await em.findOne(Product, product.id, { relations: ['properties'] });
        expect(savedProduct).to.exist;
        /* expect(
            propertyIds
        ).toMatchObject(
            savedProduct.properties.map(value => value.id)
        ); */
    });


});
