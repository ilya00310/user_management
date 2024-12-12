import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ilya', description: 'Username' })
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'myLogin.com', description: 'User email' })
  @IsString()
  readonly login: string;

  @ApiProperty({ example: 'myPassword123', description: 'User password' })
  @IsString()
  readonly password: string;
}
