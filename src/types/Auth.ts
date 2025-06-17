export enum Role {
  User = 'user',
  Admin = 'admin',
}

export type JwtPayload = {
  id: string;
  email: string;
  roles: Role[];
};

export type RequestWithPayload = {
  user?: JwtPayload;
};

export type RequestWithUser = {
  user: JwtPayload;
};
