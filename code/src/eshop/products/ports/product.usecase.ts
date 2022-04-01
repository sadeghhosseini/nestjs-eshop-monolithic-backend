import { Product } from "../product.entity";

export abstract class ProductUseCase {
    abstract create(data: ProductUseCaseTypes.CreateProduct);
    abstract update(product: Product, data: ProductUseCaseTypes.UpdateProduct);
    abstract delete(product: Product);
}

export namespace ProductUseCaseTypes {
    export interface CreateProduct {
        title: string;
        description: string;
        quantity: number;
        price: number;
        category_id: number;
        new_properties?: string[];
        property_ids?: number[];
        new_images?: Array<Express.Multer.File>;
    }
    export interface UpdateProduct {
        title?: string;
        description?: string;
        quantity?: number;
        price?: number;
        category_id?: number;
        new_properties?: string[];
        property_ids?: number[];
    }
}