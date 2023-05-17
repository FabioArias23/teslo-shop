import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

import { ProductImage,Product } from './entities';
@Injectable()
export class ProductsService {
     
    private readonly logger = new Logger('ProductsService')

    constructor(

      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
      @InjectRepository(ProductImage)
      private readonly productImageRepository: Repository<ProductImage>,
    ) {}


   async create(createProductDto: CreateProductDto) {
    
    try{


      
      const {images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({ 
        ...productDetails,
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
  //
  async findONePlain( term: string){
    const {images = [], ...rest} = await this.findOne(term)
   return {
    ...rest,
    images: images.map(image => image.url)
   }
  }



 async  update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images:[]
    })
    
    if( !product ) throw new NotFoundException(`Product ${id}  not found`)
    
    try {
      await this.productRepository.save(product)
      
      return product;
      
    } catch (error) {
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
}
