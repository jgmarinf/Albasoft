import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { RegisterAdminDto } from './dto/register-admin-dto';
import { RegisterUserDto } from './dto/register-user-dto';
import { Hashing } from './hashing';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const user = await this.usersService.findOneByEmail(registerAdminDto.email);
    if (user) {
      throw new BadRequestException('El correo ya está registrado');
    }
    if (registerAdminDto.claveSecreta !== 'camilogruñon') {
      throw new UnauthorizedException('La clave secreta no es correcta');
    }
    const hashedPassword = await Hashing.hashPassword(
      registerAdminDto.password,
    );
    const userData = {
      ...registerAdminDto,
      password: hashedPassword,
      role: 'admin' as const,
    };
    return await this.usersService.create(userData);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.findOneByEmail(registerUserDto.email);
    if (user) {
      throw new BadRequestException('El correo ya está registrado');
    }
    const hashedPassword = await Hashing.hashPassword(registerUserDto.password);
    // Buscar al administrador por su email
    const admin = await this.usersService.findAdminByEmail(
      registerUserDto.adminEmail,
    );

    if (!admin) {
      throw new UnauthorizedException(
        'El correo proporcionado no pertenece a un administrador',
      );
    }

    const userData = {
      ...registerUserDto,
      password: hashedPassword,
      role: 'user' as const,
      admin: { id: admin.id }, // Asignar la relación con el admin
    };

    return await this.usersService.create(userData);
  }
}
