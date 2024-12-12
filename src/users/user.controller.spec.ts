import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUsersRolesDto } from '../users_roles/dto/create-users_role.dto';
import { UsersRolesService } from '../users_roles/users_roles.service';
describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;
  let usersRolesService: UsersRolesService;

  const mockUsersService = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };
  const mockUsersRolesService = {
    updateUsersRoles: jest.fn(),
    deleteIncorrectUser: jest.fn(),
    insertRoles: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: UsersRolesService, useValue: mockUsersRolesService },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    usersRolesService = module.get<UsersRolesService>(UsersRolesService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should create a user', async () => {
    const newUser: CreateUserDto = { username: 'Ilya', login: 'myEmail@.com', password: 'MyPassword123' };
    await userController.createUser(newUser);
    expect(userService.createUser).toHaveBeenCalledWith(newUser);
  });
  it('should delete a user', async () => {
    const idUser: string = '1';
    await userController.deleteUser(idUser);
    expect(userService.deleteUser).toHaveBeenCalledWith(Number(idUser));
  });
  it('should update a user', async () => {
    const updateUserInfo: UpdateUserDto = { username: 'Vlad', login: 'newEmail@.com' };
    const idUser: string = '1';
    await userController.updateUser(idUser, updateUserInfo);
    expect(userService.updateUser).toHaveBeenCalledWith(updateUserInfo, Number(idUser));
  });
  it('should update roles a user', async () => {
    const rolesForUserUpdate: CreateUsersRolesDto = { roles: ['Admin', 'Operator'] };
    const idUser: string = '2';
    await userController.updateUserRoles(idUser, rolesForUserUpdate);
    expect(usersRolesService.updateUsersRoles(rolesForUserUpdate, Number(idUser)));
  });
});
