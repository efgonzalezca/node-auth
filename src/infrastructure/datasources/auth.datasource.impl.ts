import { UserModel } from '../../data/mongodb/models/user.model';
import { AuthDatasource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { BcryptAdapter } from '../../config/bcrypt';
import { UserMapper } from '../mappers/user.mapper';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {
  private readonly hashPassword: HashFunction;
  private readonly comparePassword: CompareFunction;
  
  constructor(hashPassword: HashFunction = BcryptAdapter.hash, comparePassword: CompareFunction = BcryptAdapter.compare) {
    this.hashPassword = hashPassword;
    this.comparePassword = comparePassword;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    try {
      const user = await UserModel.findOne({email: email});
      if(!user) throw CustomError.badRequest('User does not exists');
      const isMatching = this.comparePassword(password, user.password);
      if(!isMatching) throw CustomError.badRequest('Password is not valid');
      return UserMapper.userEntityFromObject(user);
    } catch(error) {
      if(error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;
    try {
      const exists = await UserModel.findOne({email: email});
      if(exists) throw CustomError.badRequest('User already exists');
      const user = await UserModel.create({
        name: name,
        email: email,
        password: this.hashPassword(password)
      })
      await user.save();
      return UserMapper.userEntityFromObject(user);
    } catch(error) {
      if(error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}