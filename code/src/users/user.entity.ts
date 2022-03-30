import { Address } from "src/eshop/addresses/address.entity";
import { Cart } from "src/eshop/carts/cart.entity";
import { Order } from "src/eshop/orders/order.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Address, address => address.customer)
    addresses: Address[];

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];

    @OneToOne(() => Cart)
    cart: Cart;

    @ManyToMany(() => Permission, permission => permission.users)
    @JoinTable({ name: 'users_permissions', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'permission_id' } })
    permissions: Permission[];
}