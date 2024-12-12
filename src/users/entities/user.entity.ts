import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table, DataType } from 'sequelize-typescript';
interface UserCreation {
  username: string;
  login: string;
  password: string;
}

@Table({
  tableName: 'Users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model<User, UserCreation> {
  @ApiProperty({ example: 1, description: 'Unique id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Ilya', description: 'Username' })
  @Column({ type: DataType.STRING })
  username: string;

  @ApiProperty({ example: 'myEmail.com', description: 'User email' })
  @Column({ type: DataType.STRING })
  login: string;

  @ApiProperty({ example: 'myPassword', description: 'User password' })
  @Column({ type: DataType.STRING, unique: true })
  password: string;
}
