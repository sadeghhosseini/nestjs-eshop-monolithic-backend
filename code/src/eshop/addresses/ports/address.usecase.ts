import { User } from "src/users/user.entity";
import { Address } from "../address.entity";

export abstract class AddressUseCase {
    abstract get(user: User, address: Address);
    abstract getAll(user: User);
    abstract create(user: User, address: AddressUseCaseTypes.CreateAddress);
    abstract update(user: User, address: Address, newAddressInfo: AddressUseCaseTypes.UpdateAddress);
    abstract delete(user: User, address);
}


export namespace AddressUseCaseTypes {
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