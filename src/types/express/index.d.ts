declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      is_admin: boolean;
    };
  }
}
