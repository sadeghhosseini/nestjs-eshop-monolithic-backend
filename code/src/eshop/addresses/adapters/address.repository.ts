import { getManager } from "typeorm";
import { Address } from "../address.entity";
import { AddressProvider, AddressProviderTypes } from "../ports/address.provider";

export class AddressRepository implements AddressProvider {

    deleteRecord(address: Address) {
        return getManager().delete(Address, address);
    }
    updateRecord(address: Address, newAddressInfo: AddressProviderTypes.UpdateAddress) {
        return getManager().update(Address, address, newAddressInfo);
    }
    createRecord(address: AddressProviderTypes.CreateAddress, customer_id: number) {
        return getManager().save(Address, {
            ...address,
            customer: { id: customer_id }
        });
    }
    getRecords(condition?: { customer_id: number; }) {
        if (condition) {
            return getManager().find(Address, { customer: { id: condition.customer_id } });
        } else {
            return getManager().find(Address);
        }
    }

}