export interface IUsers {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isConfirmed: boolean;
  confirmationCode: string;
}
