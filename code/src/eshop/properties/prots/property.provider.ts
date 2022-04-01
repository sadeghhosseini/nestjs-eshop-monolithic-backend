import { Category } from "src/eshop/categories/category.entity";
import { Property } from "../property.entity";

export abstract class PropertyProvider {
    abstract createRecord(property: PropertyProviderTypes.CreateProperty);
    abstract createRecords(properties: PropertyProviderTypes.CreateProperty[]): Promise<Property[]>;
    abstract getRecords();
    abstract getRecord();
    abstract deleteRecord();
    abstract updateRecord();
}

export namespace PropertyProviderTypes {
    export interface CreateProperty {
        title: string;
        is_visible?: boolean;
        category_id: number;
    }
}