import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { EntityTarget, getManager } from 'typeorm';


@Injectable()
export class IdToEntity<T extends EntityTarget<T>> implements PipeTransform<string, Promise<T>> {
    constructor(private Entity: T, private relationsToLoad?: string[]) {

    }
    async transform(value: string, metadata: ArgumentMetadata): Promise<T> {
        try {
            let record;
            if (!this.relationsToLoad || this.relationsToLoad?.length == 0) {
                record = await getManager().findOne<T>(this.Entity, value);
            } else {
                record = await getManager().findOne<T>(this.Entity, value, { relations: this.relationsToLoad });
            }
            if (!record) {
                throw new BadRequestException('wrong id provided');
            }
            return record;
        } catch(e) {
            Logger.error(e);
            throw e;
        }
    }
}