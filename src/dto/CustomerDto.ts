import { IsEmail, IsEmpty, Length, IsString } from "class-validator";

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;

  @Length(6, 20)
  phone: string;
}

export interface CustomerPayload {
  _id: string;
  verified: boolean;
  email: string;
}

export class LoginInput {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}

export class ProfileInput {
  @Length(5, 40)
  firstName: string;

  @Length(5, 40)
  lastName: string;

  @Length(5, 100)
  address: string;
}
