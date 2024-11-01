import { Request } from "express";

export interface LoggedInRequest extends Request {
  userSession: any;
}
