import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto,LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/users.entity';
import { RawHeaders, GetUser } from './decorators';
import { IncomingHttpHeaders } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard())
  @Get('private')
  testingPrivateRoute(
  @Req() request: Express.Request,
  @GetUser() user: User,
  @GetUser('email') userEmail: string,
  @RawHeaders() rawHeaders:string[],
  @Headers() header: IncomingHttpHeaders
  
    ){
    console.log(request)
   // console.log({user})
    return {
     ok:true,
    
     user,
    userEmail,
    rawHeaders,
    header
    }

  }


}


