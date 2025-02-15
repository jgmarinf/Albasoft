import { ForbiddenException, Injectable } from '@nestjs/common';
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
    });
  }

  async findUserProjects(userId: string) {
    return this.projectRepository.find({
      where: { users: { id: userId } },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: string) {
    return `This action removes a #${id} project`;
  }
}
