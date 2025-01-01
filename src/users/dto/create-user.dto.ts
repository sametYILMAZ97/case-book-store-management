import { IsString, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
