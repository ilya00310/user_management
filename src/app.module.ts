import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { UsersRolesModule } from './users_roles/users_roles.module';
import { UsersRoles } from './users_roles/entities/users_role.entity';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [Role, User, UsersRoles],
      autoLoadModels: true,
    }),
    RolesModule,
    UsersModule,
    UsersRolesModule,
  ],
})
export class AppModule {}
