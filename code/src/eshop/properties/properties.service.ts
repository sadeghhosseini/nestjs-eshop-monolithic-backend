import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './property.entity';

@Injectable()
export class PropertiesService {

    constructor(
        @InjectRepository(Property)
        private repository: Repository<Property>) {

    }
    create(body: CreatePropertyDto) {
        return this.repository.save({
            title: body.title,
            is_visible: body.is_visible,
            category: {
                id: body.category_id,
            }
        });
    }
    get() {
        return this.repository.find();
    }
    update(property: Property, body: UpdatePropertyDto) {
        const up = {} as any;
        up.id = property?.id;
        up.title = body?.title ?? property?.title;
        up.is_visible = body?.is_visible ?? property?.is_visible;
        up.category = {
            id: body?.category_id ?? property?.category.id,
        }
        return this.repository.save(up);
    }
    delete(property: Property) {
        return this.repository.delete(property);
    }
}
