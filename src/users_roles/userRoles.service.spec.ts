import { Test, TestingModule } from '@nestjs/testing';
import { UsersRolesService } from './users_roles.service';
import { RolesService } from '../roles/roles.service';
import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { CreateUsersRolesDto } from './dto/create-users_role.dto';

type TestUsersRoles = {
  id: number;
  role_id: number;
  user_id: number;
};
interface UsersRolesRepository {
  findAll: (options: any) => Promise<TestUsersRoles[]>;
  destroy: (options: any) => Promise<number>;
  bulkCreate: (roles: { role_id: number; user_id: number }[]) => Promise<TestUsersRoles[]>;
}

interface RolesRepository {
  getIdRolesByName: (roles: string[]) => Promise<number[]>;
}

describe('UsersRolesService', () => {
  let usersRolesService: UsersRolesService;
  let mockUsersRolesRepository: jest.Mocked<UsersRolesRepository>;
  let mockRolesService: jest.Mocked<RolesRepository>;

  beforeEach(async () => {
    mockUsersRolesRepository = {
      findAll: jest.fn(),
      destroy: jest.fn(),
      bulkCreate: jest.fn(),
    };
    mockRolesService = {
      getIdRolesByName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRolesService,
        { provide: 'UsersRolesRepository', useValue: mockUsersRolesRepository },
        { provide: RolesService, useValue: mockRolesService }, // Добавляем mock для RolesService
      ],
    }).compile();

    usersRolesService = module.get<UsersRolesService>(UsersRolesService);
  });

  it('should be defined', () => {
    expect(usersRolesService).toBeDefined();
  });

  describe('updateUsersRoles', () => {
    it('success: update roles for user', async () => {
      const user_id = 1;
      const updateUsersRolesDto: CreateUsersRolesDto = {
        roles: ['Admin', 'Editor'],
      };
      const idRoles = [1, 2];

      const userRolesInDb = [
        { id: 1, role_id: 1, user_id: 1 },
        { id: 2, role_id: 3, user_id: 1 },
      ];

      mockUsersRolesRepository.findAll.mockResolvedValue(userRolesInDb);
      mockUsersRolesRepository.destroy.mockResolvedValue(1);
      mockUsersRolesRepository.bulkCreate.mockResolvedValue([{ id: 3, role_id: 2, user_id: 1 }]);
      mockRolesService.getIdRolesByName.mockResolvedValue(idRoles);

      const result = await usersRolesService.updateUsersRoles(updateUsersRolesDto, user_id);

      expect(result).toEqual({ success: true });

      expect(mockRolesService.getIdRolesByName).toHaveBeenCalledWith(updateUsersRolesDto);

      expect(mockUsersRolesRepository.destroy).toHaveBeenCalledWith({
        where: { user_id, role_id: [3] },
      });

      expect(mockUsersRolesRepository.bulkCreate).toHaveBeenCalledWith([{ role_id: 2, user_id }]);
    });
    it('success: no roles to update', async () => {
      const user_id = 1;
      const updateUsersRolesDto: CreateUsersRolesDto = {
        roles: ['Admin'],
      };
      const idRoles = [1];

      const userRolesInDb = [{ id: 1, role_id: 1, user_id: 1 }];
      mockUsersRolesRepository.findAll.mockResolvedValue(userRolesInDb);
      mockUsersRolesRepository.destroy.mockResolvedValue(0);
      mockUsersRolesRepository.bulkCreate.mockResolvedValue([]);
      mockRolesService.getIdRolesByName.mockResolvedValue(idRoles);

      const result = await usersRolesService.updateUsersRoles(updateUsersRolesDto, user_id);

      expect(result).toEqual({ success: true });

      expect(mockRolesService.getIdRolesByName).toHaveBeenCalledWith(updateUsersRolesDto);

      expect(mockUsersRolesRepository.destroy).not.toHaveBeenCalled();

      expect(mockUsersRolesRepository.bulkCreate).not.toHaveBeenCalled();
    });
  });
});
