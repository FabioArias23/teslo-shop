import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
   //inyecto mi product service
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
   

    
    ){}

    //aca corremos la seed en esta funcion
 async runSeed(){

  await this.deleteTables();

  const adminUser = await this.insertUsers()

  await this.insertNewProducts(adminUser)
  
  return 'seed executed'

}



 private async deleteTables(){
  
  await this.productsService.deleteAllProducts();

   const queryBuilder = this.userRepository.createQueryBuilder()
   await queryBuilder
   .delete()
   .where({})
   .execute()
 }

  private async insertUsers(){
    const seedUsers = initialData.users;
    const users: User[] = []
    //Aca inserto el user repositories lo crea pero no lo salva aca lo prepara y asigna id
    seedUsers.forEach(user=>{
      users.push(this.userRepository.create(user))
    });
    const dbUser = await this.userRepository.save(seedUsers);

    return dbUser[0]


  }
 
  private async insertNewProducts(user:User){
 
  await this.productsService.deleteAllProducts();
 
//instancias lucen exactamente como el dto

const product = initialData.products;

//creo varios inserts que se hacen de manera automatica
const insertPromises = [];
product.forEach(product => {
 insertPromises.push(this.productsService.create(product,user))
});

await Promise.all(insertPromises)

  return true;
 }

}
