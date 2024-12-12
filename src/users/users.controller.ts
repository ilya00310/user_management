/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Query, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUsersRolesDto } from '../users_roles/dto/create-users_role.dto';
import { UsersRolesService } from '../users_roles/users_roles.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersRolesService: UsersRolesService,
  ) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200 })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Delete users' })
  @ApiResponse({ status: 200, type: User })
  @Delete()
  deleteUser(@Query('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }

  @ApiOperation({ summary: 'Update users' })
  @ApiResponse({ status: 200, type: User })
  @Patch()
  updateUser(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, Number(id));
  }

  @ApiOperation({ summary: 'Update users roles' })
  @ApiResponse({ status: 200, type: User })
  @Patch('/usersRoles')
  updateUserRoles(@Query('id') id: string, @Body() updateUserDto: CreateUsersRolesDto) {
    return this.usersRolesService.updateUsersRoles(updateUserDto, Number(id));
  }
}
