import { faker } from '@faker-js/faker';
import { Cart } from 'src/carts/cart.entity';
import { CartItems } from 'src/carts/cartItems.entity';
import { Category } from 'src/categories/category.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { EntityTarget, getConnection, getManager, getRepository } from 'typeorm';
import { promises } from 'fs';
import { Property } from "../src/properties/property.entity";
import { Address } from 'src/addresses/address.entity';

abstract class Factory {
    protected Entity: EntityTarget<unknown> = null;
    protected recordCount: number = 1;

    constructor() {
        this.Entity = this.getEntityClass();
    }

    abstract fake(data?: Record<string, any>);

    abstract getEntityClass(): EntityTarget<unknown>;

    async make(data?: Record<string, any>) {
        let result = [];
        for (let i = 0; i < this.recordCount; ++i) {
            result.push(await this.fake(data));
        }
        return result.length == 1 ? result.pop() : result;
    }

    async create(data?: Record<string, any>) {
        const repository = getRepository(this.Entity);

        if (this.recordCount == 1) {
            let fakeData = await this.make(data);
            try {
                let insertResult = await (await repository.insert(fakeData));
                /* let insertResult = await getConnection().createQueryBuilder()
                    .insert()
                    .into(this.Entity)
                    .values(fakeData)
                    .execute(); */

                const pkLabel = Object.keys(insertResult.identifiers?.[0] ?? [])[0];
                const pkValue = Object.values(insertResult.identifiers?.[0] ?? [])[0];
                return {
                    ...fakeData,
                    [pkLabel]: pkValue,
                };
            } catch (e) {
                console.log('Factory - create - error - 1', e);
            }
        } else {
            let result = [];
            let fakeData = await this.make(data);
            for (let i = 0; i < fakeData.length; ++i) {
                try {
                    let insertResult = await repository.insert(fakeData[i]);
                    /*  let insertResult = await getConnection().createQueryBuilder()
                         .insert()
                         .into(this.Entity)
                         .values(fakeData)
                         .execute(); */
                    const pkLabel = Object.keys(insertResult.identifiers?.[0] ?? [])[0];
                    const pkValue = Object.values(insertResult.identifiers?.[0] ?? [])[0];
                    result.push({
                        ...fakeData[i],
                        [pkLabel]: pkValue,
                    });
                    // return result;
                } catch (e) {
                    console.log('Factory - create - error - 2', e);
                }
            }
            return result;
        }
    }

    count(recordCount: number) {
        this.recordCount = recordCount;
        return this;
    }
}

interface ProductFactoryAssociationType {
    properties?: Property[];
}
export class ProductFactory extends Factory {
    private associations: ProductFactoryAssociationType;
    constructor(associations?: ProductFactoryAssociationType) {
        super();
        this.associations = associations;
    }
    static get(associations?: ProductFactoryAssociationType): Factory {
        return new ProductFactory(associations);
    }

    getEntityClass(): EntityTarget<unknown> {
        return Product;
    }

    async fake(data?: Record<string, any>) {
        let relations = {};
        if (data?.properties) {
            relations = {
                properties: data?.properties,
            }
        }
        return {
            title: data?.title ?? faker.commerce.product(),
            quantity: data?.quantity ?? faker.datatype.number({ min: 0, max: 10 }),
            price: data?.price ?? faker.datatype.number({ min: 10000, max: 1000000 }),
            description: data?.description ?? faker.commerce.productDescription(),
            // category_id: data?.category_id ?? (await CategoryFactory.get().create()).id,
            category: data?.category ?? (await CategoryFactory.get().create()),
            ...relations,
        };
    }

    /* async create(data?: Record<string, any>): Promise<any> {
        const product: Product = await super.create(data);
        if (this.associations?.properties) {
            product.properties = [
                ...(product?.properties ?? []),
                ...this.associations.properties,
            ];
            await getManager().save(Product, product);
        }
        return product;
    } */
}

export class CategoryFactory extends Factory {
    static get(): Factory {
        return new CategoryFactory();
    }

    getEntityClass(): EntityTarget<unknown> {
        return Category;
    }

    fake(data?: Record<string, any>) {
        return {
            title: data?.title ?? faker.word.noun(),
            description: data?.description ?? faker.lorem.sentence(),
            parent_id: data?.parent_id ?? null,
        }
    }

}

export class UserFactory extends Factory {
    static get(): Factory {
        return new UserFactory();
    }

    getEntityClass(): EntityTarget<unknown> {
        return User;
    }

    fake(data?: Record<string, any>) {
        return {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
    }

}

export class CartFactory extends Factory {
    static get(): Factory {
        return new CartFactory();
    }

    getEntityClass(): EntityTarget<unknown> {
        return Cart;
    }

    async fake(data?: Record<string, any>) {
        return {
            owner: data?.owner ?? (await UserFactory.get().create()),
        };
    }

}

export class CartItemsFactory extends Factory {
    static get(): Factory {
        return new CartItemsFactory();
    }

    getEntityClass(): EntityTarget<unknown> {
        return CartItems;
    }

    async fake(data?: Record<string, any>) {
        return {
            cart_id: data?.cart_id ?? (await CartFactory.get().create()).id,
            quantity: data?.quantity ?? faker.datatype.number({ min: 0, max: 100 }),
            product_id: data?.product_id ?? (await ProductFactory.get().create()).id,
        };
    }

}

export class ImageFactory extends Factory {
    static get() {
        return new ImageFactory();
    }

    async fake(data?: Record<string, any>) {
        return {
            file: await promises.readFile('test/resources/test.png'),
            path: 'images',
        }
    }

    getEntityClass(): EntityTarget<unknown> {
        return Image;
    }
}

export class PropertyFactory extends Factory {
    static get() {
        return new PropertyFactory();
    }

    async fake(data?: Record<string, any>) {
        return {
            title: faker.word.noun(4),
            is_visible: true,
            category: await CategoryFactory.get().create(),
        }
    }

    getEntityClass(): EntityTarget<unknown> {
        return Property;
    }
}

export class AddressFactory extends Factory {
    static get() {
        return new AddressFactory();
    }

    async fake(data?: Record<string, any>) {
        return {
            province: faker.address.state(),
            city: faker.address.city(),
            postal_code: faker.address.zipCodeByState('AK'),
            rest_of_address: `street: ${faker.address.streetName()}, ${faker.address.streetAddress()}`
        }
    }

    getEntityClass(): EntityTarget<unknown> {
        return Address;
    }
}

