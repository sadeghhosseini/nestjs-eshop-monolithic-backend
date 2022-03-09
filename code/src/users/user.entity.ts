import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "../addresses/address.entity";
import { Cart } from "../carts/cart.entity";
import { Order } from "../orders/order.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
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
}