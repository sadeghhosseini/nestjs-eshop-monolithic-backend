import { Logger } from "@nestjs/common";
import { getManager } from "typeorm";
import { Permission } from "./permission.entity";

export const permissions = {
    admin: [
        //address
        'view-address-any',

        //categories
        'add-category',
        'edit-category-any',
        'delete-category-any',

        //products
        'add-product',
        'edit-product-any',
        'delete-product-any',

        //properties
        'add-property',
        'edit-property-any',
        'delete-property-any',



        //images
        'add-image',
        'edit-image-any',
        'delete-image-any',

        //users
        'view-user-any',

        //orders
        'view-order-any',
        'accept_or_reject-comment-any',
        'edit-order(status)-any',

    ],
    customer: [
        //addresses
        'add-address-own',
        'edit-address-own',
        'delete-address-own',
        'view-address-own',

        //users
        'view-user-own',
        'edit-user(name)-own',



        //comments
        'add-comment',
        'edit-comment-own',
        'delete-comment-own',
        'delete-comment-any',

        //user
        'place-order',
        // 'add-items-to-own-cart',
        'add-cart.item-own',
        // 'delete-items-from-own-cart',
        'delete-cart.item-own',
        'update-cart.item-own',

        //orders
        'view-order-own',
        'edit-order(address)-own', //if status does not equal "sent"

    ]
};
class PermissionSeeder {
    async seed() {
        Logger.log('seeding permissions table');
        if (await this.isTableEmpty()) {
            const adminPermissions = permissions.admin.map(title => ({title}));
            const customerPermissions = permissions.customer.map(title => ({title}));
            await this.createPermissions([...adminPermissions, ...customerPermissions]);
        }
    }

    createPermissions(permissions: { title: string; }[]) {
        return getManager().save(Permission, permissions);
    }

    private async isTableEmpty(): Promise<boolean> {
        const manager = getManager();
        const records = await manager.find(Permission);
        return records.length == 0;
    }

    private async createPermission(permissionTitle: string): Promise<Permission> {
        try {
            const manager = getManager();
            return manager.save(Permission, { title: permissionTitle });
        } catch (error) {
            Logger.log('PermissionSeeder - error', error);
        }
    }
}

export const permissionSeeder = new PermissionSeeder();