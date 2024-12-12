import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException } from '@nestjs/common';
type TestUser = {
  id: number;
  username: string;
  login: string;
  password: string;
};
interface UserRepository {
  findOne: (options: any) => Promise<TestUser | null>;
  create: (user: CreateUserDto) => Promise<TestUser>;
  findAll: () => Promise<TestUser[]>;
  destroy: (options: any) => Promise<number>;
  update: (user: UpdateUserDto, options: any) => Promise<[number, TestUser[]]>;
}

describe('UserService', () => {
  let userService: UsersService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: 'UserRepository', useValue: mockUserRepository }],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  describe('Request create user', () => {
    it('success: create a user', async () => {
      const newUser: TestUser = { id: 1, username: 'Ilya', login: 'myEmail.com', password: 'MyPassword123' };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(newUser);
      const result = await userService.createUser({ username: 'Ilya', login: 'myEmail.com', password: 'MyPassword123' });
      expect(result).toEqual({ success: true });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { password: 'MyPassword123' } });
      expect(mockUserRepository.create).toHaveBeenCalledWith({ username: 'Ilya', login: 'myEmail.com', password: 'MyPassword123' });
    });
    it('unsuccess: User already exist', async () => {
      const newUser: TestUser = { id: 1, username: 'Ilya', login: 'myEmail.com', password: 'MyPassword123' };
      mockUserRepository.findOne.mockResolvedValue(newUser);
      await expect(userService.createUser({ username: 'Ilya', login: 'myEmail.com', password: 'MyPassword123' })).rejects.toThrow('User already exist');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { password: 'MyPassword123' } });
    });
    it('unsuccess: incorrect password', async () => {
      const newUser: TestUser = { id: 1, username: 'Ilya', login: 'myEmail.com', password: 'mypassword' };
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(userService.createUser(newUser)).rejects.toThrowError(
        new BadRequestException({ code: 400, error: { success: false, errors: ["Password don't have capital literal", "Password don't have number literal"] } }),
      );
    });
  });
  describe('Request delete user', () => {
    it('success: delete a user', async () => {
      const userId = 1;
      const newUser: TestUser = { id: 1, username: 'Ilya', login: 'myEmail.com', password: 'MyPassword123' };
      mockUserRepository.findOne.mockResolvedValue(newUser);
      mockUserRepository.destroy.mockResolvedValue(1);
      const result = await userService.deleteUser(userId);
      expect(result).toEqual({ message: 'Role deleted successfully' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.destroy).toHaveBeenCalledWith({ where: { id: userId } });
    });
    it("unsuccess: User don't found", async () => {
      const userId = 1;
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(userService.deleteUser(userId)).rejects.toThrow();
    });
  });
  describe('Request update user', () => {
    it('success: update user', async () => {
      const userId = 1;
      const updateUser: UpdateUserDto = { username: 'UpdatedName' };
      const user = { id: 1, username: 'OldName', login: 'emailAddress.com', password: 'Password01' };
      const updatedUser = { ...user, ...updateUser };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue([1, [updatedUser]]);
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(updateUser, userId);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.update).toHaveBeenCalledWith(updateUser, { where: { id: userId } });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
    it("unsuccess: user don't found", async () => {
      const userId = 1;
      const updateUser: UpdateUserDto = { username: 'UpdatedName' };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.updateUser(updateUser, userId)).rejects.toThrow("User don't found");
    });
  });
});
