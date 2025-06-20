import { Body, Controller, Post, Get, Patch, Delete, Param, Query, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {

  constructor(private userService: UserService) {

  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Post('/sign-up')
  createUser(@Body() body : CreateUserDto) {
    
    this.userService.create(body.email, body.password);    
    console.log(body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
