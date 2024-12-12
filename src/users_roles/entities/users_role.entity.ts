import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table, DataType } from 'sequelize-typescript';
interface UsersRolesCreation {
  role_id: number;
  user_id: number;
}

@Table({
  tableName: 'Users_roles',
  timestamps: false,
})
export class UsersRoles extends Model<UsersRoles, UsersRolesCreation> {
  @ApiProperty({ example: 1, description: 'Unique id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 3, description: 'Role id' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id: number;

  @ApiProperty({ example: 2, description: 'User id' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;
}
