import { Address } from "src/addresses/address.entity";
import { Cart } from "src/carts/cart.entity";
import { Order } from "src/orders/order.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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