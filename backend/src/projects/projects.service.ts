import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, adminId: string) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      admin: { id: adminId },
    });
    return await this.projectRepository.save(project);
  }

  /*   async findAdminProjects(adminId: string) {
    return this.projectRepository.find({
      where: { admin: { id: adminId } },
      relations: ['users', 'tasks'],
    });
  }

  async findUserProjects(userId: string) {
    return this.projectRepository.find({
      where: { users: { id: userId } },
      relations: ['admin', 'tasks'],
    });
  } */

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: string) {
    return `This action removes a #${id} project`;
  }
}
