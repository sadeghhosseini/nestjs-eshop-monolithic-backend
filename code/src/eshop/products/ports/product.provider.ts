import { Product } from "../product.entity";

export abstract class ProductProvider {
    abstract createRecord(data: ProductProviderTypes.CreateProduct);
    abstract deleteRecord(product: Product);
    abstract updateRecord(data: ProductProviderTypes.UpdateProduct);
}

export namespace ProductProviderTypes {
    export interface CreateProduct {
        title: string;
        description: string;
        quantity: number;
        price: number;
        category: {
            id: number
        },
        properties?: Array<{
            id: number,
        }>,
    }
    export interface UpdateProduct {
        title: string;
        description: string;
        quantity: number;
        price: number;
        category: {
            id: number
        },
        properties?: Array<{
            id: number,
        }>,
    }
}