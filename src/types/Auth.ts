export type JwtPayload = {
  id: string;
  email: string;
};

export type RequestWithPayload = {
  user?: JwtPayload;
};

export type RequestWithUser = {
  user: JwtPayload;
};
