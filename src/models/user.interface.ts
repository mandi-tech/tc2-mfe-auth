export interface BodyUser {
  username: string;
  email: string;
  password: string;
}

export interface BodyUserResp {
  message: string;
  result: {
    username: string;
    email: string;
    password: string;
    id: string;
  };
}

export interface User extends BodyUser {
  id: string;
}

export interface PostUserResp {
  message: string;
  result: User;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserLoginResp {
  message: string;
  result: { token: string };
}
