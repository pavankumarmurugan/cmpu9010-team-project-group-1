export type JwtPayload = {
  sub: string;
  data: {
    role: string;
  };
  token: string;
};
