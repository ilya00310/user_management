/* eslint-disable prettier/prettier */
import { Post, Body, Controller, Query, Delete, Get, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 200, type: Role })
  @Put()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200, type: Role })
  @Delete()
  deleteRole(@Query('id') id: string) {
    return this.rolesService.delete(Number(id));
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  getRoles() {
    return this.rolesService.getRoles();
  }

  @ApiOperation({ summary: 'Get role' })
  @ApiResponse({ status: 200, type: Role })
  @Get()
  getRole(@Query('id') id: string) {
    return this.rolesService.getRole(Number(id));
  }

  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, type: Role })
  @Post()
  changeRole(@Query('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.changeRole(updateRoleDto, Number(id));
  }
}
