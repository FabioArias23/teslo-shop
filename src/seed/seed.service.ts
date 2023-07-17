import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
   //inyecto mi product service
    private readonly productsService: ProductsService
    ){}

 async runSeed(){
  
  await this.insertNewProducts()
  
  return 'seed executed'
 }


 private async insertNewProducts(){
 
  await this.productsService.deleteAllProducts();
 
//instancias lucen exactamente como el dto

const product = initialData.products;

//creo varios inserts que se hacen de manera automatica
const insertPromises = [];
// product.forEach(product => {
//  insertPromises.push(this.productsService.create(product))
// });

await Promise.all(insertPromises)

  return true;
 }

}
