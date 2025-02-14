import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { LoginDto } from './dto/login-dto';
import { RegisterAdminDto } from './dto/register-admin-dto';
import { RegisterUserDto } from './dto/register-user-dto';
import { Hashing } from './hashing';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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
    await this.usersService.create(userData);
    return {
      email: registerAdminDto.email,
      message: 'Administrador creado correctamente',
    };
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

    await this.usersService.create(userData);
    return {
      email: registerUserDto.email,
      message: 'Usuario creado correctamente',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('El correo no es valido');
    }
    const isPasswordValid = await Hashing.verifyPassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña no es correcta');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }
}
