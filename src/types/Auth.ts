export type JwtPayload = {
  id: string;
  email: string;
};

export type RequestWithPayload = {
  user?: JwtPayload;
};
