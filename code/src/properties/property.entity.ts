import { Category } from "src/categories/category.entity";
import { Product } from "src/products/product.entity";
import { ManyToOne, ManyToMany, JoinTable, Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity({ name: 'properties' })
export class Property {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    title: string;

    @Column()
    isVisible: boolean;

    @ManyToOne(() => Category)
    category: Category;

    @ManyToMany(() => Product)
    @JoinTable({ name: 'products_properties' })
    products: Product[];
}