import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { query } from 'express';
@Injectable()
export class ProductsService {
     
    private readonly logger = new Logger('ProductsService')

    constructor(

      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,

    ) {}


   async create(createProductDto: CreateProductDto) {
    
    try{
      /* if(!createProductDto.slug){
        createProductDto.slug = createProductDto.title
        .toLowerCase()
        .replaceAll(' ','')
        .replaceAll("'",'')
      }else{
        createProductDto.slug = createProductDto.title
        .toLowerCase()
        .replaceAll('','')
        .replaceAll("'",'')
      } */


      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product);
      return product 

    }catch(error){

     
    }
   

  }
//TODO: paginar
  findAll(paginationDto:PaginationDto) {
    const {limit= 10, offset= 0} = paginationDto

    return this.productRepository.find({
      take:limit,
      skip:offset,
      //todo: relaciones
    })
  }

 async findOne(term: string) {

  //para buscar el producto  por id o slug pasandole term 
    let product: Product;


  if( isUUID(term) ){
    product = await this.productRepository.findOneBy({id:term});

  }else{
   // product = await this.productRepository.findOneBy({slug:term});
    const queryBuilder = this.productRepository.createQueryBuilder();

    product = await queryBuilder
    .where('UPPER(title) =:title or slug =:slug',{
      title: term.toUpperCase(),
      slug: term.toLowerCase(),
    }).getOne();
   // `select * from Product where slug = 'XX or tittle=xxx'`
  }
    //const product = await this.productRepository.findOneBy({id})
      if(!product) throw new NotFoundException(`Product  with id ${term} not found`)
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
