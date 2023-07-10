import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";  
export const GetUser = createParamDecorator(
    (data:string , ctx:ExecutionContext )=>{
      console.log({data})
      const req = ctx.switchToHttp().getRequest();
      const user = req.user;
      if(!user)
      throw new InternalServerErrorException(' error 505 user not found in (request)')
     
      return (!data) 
        ? user
        : user[data];
    }
)