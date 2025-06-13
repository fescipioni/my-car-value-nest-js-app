import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UserController {

  @Post('/sign-up')
  createUser(@Body() body : CreateUserDto) {
    console.log(body);
  }
}
