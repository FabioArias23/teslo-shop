import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto,LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/users.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser()  user: User
  ){
    return this.authService.checkAuthStatus(user);
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
   //@SetMetadata('roles', ['admin','super-user'])
  //usamos el roleprocted decorator para no usar el @Setmetadata
  @Get('private3')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute3(
    
      @GetUser() user: User
    ){
        return {
        ok:true,
        user
     }

  }

}


