import { Request, Response } from 'express';

import { UserModel } from '../../data/mongodb/models/user.model';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { CustomError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from '../../domain';

export class AuthController {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({
        error: error.message
      })
    }
    return res.status(500).json({
      error: 'Internal Server Error'
    })
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if(error) return res.status(400).json({error: error});
    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res))
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if(error) return res.status(400).json({error: error});
    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res))
  }

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then((users) => {
        res.json({
          users,
          token: req.body.payload
        })
      })
      .catch(() => res.status(500).json({error: 'Internal server error'}))
  }
}