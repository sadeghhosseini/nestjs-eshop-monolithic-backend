import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { getConnection, Repository } from "typeorm";
import { Property } from "../properties/property.entity";
import { Image } from 'src/eshop/images/image.entity';
import { ConfigService } from '@nestjs/config';
import { ProductProvider } from './ports/product.provider';
import { ProductUseCase, ProductUseCaseTypes } from './ports/product.usecase';
import { PropertyProvider } from '../properties/prots/property.provider';
import { ImageProvider } from '../images/ports/image.provider';

@Injectable()
export class ProductsService implements ProductUseCase {
    constructor(
        private productProvider: ProductProvider,
        private propertyProvider: PropertyProvider,
        private imageProvider: ImageProvider,
        private configService: ConfigService,
    ) {
    }

    /**
     * TODO add upload image capability
     * @param data 
     */
    async create(data: ProductUseCaseTypes.CreateProduct) {
        const {
            title,
            description,
            quantity,
            price,
            category_id,
            new_properties: newPropertyTitles,
            property_ids: propertyIds,
            new_images: newImages,
        } = data;


        await getConnection().transaction(async entityManager => {
            let data: { properties?: Array<{ id: number }> } = {};
            if (newPropertyTitles?.length > 0) {
                const newProperties = newPropertyTitles.map(title => ({
                    title,
                    category_id,
                }));
                const properties = await this.propertyProvider.createRecords(newProperties);
                const ids = properties.map(p => ({ id: p.id }));
                data = {
                    ...data,
                    properties: ids,
                };
            }

            if (propertyIds?.length > 0) {
                data = {
                    ...data,
                    properties: [
                        ...data?.properties ?? [],
                        ...propertyIds.map(id => ({ id }))
                    ]
                }
            }

            if (newImages?.length > 0) {
                let imagesInfo = [];
                for (const image of newImages) {
                    imagesInfo = [
                        ...imagesInfo,
                        { path: this.configService.get<string>('UPLOAD_PATH') + image.originalname }
                    ];

                }
                return this.imageProvider.createRecords(imagesInfo);
            }

            return await this.productProvider.createRecord({
                title,
                description,
                quantity,
                price,
                category: {
                    id: category_id
                },
                ...data,
            });
        });
    }

    /**
     * TODO add upload image capability
     * @param productId 
     * @param body 
     * @returns 
     */
    async update(product: Product, body: ProductUseCaseTypes.UpdateProduct) {
        // const product = await this.productRepository.findOne(productId, { relations: ['category', 'properties'] });
        if (product) {
            product.title = body?.title ?? product?.title;
            product.description = body?.description ?? product?.description;
            product.quantity = body?.quantity ?? product?.quantity;
            product.price = body?.price ?? product?.price;
            product.category.id = body?.category_id ?? product?.category?.id;

            if (body.property_ids?.length > 0) {
                product.properties = body.property_ids.map(id => {
                    const property = new Property();
                    property.id = id;
                    return property;
                });
            }

            if (body.new_properties?.length > 0) {
                const properties = await this.propertyProvider.createRecords(body.new_properties.map(title => ({ title, category_id: product.category.id })));
                console.log(properties);
                product.properties = [
                    ...product.properties,
                    ...properties,
                ]
            }

            return await this.productProvider.updateRecord(product);
        } else {
            throw new BadRequestException();
        }
    }

    async delete(product: Product) {
        return await this.productProvider.deleteRecord(product);
    }

}