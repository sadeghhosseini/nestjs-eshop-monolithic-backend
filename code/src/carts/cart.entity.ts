import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { CartItems } from "./cartItems.entity";

@Entity({ name: 'carts' })
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    owner: User;

    @OneToMany(() => CartItems, ctp => ctp.cart)
    items: CartItems[];
}