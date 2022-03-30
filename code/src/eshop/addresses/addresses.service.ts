import {ForbiddenException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/users/user.entity';
import {Repository} from 'typeorm';
import {Address} from './address.entity';
import {CreateAddressDto} from './dto/create-address.dto';
import {UpdateAddressDto} from './dto/update-address.dto';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private repository: Repository<Address>
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

        if(!canViewAnyAddress && !canViewOwnAddress) {
            throw new ForbiddenException();
        }

        if (canViewAnyAddress) {
            return this.repository.find();
        }
        if (canViewOwnAddress) {
            return this.repository.find({customer: {id: currentUserId}});
        }
    }

    create(user: User, address: CreateAddressDto) {
        return this.repository.save({
            ...address,
            customer: {id: user.id}
        });
    }

    update(user: User, address: Address, newAddressInfo: UpdateAddressDto) {
        if (user.id !== address.customer.id) {
            throw new ForbiddenException();
        }
        return this.repository.update(address, newAddressInfo);
    }

    delete(user: User, address: Address) {
        if (user.id !== address.customer.id) {
            throw new ForbiddenException();
        }
        return this.repository.delete(address);
    }

}
