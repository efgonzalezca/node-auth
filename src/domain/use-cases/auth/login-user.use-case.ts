import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';

interface UserToken {
  token: string,
  user: {
    id: string,
    name: string,
    email: string
  }
}

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {
  private readonly authRepository: AuthRepository;
  private readonly signToken: SignToken;
  
  constructor(authRepository: AuthRepository, signToken: SignToken = JwtAdapter.generateToken) {
    this.authRepository = authRepository;
    this.signToken = signToken;
  }

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDto);
    const token = await this.signToken({id: user.id}, '2h');
    if(!token) throw CustomError.internalServer('Error generating token');
    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  }
}