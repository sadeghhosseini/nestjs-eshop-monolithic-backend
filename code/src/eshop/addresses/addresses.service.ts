import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Address } from './address.entity';
import { AddressProvider } from './ports/address.provider';
import { AddressUseCase, AddressUseCaseTypes } from './ports/address.usecase';

@Injectable()
export class AddressesService implements AddressUseCase {
    constructor(
        private repository: AddressProvider
    ) {

    }

    get(user: User, address: Address) {
        const permissions = user.permissions.map(p => p.title);
        const canViewAnyAddress = permissions.includes('view-address-any');
        const canViewOwnAddress = permissions.includes('view-address-own');
        const isOwnAddress = address.customer.id == user.id;
        const permittedToGet = canViewAnyAddress || (canViewOwnAddress && isOwnAddress);
        if (!permittedToGet) {
            throw new ForbiddenException();
        }
        return address;
    }

    getAll(user: User) {
        const permissions = user.permissions.map(p => p.title);
        const currentUserId = user.id;
        const canViewAnyAddress = permissions.includes('view-address-any');
        const canViewOwnAddress = permissions.includes('view-address-own');

        if (!canViewAnyAddress && !canViewOwnAddress) {
            throw new ForbiddenException();
        }

        if (canViewAnyAddress) {
            return this.repository.getRecords();
        }
        if (canViewOwnAddress) {
            return this.repository.getRecords({ customer_id: currentUserId });
        }
    }

    create(user: User, address: AddressUseCaseTypes.CreateAddress) {
        return this.repository.createRecord(address, user.id);
    }

    update(user: User, address: Address, newAddressInfo: AddressUseCaseTypes.UpdateAddress) {
        if (user.id !== address.customer.id) {
            throw new ForbiddenException();
        }
        return this.repository.updateRecord(address, newAddressInfo);
    }

    delete(user: User, address: Address) {
        if (user.id !== address.customer.id) {
            throw new ForbiddenException();
        }
        return this.repository.deleteRecord(address);
    }

}
