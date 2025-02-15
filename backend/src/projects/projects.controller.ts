import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req()
    req: Request & { user: { sub: string; email: string; role: string } },
  ) {
    console.log(req.user);
    return this.projectsService.create(createProjectDto, req.user.sub);
  }

  /*   @Get('admin')
  @Roles('admin')
  async getAdminProjects(@CurrentUser() user: User) {
    console.log(user);
    return this.projectsService.findAdminProjects(user.id);
  }

  @Get('user')
  @Roles('user')
  async getUserProjects(@CurrentUser() user: User) {
    return this.projectsService.findUserProjects(user.id);
  } */

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
