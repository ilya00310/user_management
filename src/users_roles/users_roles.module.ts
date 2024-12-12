import { forwardRef, Module } from '@nestjs/common';
import { UsersRolesService } from './users_roles.service';
import { UsersRolesController } from './users_roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersRoles } from './entities/users_role.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersRolesController],
  providers: [UsersRolesService],
  imports: [SequelizeModule.forFeature([UsersRoles]), forwardRef(() => RolesModule)],
  exports: [UsersRolesService],
})
export class UsersRolesModule {}
