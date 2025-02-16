import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enum';
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
    if (registerAdminDto.claveSecreta !== 'camilogruñon') {
      throw new UnauthorizedException('La clave secreta no es correcta');
    }
    const userData = {
      ...registerAdminDto,
      role: Role.ADMIN,
    };
    await this.usersService.create(userData);
    return {
      email: registerAdminDto.email,
      message: 'Administrador creado correctamente',
    };
  }

  async registerUser(registerUserDto: RegisterUserDto) {
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
      admin: { id: admin.id }, // Asignar la relación con el admin
    };

    await this.usersService.create(userData);
    return {
      email: registerUserDto.email,
      message: 'Usuario creado correctamente',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
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
