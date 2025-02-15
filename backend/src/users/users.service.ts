import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Hashing } from 'src/auth/hashing';
import { Role } from 'src/common/enums/role.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Simulación temporal de ID de administrador (quemado)
  // private readonly TEMP_ADMIN_ID = '0119b370-0653-4506-98cc-1728aee0b933'; // Reemplazar con un UUID válido

  async create(createUserDto: CreateUserDto, adminId?: string) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await Hashing.hashPassword(createUserDto.password);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      role: Role.USER,
      adminId: adminId,
    };
    const userEntity = this.userRepository.create(userData);
    await this.userRepository.save(userEntity);

    return {
      email: userData.email,
      message: 'Administrador creado correctamente',
    };
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAdminByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email, role: Role.ADMIN },
    });
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Si viene password, lo hasheamos
    if (updateUserDto.password) {
      updateUserDto.password = await argon.hash(updateUserDto.password);
    }

    return await this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
