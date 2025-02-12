import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashing } from '../auth/hashing';
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

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await Hashing.hashPassword(createUserDto.password);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      role: 'user' as const,
    };
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const hashedPassword = await Hashing.hashPassword(createAdminDto.password);
    const userData = {
      ...createAdminDto,
      password: hashedPassword,
      role: 'admin' as const,
    };
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async selfRegister(
    createUserSelfRegistrationDto: CreateUserSelfRegistrationDto,
  ) {
    const hashedPassword = await Hashing.hashPassword(
      createUserSelfRegistrationDto.password,
    );
    // Buscar al administrador por su email
    const admin = await this.userRepository.findOne({
      where: {
        email: createUserSelfRegistrationDto.adminEmail,
        role: 'admin',
      },
    });

    if (!admin) {
      throw new UnauthorizedException(
        'El correo proporcionado no pertenece a un administrador',
      );
    }

    const userData = {
      ...createUserSelfRegistrationDto,
      password: hashedPassword,
      role: 'user' as const,
      admin: { id: admin.id }, // Asignar la relación con el admin
    };

    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
