import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserSelfRegistrationDto } from './dto/create-user-self-registration.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(_createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  createAdmin(createAdminDto: CreateAdminDto) {
    // Lógica para crear un administrador
    return `This action registers a new admin with email ${createAdminDto.email}`;
  }

  selfRegister(createUserSelfRegistrationDto: CreateUserSelfRegistrationDto) {
    // Lógica para el registro propio de un usuario
    return `This action registers a user by self registration with admin email ${createUserSelfRegistrationDto.adminEmail}`;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
