import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateUsersRolesDto {
  @ApiProperty({ example: ['Admin', 'Employees'], description: 'Roles for user', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly roles: string[];
}
