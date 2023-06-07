import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express'
import { diskStorage } from 'multer';
import { fileNamer,fileFilter } from './helpers';

//controlador de archivos, definimos un metodo post usamos el useinterceptors y nombramos con decorador @UploadedFile lo importamos desde nestjs/common
@Controller('files')
export class FilesController {
 constructor (private readonly filesService: FilesService){ }

 @Get('product/:imageName')
 findProductImage(
  @Res() res:Response,
  @Param('imageName')imageName:string
 ){
  const path = this.filesService.getStaticProductImage(imageName)
  res.sendFile(path);
 }


//creamos producto y almacenamos en disk
 @Post('product')
 //ponemos aqui que el fileFitler es igual a filFilter y mandamos la referencia a la funcion
 @UseInterceptors(FileInterceptor('file',{ 
  fileFilter:fileFilter,
  //aca nombramos donde queremos almacenar esta imagen en filesystem o en el storage que esten definiendo
  storage: diskStorage({
    destination: './static/products',
    filename:fileNamer
  })
  //limits: {fileSize: 1000}
}))
 updloadProductImage(
  @UploadedFile() file: Express.Multer.File)
 {
 
  if( !file ){
    throw new BadRequestException('Make sure that  file is an image')
    

  }

  const secureUrl = `${file.filename}`;

  return {
    secureUrl
  }
 }
}
