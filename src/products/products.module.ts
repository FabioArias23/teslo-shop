import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
//mejoro importacion de Product y ProductImage
import { Product,ProductImage } from './entities';

//importamos el authmodule
import { AuthModule } from '../auth/auth.module';


//agrego la identidad image
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product,ProductImage]),
    AuthModule,
  ],
    
    exports: [
      ProductsService,
      TypeOrmModule
    ]
})
export class ProductsModule {}
