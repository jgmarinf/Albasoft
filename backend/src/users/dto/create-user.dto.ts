export class CreateUserDto {
  name: string;

  email: string;

  password: string;

  role: 'admin' | 'user';

  admin?: { id: string };
}
