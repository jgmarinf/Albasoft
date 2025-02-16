import { Role } from 'src/common/enums/role.enum';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false })
  password: string;

  // Relación con admin (self-referencing)
  @ManyToOne(() => User, (admin) => admin.admins, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User | null;
  @OneToMany(() => User, (user) => user.admin, { onDelete: 'CASCADE' })
  admins: User[];

  // Relación muchos a muchos con proyectos
  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable({
    name: 'users_projects',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'project_id' },
  })
  projects: Project[];
}
