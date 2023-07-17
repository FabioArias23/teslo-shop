import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

import { ProductImage,Product } from './entities';
import { User } from 'src/auth/entities/users.entity';
@Injectable()
export class ProductsService {
     
    private readonly logger = new Logger('ProductsService')

    constructor(

      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
      @InjectRepository(ProductImage)
      private readonly productImageRepository: Repository<ProductImage>,
      //actualizo data source desde typeorm para saber que base de datos uso y puedo usar para crear mi query runner
      private readonly dataSource: DataSource,
    ) {}


   async create(createProductDto: CreateProductDto, user:User) {
    
    try{


      
      const {images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({ 
        ...productDetails,
        user,
      images: images.map( image => this.productImageRepository.create({url: image}))
     })
     await this.productRepository.save(product)
     return {...product, images}
      }catch(error){

        this.handleExceptions(error);
    }
   

  }
//TODO: paginar
  async findAll(paginationDto:PaginationDto) {
    const {limit= 10, offset= 0} = paginationDto

   const product = await this.productRepository.find({
      take:limit,
      skip:offset,
      //todo: relaciones
      relations: {
        images: true,
      }
    })

    return product.map( (product) => ({

      ...product,
      images: product.images.map( img => img.url)

    }))
  }

 async findOne(term: string) {

  //para buscar el producto  por id o slug pasandole term 
    let product: Product;


  if( isUUID(term) ){
    product = await this.productRepository.findOneBy({id:term});

  }else{
   // product = await this.productRepository.findOneBy({slug:term});

   //estamos en el producto repository
    const queryBuilder = this.productRepository.createQueryBuilder('prod');

    product = await queryBuilder
    .where('UPPER(title) =:title or slug =:slug',{
      title: term.toUpperCase(),
      slug: term.toLowerCase(),
    })
                        //es el punto // esta alias es por si queres hacer un join
    .leftJoinAndSelect('prod.images','prodImages')
    .getOne();
   // `select * from Product where slug = 'XX or tittle=xxx'`
  }
    //const product = await this.productRepository.findOneBy({id})
      if(!product) throw new NotFoundException(`Product  with id ${term} not found`)
    return product;
  }
  //uso plain para aplanar las imagenes y arreglar la busqueda
  async findONePlain( term: string){
    const {images = [], ...rest} = await this.findOne(term)
   return {
    ...rest,
    images: images.map(image => image.url)
   }
  }



 async  update(id: string, updateProductDto: UpdateProductDto, user:User) {

  const {images, ...toUpdate} = updateProductDto;
    //data que va actualizar sin las imagenes porque las imagenes las trabajo de una manera independiente
    const product = await this.productRepository.preload({
      id, ...toUpdate
    })
  //ahora si no existe el producto  
    if( !product ) throw new NotFoundException(`Product ${id}  not found`)
    //si tenemos un producto con imagenes
    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();

    //transacciones

    await queryRunner.connect()
    await queryRunner.startTransaction()

    //empezamos a definir una serie de procedimientos


    try {

      if(images ){

        await queryRunner.manager.delete(ProductImage, {product: {id}});
        //insertando el url
        product.images = images.map( 
          image => this.productImageRepository.create({url:image})
          )
      }

      product.user = user;

        //si usamos manager no  estamos impactando a la base de datos directa para manejar la peticion
      await queryRunner.manager.save(product);
      //await this.productRepository.save(product);

      await queryRunner.commitTransaction()
      await queryRunner.release()
      
      return this.findONePlain(id)
       
    } catch (error) {
      
      await queryRunner.rollbackTransaction();
      await queryRunner.release()

      this.handleExceptions(error); 
    }
   

  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productRepository.remove(product);

  }
  private handleExceptions(error:any){

   
    if (error.code === '23505')
    
    throw new BadRequestException(error.detail);

    this.logger.error(error)
    //console.log(error)
    throw new InternalServerErrorException('Unexpected error: check server logs')

  }
 //aca creo un delete de todos los productos
 //es para trabajar mi seed, no usarlo en produccion 
  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');
    try{
      return await query
      .delete()
      .where({})
      .execute();
    }catch(error){
      this.handleExceptions(error)
    }
  }

 }
