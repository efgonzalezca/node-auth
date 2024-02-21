export class UserEntity {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public roles: string[];
  public img?: string;

  constructor(id: string, name: string, email: string, password: string, roles: string[], img?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.img = img;
  }
}