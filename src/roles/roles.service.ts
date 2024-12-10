/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(createRoleDto);
    return role;
  }

  async delete(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id, deleted_at: null } });
    if (!role) {
      throw new NotFoundException("Role don't fount");
    }
    await this.roleRepository.update({ deleted_at: new Date(Date.now()) }, { where: { id } });
    return role;
  }

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll({ where: { deleted_at: null } });
    if (!roles) {
      throw new NotFoundException("Role don't fount");
    }
    return roles;
  }

  async getRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id, deleted_at: null } });
    if (!role) {
      throw new NotFoundException("Role don't fount");
    }
    return role;
  }

  async changeRole(updateRoleDto: UpdateRoleDto, id: number): Promise<Role> {
    const { role } = updateRoleDto;
    const currentRole = await this.roleRepository.findOne({ where: { id, deleted_at: null } });
    if (!currentRole) {
      throw new NotFoundException("Role don't fount");
    }
    await this.roleRepository.update({ role }, { where: { id, deleted_at: null } });
    const newRole = await this.roleRepository.findOne({ where: { id, deleted_at: null } });
    return newRole;
  }
}
