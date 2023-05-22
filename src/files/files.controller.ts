import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

//controlador de archivos, definimos un metodo post usamos el useinterceptors y nombramos con decorador @UploadedFile lo importamos desde nestjs/common
@Controller('files')
export class FilesController {
 constructor (private readonly filesService: FilesService){ }

 @Post('product')
 //ponemos aqui que el fileFitler es igual a filFilter y mandamos la referencia a la funcion
 @UseInterceptors(FileInterceptor('file',{ fileFilter:fileFilter}))
 updloadProductImage(
  @UploadedFile() file: Express.Multer.File)
 {

  if( !file ){
    throw new BadRequestException('Make sure that  file is an image')
  }

  return {
    fileName: file.originalname 
  }
 }
}
