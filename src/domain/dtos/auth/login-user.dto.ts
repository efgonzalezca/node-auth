import { Validators } from '../../../config';

export class LoginUserDto {
  public email: string;
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static create( object: { [ key: string ]: any; } ): [ string?, LoginUserDto?] {
    const { email, password } = object;
    if (!email) return ['Missing email'];
    if (!Validators.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password too short'];
    return [
      undefined,
      new LoginUserDto(email, password)
    ];
  }
}