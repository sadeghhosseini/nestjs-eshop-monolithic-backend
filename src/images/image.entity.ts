import { Product } from "src/products/product.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;
    
    @ManyToMany(() => Product, product => product.images)
    products: Product[];
}