/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateUsersRolesDto } from 'src/users_roles/dto/create-users_role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { role: createRoleDto.role } });
    if (role) {
      throw new ConflictException('Role already exists');
    }
    const newRole = await this.roleRepository.create(createRoleDto);
    return newRole;
  }

  async deleteRole(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException("Role don't found");
    }

    await this.roleRepository.destroy({ where: { id } });
    return { message: 'Role deleted successfully' };
  }

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();
    if (!roles) {
      throw new NotFoundException("Roles don't found");
    }
    return roles;
  }

  async getRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException("Role don't found");
    }
    return role;
  }

  async updateRole(updateRoleDto: UpdateRoleDto, id: number): Promise<Role> {
    const currentRole = await this.roleRepository.findOne({ where: { id } });
    if (!currentRole) {
      throw new NotFoundException("Role don't found");
    }
    await this.roleRepository.update(updateRoleDto, { where: { id } });
    const newRole = await this.roleRepository.findOne({ where: { id } });
    return newRole;
  }
  async getIdRolesByName(createUsersRolesDto: CreateUsersRolesDto): Promise<number[]> {
    const idRoles: number[] = [];
    for (const name of createUsersRolesDto.roles) {
      const role = await this.roleRepository.findOne({ where: { role: name } });
      if (!role) {
        throw new NotFoundException("Role don't found");
      }
      idRoles.push(role.id);
    }
    return idRoles;
  }
}
