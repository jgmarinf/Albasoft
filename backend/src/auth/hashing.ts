import * as bcrypt from 'bcryptjs';

export class Hashing {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async verifyPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(hash, password);
  }
}
