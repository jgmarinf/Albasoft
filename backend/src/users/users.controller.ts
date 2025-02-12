import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserSelfRegistrationDto } from './dto/create-user-self-registration.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('register/admin')
  registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
  }

  @Post('register/user')
  selfRegister(
    @Body() createUserSelfRegistrationDto: CreateUserSelfRegistrationDto,
  ) {
    return this.usersService.selfRegister(createUserSelfRegistrationDto);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
