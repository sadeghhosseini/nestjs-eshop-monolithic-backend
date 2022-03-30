import {INestApplication} from '@nestjs/common';
import {CategoryFactory, ProductFactory, PropertyFactory} from 'test/factories.helper';
import {except,} from 'test/test-helpers/collection.helper';
import {setupTestModule} from 'test/test-helpers/setup-test-module.helper';
import {getManager} from "typeorm";
import {Product} from "../../src/eshop/products/product.entity";
import {assertIsEqualObject} from 'test/test-helpers/assertion.helper';
import * as path from 'path';
import {FakeStorage} from 'test/memory-storage-engine';
import {promises} from 'fs';
import {getAssociativeRecords} from 'test/test-helpers/associative-table-query.helper';
import {Property} from 'src/eshop/properties/property.entity';
import {formRequest, request} from "../test-helpers/request.helper";

describe(`POST /products`, () => {
    let app: INestApplication;
    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });

    it('returns 201 - creates a product with no images and properties', async () => {
        const product = await ProductFactory.get().make();
        /*const response = await request(app.getHttpServer())
            .post('/products')
            .send({
                title: product.title,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                category_id: product.category.id,
            });*/
        const response = await request.authenticate(app, {permissions: ['add-product']})
            .post(app, '/products', {
                title: product.title,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                category_id: product.category.id,
            });
        expect(response.status).toEqual(201);
        const entityManger = getManager();
        const savedProduct = await entityManger.findOne(Product, product.id, {relations: ['category']});
        expect(savedProduct).toBeDefined();
        assertIsEqualObject(
            savedProduct,
            product,
            ['title', 'quantity', 'price', 'description'],
            {category_id: (actual, expected) => [actual.category.id, expected.category.id]}
        );
    });
    it('returns 201 - creates a product with new properties and no images', async () => {
        const product = await ProductFactory.get().make();
        const propertyTitles = (await PropertyFactory.get().count(5).make()).map(property => property.title);
        /*const response = await request(app.getHttpServer())
            .post('/products')
            .send({
                title: product.title,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                category_id: product.category.id,
                new_properties: propertyTitles,
            });*/
        const response = await request.authenticate(app, {permissions: ['add-product']})
            .post(app, '/products', {
                title: product.title,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                category_id: product.category.id,
                new_properties: propertyTitles,
            });
        expect(response.status).toEqual(201);
        const entityManager = getManager();
        const savedProduct = await entityManager.findOne(Product, product.id, {relations: ['images', 'properties', 'category']});
        expect(savedProduct).toBeDefined();
        expect(
            propertyTitles
        ).toMatchObject(
            savedProduct.properties.map(value => value.title)
        );

        assertIsEqualObject(savedProduct, product, [
            'title',
            'quantity',
            'price',
            'description',
        ], {category_id: (savedProduct, product) => [savedProduct.category.id, product.category.id]})
    });
    it('returns 201 - creates a product and add properties to it and not images', async () => {
        const properties = await PropertyFactory.get().count(5).create();
        const propertyIds = properties.map(property => property.id);
        const product = await ProductFactory.get().make();
        /*const response = await request(app.getHttpServer())
            .post('/products')
            .send({
                title: product.title,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                category_id: product.category.id,
                property_ids: propertyIds,
            });*/
        const response = await request.authenticate(app, {permissions: ['add-product']})
            .post(app, '/products', {
                title: product.title,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                category_id: product.category.id,
                property_ids: propertyIds,
            });
        expect(response.status).toEqual(201);
        const em = getManager();
        const savedProduct = await em.findOne(Product, product.id, {relations: ['properties', 'category']});
        expect(savedProduct).toBeDefined();
        expect(
            propertyIds
        ).toMatchObject(
            savedProduct.properties.map(value => value.id)
        );

        assertIsEqualObject(
            savedProduct,
            product,
            ['title', 'quantity', 'price', 'description'],
            {category_id: (actual, expected) => [actual.category.id, expected.category.id]}
        );
    });
    it('returns 201 - creates a product with image', async () => {
        const product = await ProductFactory.get().make();
        /*const response = await request(app.getHttpServer())
            .post(`/products`)
            .attach('new_images', path.join(__dirname) + '/resources/test.jpg')
            .attach('new_images', path.join(__dirname) + '/resources/test.png')
            .field('title', product.title)
            .field('description', product.description)
            .field('quantity', product.quantity)
            .field('price', product.price)
            .field('category_id', product.category.id);*/
        const response = await formRequest.authenticate(app, {permissions: ['add-product']})
            .post(app, '/products', {
                fields: {
                    title: product.title,
                    description: product.description,
                    quantity: product.quantity,
                    price: product.price,
                    category_id: product.category.id,
                },
                files: {
                    new_images: [
                        path.join(__dirname) + '/resources/test.jpg',
                        path.join(__dirname) + '/resources/test.png',
                    ]
                }
            })
        expect(response.status).toEqual(201);
        FakeStorage.assertExists('test.jpg');
        FakeStorage.assertExists('test.png');
        FakeStorage.assertExists(await promises.readFile(path.join(__dirname) + '/resources/test.jpg'))
    });
});

describe(`PATCH /products`, () => {
    let app: INestApplication;
    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });

    it('returns 200 - updates a products non relational data', async () => {
        const product = await ProductFactory.get().create();
        const updatedProduct = except(await ProductFactory.get().make(), ['category_id']);
        /*const response = await request(app.getHttpServer())
            .patch(`/products/${product.id}`)
            .send({
                title: updatedProduct.title,
                description: updatedProduct.description,
                quantity: updatedProduct.quantity,
                price: updatedProduct.price,
            });*/

        const response = await request.authenticate(app, {permissions: ['edit-product-any']})
            .patch(app, `/products/${product.id}`, {
                title: updatedProduct.title,
                description: updatedProduct.description,
                quantity: updatedProduct.quantity,
                price: updatedProduct.price,
            });
        expect(response.status).toEqual(200);
        const em = getManager();
        const savedProduct = await em.findOne(Product, product.id);
        assertIsEqualObject(savedProduct, updatedProduct, ['title', 'quantity', 'price', 'description'])
    });
    it('returns 200 - updates category_id of a product', async () => {
        const product = await ProductFactory.get().create();
        const category = await CategoryFactory.get().create();
        /*const response = await request(app.getHttpServer())
            .patch(`/products/${product.id}`)
            .send({
                category_id: category.id,
            });*/
        const response = await request.authenticate(app, {permissions: ['edit-product-any']})
            .patch(app, `/products/${product.id}`, {
                category_id: category.id,
            });
        expect(response.status).toEqual(200);
        const em = getManager();
        const savedProduct = await em.findOne(Product, product.id, {relations: ['category']});
        assertIsEqualObject(savedProduct, product, ['title', 'quantity', 'price', 'description']);
        expect(savedProduct.category.id).toEqual(category.id);
    });

    it('returns 200 - updates product with new property_ids', async () => {
        const properties = await PropertyFactory.get().count(10).create();
        const product = await ProductFactory.get().create();
        const em = getManager();
        await em.save(Product, {
            id: product.id,
            properties: properties,
        });
        const newPropertyIds = (await PropertyFactory.get().count(3).create()).map(property => property.id);
        let property_ids = [
            properties[0].id,
            properties[1].id,
            properties[2].id,
            ...newPropertyIds,
        ];

        /*const response = await request(app.getHttpServer())
            .patch(`/products/${product.id}`)
            .send({
                property_ids,
            });*/

        const response = await request.authenticate(app, {permissions: ['edit-product-any']})
            .patch(app, `/products/${product.id}`, {
                property_ids,
            });
        expect(response.status).toEqual(200);

        const foundProduct = await getManager().findOne(Product, product.id, {relations: ['properties']});
        expect(foundProduct.properties.length).toEqual(property_ids.length);
        expect(foundProduct.properties.map(property => property.id)).toEqual(property_ids);
    });

    it('returns 200 - updates product with new property titles', async () => {
        const product = await ProductFactory.get().create();
        const properties = await PropertyFactory.get().count(10).create();
        const propertyTitles = (await PropertyFactory.get().count(5).make()).map(property => property.title);
        await getManager().save(Product, {
            id: product.id,
            properties: properties,
        });
        /*const response = await request(app.getHttpServer())
            .patch(`/products/${product.id}`)
            .send({
                new_properties: propertyTitles,
            });*/
        const response = await request.authenticate(app, {permissions: ['edit-product-any']})
            .patch(app, `/products/${product.id}`, {
                new_properties: propertyTitles,
            });
        const foundProduct = await getManager().findOne(Product, product.id, {relations: ['properties']});
        expect(response.status).toEqual(200);
        expect(foundProduct.properties.length).toEqual(properties.length + propertyTitles.length);
        expect(foundProduct.properties.map(property => property.title)).toEqual([
            ...properties.map(property => property.title),
            ...propertyTitles,
        ]);
    });
});

describe(`DELETE /products/:id`, () => {
    let app: INestApplication;
    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });
    it("return 200 - deletes a product", async () => {
        const product = await ProductFactory.get().create();
        /*const response = await request(app.getHttpServer())
            .delete(`/products/${product.id}`);*/
        const response = await request.authenticate(app, {permissions: ['delete-product-any']})
            .delete(app, `/products/${product.id}`);
        expect(response.status).toEqual(200);
    });
    it("return 200 - deletes a product and all it's association with properties", async () => {
        const properties = await PropertyFactory.get().count(5).create();
        // const product: Product = await ProductFactory.get({ properties }).create();
        const product: Product = await ProductFactory.get().create({properties});
        /*const response = await request(app.getHttpServer())
            .delete(`/products/${product.id}`);*/
        const response = await request.authenticate(app, {permissions: ['delete-product-any']})
            .delete(app, `/products/${product.id}`);
        expect(response.status).toEqual(200);
        const foundProduct = await getManager().findOne(Product, product.id, {relations: ['properties']});
        expect(foundProduct).toBeUndefined();
        const productsPropertiesRelationTableRecords = await getAssociativeRecords(Product, Property, {
            EntityClassRelatedToForeignKey: Property,
            foreignKey: 6,
        });
        expect(productsPropertiesRelationTableRecords?.length).toBe(0);
    });
    it('returns 400 - providing non-existing product.id', async () => {
        /*const response = await request(app.getHttpServer())
            .delete(`/products/2`);*/
        const response = await request.authenticate(app, {permissions: ['delete-product-any']})
            .delete(app, `/products/2`);
        expect(response.status).toBe(400);
    });
});
