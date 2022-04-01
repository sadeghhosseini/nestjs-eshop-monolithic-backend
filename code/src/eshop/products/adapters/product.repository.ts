import { getManager } from "typeorm";
import { ProductProvider, ProductProviderTypes } from "../ports/product.provider";
import { Product } from "../product.entity";


export class ProductRepository implements ProductProvider {
    createRecord(data: ProductProviderTypes.CreateProduct) {
        return getManager().save(Product, data);
    }
    deleteRecord(product: Product) {
        return getManager().delete(Product, product);
    }
    updateRecord(data: ProductProviderTypes.UpdateProduct) {
        return getManager().save(Product, data);
    }
    
}