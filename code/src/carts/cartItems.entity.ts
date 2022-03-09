import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";
import { Cart } from "./cart.entity";

@Entity({ name: 'cart_items' })
export class CartItems {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    item: Product

}