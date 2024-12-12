import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}
  async createUser(createUserDto: CreateUserDto): Promise<object> {
    const { password } = createUserDto;
    const error = { success: false, errors: [] };
    const RegexCapitalLiteral = /^(?=.*[A-Z]).+$/;
    const RegexNumberLiteral = /^(?=.*\d).+$/;
    if (!RegexCapitalLiteral.test(password)) {
      error.errors.push("Password don't have capital literal");
    }
    if (!RegexNumberLiteral.test(password)) {
      error.errors.push("Password don't have number literal");
    }
    if (error.errors.length > 0) {
      throw new BadRequestException({
        code: 400,
        error: error,
      });
    }
    const user = await this.userRepository.findOne({ where: { password } });
    if (user) {
      throw new ConflictException('User already exist');
    }
    await this.userRepository.create(createUserDto);
    return { success: true };
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    if (!users) {
      throw new NotFoundException("Users don't found");
    }
    return users;
  }

  async deleteUser(id: number): Promise<object> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User don't found");
    }
    await this.userRepository.destroy({ where: { id } });
    return { message: 'Role deleted successfully' };
  }

  async updateUser(updateRoleDto: UpdateUserDto, id: number): Promise<User> {
    const currentUser = await this.userRepository.findOne({ where: { id } });
    if (!currentUser) {
      throw new NotFoundException("User don't found");
    }
    await this.userRepository.update(updateRoleDto, { where: { id } });
    const newUser = await this.userRepository.findOne({ where: { id } });
    return newUser;
  }
}
