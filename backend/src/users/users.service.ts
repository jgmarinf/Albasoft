import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
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

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await Hashing.hashPassword(createUserDto.password);
    const userData = {
      role: Role.USER,
      ...createUserDto,
      password: hashedPassword,
    };
    const userEntity = this.userRepository.create(userData);
    await this.userRepository.save(userEntity);

    return {
      email: userData.email,
      message: 'Usuario creado correctamente',
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

  async findAll(adminId: string) {
    return await this.userRepository.find({
      where: { admin: { id: adminId } },
    });
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto, adminId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['admin'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el usuario pertenece al admin
    if (user.admin?.id !== adminId) {
      throw new ForbiddenException(
        'No tienes permisos para editar este usuario',
      );
    }

    // Validar email único si se está actualizando
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('El correo ya está registrado');
      }
    }

    // Limpiar y validar campos
    const cleanData: Partial<User> = {};

    if (updateUserDto.name !== undefined) {
      const trimmedName = updateUserDto.name.trim();
      cleanData.name = trimmedName || user.name;
    }

    if (updateUserDto.email !== undefined) {
      const trimmedEmail = updateUserDto.email.trim();
      cleanData.email = trimmedEmail || user.email;
    }

    if (updateUserDto.password) {
      cleanData.password = await Hashing.hashPassword(updateUserDto.password);
    }

    await this.userRepository.update(id, cleanData);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string, adminId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['admin'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el usuario pertenece al admin que intenta eliminarlo
    if (user.admin?.id !== adminId) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este usuario',
      );
    }

    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado correctamente' };
  }
}
