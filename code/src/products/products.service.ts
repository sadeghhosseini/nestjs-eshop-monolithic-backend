import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { getConnection, getManager, Repository } from "typeorm";
import { Property } from "../properties/property.entity";
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/categories/category.entity';
import { Image } from 'src/images/image.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
        private configService: ConfigService,
    ) {
    }

    /**
     * TODO add upload image capability
     * @param data 
     */
    async create(data: InputCreateType) {
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
                const newProperties = newPropertyTitles.map((title) => ({
                    title: title,
                    isVisible: true,
                    category: {
                        id: category_id
                    }
                }));
                const insertResult = await entityManager.insert(Property, newProperties);
                const ids: Array<{ id: number }> = insertResult.identifiers as Array<{ id: number }>;
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
                return entityManager.save(Image, imagesInfo);
            }

            return await entityManager.save(Product, {
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
    async update(product: Product, body: InputUpdateType) {
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
                const properties = await this.propertyRepository.save(body.new_properties.map(title => {
                    const property = new Property();
                    property.title = title;
                    property.is_visible = true;
                    return property;
                }))
                product.properties = [
                    ...product.properties,
                    ...properties,
                ]
            }

            return await this.productRepository.save(product);
        } else {
            throw new BadRequestException();
        }
    }

    async delete(product: Product) {
        return await this.productRepository.delete(product.id);
    }

}


interface InputCreateType {
    title: string;
    description: string;
    quantity: number;
    price: number;
    category_id: number;
    new_properties?: string[];
    property_ids?: number[];
    new_images?: Array<Express.Multer.File>;
}
interface InputUpdateType {
    title?: string;
    description?: string;
    quantity?: number;
    price?: number;
    category_id?: number;
    new_properties?: string[];
    property_ids?: number[];
}