import { getManager } from "typeorm";
import { Property } from "../property.entity";
import { PropertyProvider, PropertyProviderTypes } from "../prots/property.provider";

export class PropertyRepository implements PropertyProvider{
    createRecord(property: PropertyProviderTypes.CreateProperty) {
        throw new Error("Method not implemented.");
    }
    createRecords(properties: PropertyProviderTypes.CreateProperty[]): Promise<Property[]> {
        return getManager().save(Property, properties.map(p => ({
            title: p.title,
            is_visible: p?.is_visible || true,
            category: {
                id: p.category_id,
            }
        })));
    }
    getRecords() {
        throw new Error("Method not implemented.");
    }
    getRecord() {
        throw new Error("Method not implemented.");
    }
    deleteRecord() {
        throw new Error("Method not implemented.");
    }
    updateRecord() {
        throw new Error("Method not implemented.");
    }

}