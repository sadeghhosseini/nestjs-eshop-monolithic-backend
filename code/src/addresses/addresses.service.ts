import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private repository: Repository<Address>
    ) {

    }
    get(address: Address) {
        return address;
    }
    getAll() {
        return this.repository.find();
    }
    create(address: CreateAddressDto) {
        return this.repository.save(address);
    }
    update(address: Address, newAddressInfo: UpdateAddressDto) {
        return this.repository.update(address, newAddressInfo);
    }
    delete(address: Address) {
        return this.repository.delete(address);
    }

}
