import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL_PORT,
      autoLoadEntities: true,
    }),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
