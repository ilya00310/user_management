import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersRoles } from './entities/users_role.entity';
import { RolesService } from '../roles/roles.service';
import { CreateUsersRolesDto } from './dto/create-users_role.dto';

@Injectable()
export class UsersRolesService {
  constructor(
    @InjectModel(UsersRoles) private usersRolesRepository: typeof UsersRoles,
    private rolesRepository: RolesService,
  ) {}

  async updateUsersRoles(updateUsersRolesDto: CreateUsersRolesDto, user_id: number) {
    const idRoles = await this.rolesRepository.getIdRolesByName(updateUsersRolesDto);
    await this.deleteIncorrectUser(idRoles, user_id);
    await this.insertRoles(idRoles, user_id);
    return { success: true };
  }
  async deleteIncorrectUser(idRoles: number[], user_id: number) {
    const usersRoles = await this.usersRolesRepository.findAll({ where: { user_id } });
    const currentRolesId = usersRoles.map(userRole => userRole.role_id);
    const rolesToDelete = currentRolesId.filter(roleId => !idRoles.includes(roleId));
    if (rolesToDelete.length > 0) {
      await this.usersRolesRepository.destroy({
        where: { user_id, role_id: rolesToDelete },
      });
    }
  }
  async insertRoles(idRoles: number[], user_id: number) {
    const usersRoles = await this.usersRolesRepository.findAll({ where: { user_id } });

    const currentRoleIds = usersRoles.map(userRole => userRole.role_id);

    const rolesToAdd = idRoles.filter(roleId => !currentRoleIds.includes(roleId));

    if (rolesToAdd.length > 0) {
      const newUserRoles = rolesToAdd.map(roleId => ({ role_id: roleId, user_id }));

      await this.usersRolesRepository.bulkCreate(newUserRoles);
    }
  }
}
