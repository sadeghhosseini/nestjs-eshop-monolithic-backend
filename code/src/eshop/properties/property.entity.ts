import { Category } from "src/eshop/categories/category.entity";
import { Product } from "src/eshop/products/product.entity";
import { ManyToOne, ManyToMany, JoinTable, Column, PrimaryGeneratedColumn, Entity, JoinColumn } from 'typeorm';

@Entity({ name: 'properties' })
export class Property {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    title: string;

    @Column({ name: 'is_visible', default: true })
    is_visible: boolean;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToMany(
        () => Product,
        product => product.properties,
        { onDelete: 'CASCADE' }
    )
    products: Product[];
}