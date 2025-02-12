import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: 'user' })
  role: 'admin' | 'user';

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Relación con admin (self-referencing)
  @ManyToOne(() => User, (user) => user.admins, { onDelete: 'SET NULL' })
  admin: User;

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
