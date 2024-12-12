/* eslint-disable prettier/prettier */
import { Post, Body, Controller, Query, Delete, Get, Patch } from '@nestjs/common';
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
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200, type: String })
  @Delete()
  deleteRole(@Query('id') id: string) {
    return this.rolesService.deleteRole(Number(id));
  }

  @ApiOperation({ summary: 'Get role' })
  @ApiResponse({ status: 200, type: [Role] })
  @Get('/id')
  getRole(@Query('id') id: string) {
    return this.rolesService.getRole(Number(id));
  }

  @ApiOperation({ summary: 'Get roles' })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  getRoles() {
    return this.rolesService.getRoles();
  }

  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, type: Role })
  @Patch()
  UpdateRole(@Query('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(updateRoleDto, Number(id));
  }
}
