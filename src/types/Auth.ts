export type Role = 'user' | 'admin';

export type JwtPayload = {
  id: string;
  email: string;
  role: Role;
};

export type RequestWithPayload = {
  user?: JwtPayload;
};

export type RequestWithUser = {
  user: JwtPayload;
};
