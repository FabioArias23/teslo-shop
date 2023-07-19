
import {BeforeInsert, BeforeUpdate, Column,Entity,ManyToOne,OneToMany,PrimaryGeneratedColumn} from "typeorm";
import { ProductImage } from "./product.image.entity";
import { User } from "src/auth/entities/users.entity";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuid } from 'uuid';

@Entity({name:'products'})
export class Product{
    @ApiProperty({
        example:'0fb1323b-4525-4087-b62f-cd2a3e81fd52',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn("uuid")
    id:string;
    
    @ApiProperty({
        example:'Men s Turbine Short Sleeve Tee',
        description: 'Product title',
        uniqueItems: true
    })
    @Column("text",{
        unique:true,
    })
    title:string;

    @ApiProperty({
        example:0,
        description: 'Product Price',

    })
    @Column("float",{
        default:0
    })
    price: number;
    
    @ApiProperty({
        example:'Lorem ipsum dolor sit amet, consectetur adip',
        description: 'Product description',
        default: null
    })
    @Column({
        type: "text",
        nullable: true
    })
    description: string;

    @ApiProperty({
        example:'t_shit_teslo',
        description: 'Product Slug -for seo',
        uniqueItems: true
    })
    @Column("text",{
        unique:true,
    })
    slug: string;

    @ApiProperty({
        example:10,
        description: 'Product stock',
        default: 0
    })
    @Column('int',{
      default:0,
    })  
    stock:number;

    @ApiProperty({
        example:['M','XL','XLL'],
        description: 'Product Sizes',
        uniqueItems: true
    })
    @Column("text",{
        array:true,
    })
    sizes:string[];
    
    @ApiProperty({
        example:'women',
        description: 'Product Gender',
        uniqueItems: true
    })
    @Column('text')
    gender:string;

    @ApiProperty({

    })
    @Column('text',{
        array:true,
        default:[]
    })
    tags:string[]

    @ApiProperty({
    })
    @OneToMany(
        ()=> ProductImage,
        //callbacks
        (productImage) => productImage.product,
       //cada vez que un metodo use find automaticamente va a cargar las imagenes  del producto
        {cascade:true, eager:true}
    )
    images?: ProductImage[]

    //relacion muchos a uno
    @ManyToOne(
        () =>User,
        (user) => user.product,
        {eager:true}
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
         if(!this.slug){
        this.slug = this.title
      
         }
         this.slug = this.slug  
         .toLowerCase()
         .replaceAll(' ','_')
         .replaceAll("'",'')
    }
    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug   
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
   }
    }



