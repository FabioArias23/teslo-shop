
import {BeforeInsert, BeforeUpdate, Column,Entity,ManyToOne,OneToMany,PrimaryGeneratedColumn} from "typeorm";
import { ProductImage } from "./product.image.entity";
import { User } from "src/auth/entities/users.entity";

@Entity({name:'products'})
export class Product{
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column("text",{
        unique:true,
    })
    title:string;

    @Column("float",{
        default:0
    })
    price: number;
    
    @Column({
        type: "text",
        nullable: true
    })
    description: string;

    @Column("text",{
        unique:true,
    })
    slug: string;

    @Column('int',{
      default:0,
    })  
    stock:number;

    @Column("text",{
        array:true,
    })
    sizes:string[];
    
    @Column('text')
    gender:string;

    @Column('text',{
        array:true,
        default:[]
    })
    tags:string[]

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



