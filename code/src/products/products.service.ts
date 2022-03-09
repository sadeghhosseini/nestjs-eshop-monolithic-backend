import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./product.entity";
import {getConnection, Repository} from "typeorm";
import {Property} from "../properties/property.entity";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {
    }

    async create(data: InputCreateType) {
        const {
            title,
            description,
            quantity,
            price,
            category_id,
            new_properties: newPropertyTitles,
            property_ids: propertyIds,
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
                        ...propertyIds.map(id => ({id}))
                    ]
                }
            }

            await entityManager.save(Product, {
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
}


interface InputCreateType {
    title: string;
    description: string;
    quantity: number;
    price: number;
    category_id: number;
    new_properties?: string[];
    property_ids?: number[],
}