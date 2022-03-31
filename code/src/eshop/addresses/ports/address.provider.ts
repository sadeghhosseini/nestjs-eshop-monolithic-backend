import { Address } from "../address.entity";


export abstract class AddressProvider {
    abstract getRecords(condition?: GetAllRecordsConditionType);
    abstract createRecord(address: AddressProviderTypes.CreateAddress, customer_id: number);
    abstract updateRecord(address: Address, newAddressInfo: AddressProviderTypes.UpdateAddress);
    abstract deleteRecord(address: Address);
}

type GetAllRecordsConditionType = {
    customer_id: number,
}

export namespace AddressProviderTypes {
    export interface CreateAddress {
        province: string;
        city: string;
        rest_of_address: string;
        postal_code: string;
    }

    export interface UpdateAddress {
        province: string;
        city: string;
        rest_of_address: string;
        postal_code: string;
    }
}