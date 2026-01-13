export interface IData {
  username: string;
  email: string;
  password: string;
  name: string;
  userType?: string;
}


export interface ILoginData {
  identifier: string;
  password: string;
}

export interface ISignup {
  formData: IData;
}

export interface ILogin {
  formData: ILoginData
}