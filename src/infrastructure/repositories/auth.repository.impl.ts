import { LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthDatasource } from '../../domain/datasources/auth.datasource';

export class AuthRepositoryImpl implements AuthRepository {
  private readonly authDatasource: AuthDatasource;

  constructor(authDatasource: AuthDatasource) {
    this.authDatasource = authDatasource;
  }
  
  login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.authDatasource.login(loginUserDto);
  }

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDatasource.register(registerUserDto);
  }
}