import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, adminId: string) {
    if (createProjectDto.usersIds && createProjectDto.usersIds.length > 0) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.admin', 'admin')
        .where('user.id IN (:...ids)', { ids: createProjectDto.usersIds })
        .getMany();
      const invalidUsers = users.filter((user) => user.admin?.id !== adminId);

      if (invalidUsers.length > 0) {
        throw new ForbiddenException(
          'No puedes agregar usuarios que no te pertenecen',
        );
      }
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      admin: { id: adminId },
      users: createProjectDto.usersIds?.map((id) => ({ id })) || [],
    });

    return await this.projectRepository.save(project);
  }

  async findAdminProjects(adminId: string) {
    return this.projectRepository.find({
      where: { admin: { id: adminId } },
      relations: ['users'],
    });
  }

  async findUserProjects(userId: string) {
    return this.projectRepository.find({
      where: { users: { id: userId } },
      relations: ['users'],
    });
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    adminId: string,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'admin'],
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (project.admin.id !== adminId) {
      throw new ForbiddenException('No eres el administrador de este proyecto');
    }

    // Actualizar campos básicos
    if ('name' in updateProjectDto) {
      const newName = updateProjectDto.name?.trim();
      if (newName) {
        project.name = newName;
      }
    }

    if ('description' in updateProjectDto) {
      const newDescription = updateProjectDto.description?.trim();
      project.description = newDescription || null;
    }

    // Manejo de usuarios
    if (updateProjectDto.usersIds !== undefined) {
      const newUsersIds = updateProjectDto.usersIds || [];
      const currentUsersIds = project.users.map((u) => u.id);

      // Validar nuevos usuarios
      const usersToAdd = await this.validateUsers(newUsersIds, adminId);

      // Eliminar usuarios removidos
      const usersToRemove = project.users.filter(
        (user) => !newUsersIds.includes(user.id),
      );

      // Actualizar relaciones
      project.users = [
        ...project.users.filter((user) => newUsersIds.includes(user.id)),
        ...usersToAdd.filter((user) => !currentUsersIds.includes(user.id)),
      ];

      // Guardar cambios
      await this.projectRepository.save(project);

      // Eliminar relaciones removidas
      if (usersToRemove.length > 0) {
        await this.projectRepository
          .createQueryBuilder()
          .relation(Project, 'users')
          .of(project)
          .remove(usersToRemove);
      }
    }

    return this.projectRepository.save(project);
  }

  private async validateUsers(userIds: string[], adminId: string) {
    if (userIds.length === 0) return [];

    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.admin', 'admin')
      .where('user.id IN (:...ids)', { ids: userIds })
      .getMany();

    const invalidUsers = users.filter((user) => user.admin?.id !== adminId);
    if (invalidUsers.length > 0) {
      throw new ForbiddenException(
        'No puedes agregar usuarios que no te pertenecen',
      );
    }

    return users;
  }

  async remove(id: string, adminId: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['admin'],
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (project.admin.id !== adminId) {
      throw new ForbiddenException('No eres el administrador de este proyecto');
    }

    return this.projectRepository.remove(project);
  }
}
