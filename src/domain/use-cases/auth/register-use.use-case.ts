import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { AuthRepository } from '../../repositories/auth.repository';

interface UserToken {
  token: string,
  user: {
    id: string,
    name: string,
    email: string
  }
}

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {
  private readonly authRepository: AuthRepository;
  private readonly signToken: SignToken;
  
  constructor(authRepository: AuthRepository, signToken: SignToken = JwtAdapter.generateToken) {
    this.authRepository = authRepository;
    this.signToken = signToken;
  }

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDto);
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