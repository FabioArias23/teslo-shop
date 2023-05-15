import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
//creo entity de image 

@Entity()
export class ProductImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @ManyToOne(
        () => Product,
        (product) => product.images
    )
    product: Product

}