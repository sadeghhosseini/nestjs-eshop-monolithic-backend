import { DeepPartial, Entity, EntityTarget, FindConditions, FindManyOptions, FindOneOptions, getManager, ObjectID, SaveOptions } from "typeorm"

export namespace commands {
    export function create<Entity>(entityClass: EntityTarget<Entity>, plainObject?: DeepPartial<Entity>): Entity;
    export function create<Entity>(entityClass: EntityTarget<Entity>, plainObjects?: DeepPartial<Entity>[]): Entity[];
    export function create<Entity>(Entity, plainObject) {
        const entityManager = getManager();
        return entityManager.create(Entity, plainObject);
    }

    export function save<Entity>(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
    export function save<Entity>(entity: Entity, options?: SaveOptions): Promise<Entity>;
    export function save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entities: T[], options: SaveOptions & { reload: false; }): Promise<T[]>;
    export function save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entities: T[], options?: SaveOptions): Promise<(T & Entity)[]>;
    export function save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entity: T, options: SaveOptions & { reload: false; }): Promise<T>;
    export function save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entity: T, options?: SaveOptions): Promise<T & Entity>;
    export function save(Entity, data) {
        const entityManager = getManager();
        return entityManager.save(Entity, data);
    }

}

export namespace queries {

    export function find<Entity>(entityClass: EntityTarget<Entity>, options?: FindManyOptions<Entity>): Promise<Entity[]>;
    export function find<Entity>(entityClass: EntityTarget<Entity>, conditions?: FindConditions<Entity>): Promise<Entity[]>;
    export function find(Entity, condition) {
        const entityManager = getManager();
        return entityManager.find(Entity, condition);
    }

    export function findOne<Entity>(entityClass: EntityTarget<Entity>, id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    export function findOne<Entity>(entityClass: EntityTarget<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    export function findOne<Entity>(entityClass: EntityTarget<Entity>, conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    export function findOne(Entity, condition, options?) {
        const entityManager = getManager();
        return entityManager.findOne(Entity, condition, options);
    }
}

