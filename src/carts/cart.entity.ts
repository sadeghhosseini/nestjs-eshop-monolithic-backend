import { Product } from "src/products/product.entity";
import { User } from "src/users/user.entity";
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItems } from "./cartItems.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn()
    id:  number;

    @OneToOne(() => User)
    @JoinColumn()
    owner: User;

    @OneToMany(() => CartItems, ctp => ctp.cart)
    items: CartItems[];
}