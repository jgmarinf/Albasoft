import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.projectsService.create(createProjectDto, req.user.sub);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  async getAdminProjects(
    @Req()
    req: Request & { user: { sub: string; email: string; role: string } },
  ) {
    return this.projectsService.findAdminProjects(req.user.sub);
  }

  @Get('user')
  @Roles(Role.USER)
  async getUserProjects(
    @Req()
    req: Request & { user: { sub: string; email: string; role: string } },
  ) {
    return this.projectsService.findUserProjects(req.user.sub);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.projectsService.remove(id, req.user.sub);
  }
}
