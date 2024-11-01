import { NextFunction, Request, Response } from "express";
import {
  sendData,
  sendError,
  sendUnexpectError,
  hashPassword,
  getClientIP,
  generateUUID,
} from "../utils/utils";
import { pool } from "./db_connect";
import { TablesName, ErrorCodes, UserRoles } from "../models/enums";
import { IUser } from "../models/interfaces";
import { SESSION_COOKIE_KEY } from "../models/constants";
import { loginSchema, resetPassword, changePasswordSchema } from "../models/validations";
import { LoggedInRequest } from "../types/LoggedInRequest";
import consola from "consola";
import dotenv from "dotenv";
import { sendMailAsync } from "./mail_handler";
dotenv.config();

/**
 * Create a new user session, store it to database and send sessionId back through response object
 * @param req Uers's request object
 * @param res Response object
 * @param user User object. Information of the logging in user
 */

async function createNewUserLoginSession(req: Request, res: Response, user: IUser) {
  //create a new session and return session-id back to the client
  const sessionDurationInSeconds = parseInt(process.env.SESSION_DURATION || "604800");
  const sessionExpireDate = new Date(Date.now() + sessionDurationInSeconds * 1000);
  const sessionId = generateUUID(user.email + Date.now());
  const clientIP = getClientIP(req);
  // * Data that will be use for the session.
  const sessionData = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    profile: user.profile,
    email: user.email,
    role: user.role,
    user_lock: user.user_lock,
    user_archive: user.user_archive,
  };
  // store session into database
  const sql = `INSERT INTO ${TablesName.UserSessions} VALUES ($1, $2, $3, $4, $5, $6)`;
  await pool.query(sql, [sessionId, user.id, clientIP, sessionData, new Date(), sessionExpireDate]);
  //store session data into cache
  res.cookie(SESSION_COOKIE_KEY, sessionId, {
    httpOnly: true,
    expires: sessionExpireDate,
    secure: process.env.NODE_ENV !== "development",
  });
  sendData(res, sessionData);
}

//Check user permission
export function checkUserWithPermission(permissions: string[]) {
  return async function (req: LoggedInRequest, res: Response, next: NextFunction) {
    // Extract the session ID from the request cookies
    const sessionId: string = req.cookies[SESSION_COOKIE_KEY];
    const currentDate = new Date();
    let sql = `SELECT * FROM ${TablesName.UserSessions} WHERE session_id=$1`;
    const userLoginSessionData = await pool.query(sql, [sessionId]);
    if (userLoginSessionData.rowCount > 0) {
      const userLoginSession = userLoginSessionData.rows[0];
      const userExpiredAt = userLoginSession.expired_at;
      // Check if the user session has expired
      if (userExpiredAt < currentDate) {
        return sendError(res, ErrorCodes.UnAuthorized, "Session expired! Please login.");
      }
      // If the user does not have the required permission, return an error response and stop further processing
      if (permissions.indexOf(userLoginSession.session_data.role) < 0) {
        return sendError(res, ErrorCodes.UnAuthorized, "Permission denied!");
      }
      req.userSession = userLoginSession;
    } else {
      return sendError(res, ErrorCodes.UnAuthorized, "Session expired! Please login.");
    }
    next();
  };
}
// Check user login
export async function checkUserLogin(req: LoggedInRequest, res: Response, next: NextFunction) {
  // Extract the session ID from the request cookies
  const sessionId: string = req.cookies[SESSION_COOKIE_KEY];
  const currentDate = new Date();
  let sql = `SELECT * FROM ${TablesName.UserSessions} WHERE session_id=$1`;
  const userLoginSessionData = await pool.query(sql, [sessionId]);
  if (userLoginSessionData.rowCount > 0) {
    const userLoginSession = userLoginSessionData.rows[0];
    const userExpiredDate = userLoginSession.expired_at;
    if (userExpiredDate <= currentDate) {
      return sendError(res, ErrorCodes.UnAuthorized, "Session expired! Please login.");
    }
    req.userSession = userLoginSession;
  } else {
    return sendError(res, ErrorCodes.UnAuthorized, "Session expired! Please login.");
  }
  next();
}

//
// export async function checkLevelThreeAndTwo () {
//   await checkUserWithPermission([UserRoles.Admin, UserRoles.Standard]);
// }
export function checkLevelThreeAndTwo() {
  return checkUserWithPermission([UserRoles.LevelThree, UserRoles.LevelTwo]);
}
// Get generate link
export async function generateLinkHandler(req: Request, res: Response) {
  let data: any;
  try {
    data = await resetPassword.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.BadRequest, "Cannot generate link.");
  }
  const { email } = data;
  try {
    let sql = `SELECT * FROM ${TablesName.Users} WHERE email=$1`;
    let dbRes = await pool.query(sql, [email]);
    const userQueryRows = dbRes.rows[0];
    const verificationId = generateUUID(email + Date.now());

    const url = `${process.env.VERFICATION_URL}?verificationID=${verificationId}`;

    //insert into reset password table
    if (userQueryRows) {
      const userId = userQueryRows.id;
      const sql = `INSERT INTO ${TablesName.ResetPassWords} VALUES ($1, $2)`;
      await pool.query(sql, [verificationId, userId]);
      sendData(res, url);
    }
  } catch (ex) {
    consola.error(ex);
    sendUnexpectError(res);
  }
}

// Change password
export async function changePassword(req: Request, res: Response) {
  let data: any;
  try {
    data = await changePasswordSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.BadRequest, "Cannot change password.");
  }
  const { new_password, verification_id } = data;
  try {
    let sql = `SELECT user_id FROM ${TablesName.ResetPassWords} WHERE id=$1 AND expired_at>$2`;
    let userSelectResult = await pool.query(sql, [verification_id, new Date()]);

    if (userSelectResult.rowCount === 0) {
      return sendError(res, ErrorCodes.ResourceExpired, "Link was expired.");
    }

    const user_id = userSelectResult.rows[0].user_id;

    // update password
    sql = `UPDATE ${TablesName.Users} SET password=$1 WHERE id=$2`;
    await pool.query(sql, [hashPassword(new_password), user_id]);

    // delete verification_id from resetPassword table
    sql = `DELETE FROM ${TablesName.ResetPassWords} WHERE id=$1`;
    await pool.query(sql, [verification_id]);

    // update user_session to expired
    sql = `UPDATE ${TablesName.UserSessions} SET expired_at=$1 WHERE user_id=$2 AND expired_at=$1`;
    await pool.query(sql, [new Date(), user_id]);

    return sendData(res, { message: "Password is changed." });
  } catch (ex) {
    consola.error(ex);
    sendUnexpectError(res);
  }
}

// Login
export async function loginHandler(req: Request, res: Response) {
  let data: any;
  try {
    data = await loginSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.EmailDoesNotExist, err);
  }
  const { email, password } = data;
  try {
    sendMailAsync('success',email,'I love you')
    let sql = `SELECT * FROM ${TablesName.Users} WHERE email=$1`;
    const dbRes = await pool.query(sql, [email]);
    if (dbRes.rowCount === 0) {
      sendError(res, ErrorCodes.UserPasswordIncorrect, "Email or password is in correct.");
      return;
    }
    const userRow = dbRes.rows[0];
    // console.log("Get user login data : ", userRow);
    if ((userRow.is_locked || userRow.is_archived) != true) {
      const user: IUser = dbRes.rows[0];
      if (user.password !== hashPassword(password)) {
        sendError(res, ErrorCodes.UserPasswordIncorrect, "Email or password is in correct.");
        return;
      }
      await createNewUserLoginSession(req, res, user);
    } else {
      sendError(res, ErrorCodes.APIError, "Your account have been locked or archived.");
    }
  } catch (ex) {
    consola.error("Error user login", ex);
    sendUnexpectError(res);
  }
}

// Logout
export async function logoutHandler(req: Request, res: Response) {
  const sessionId: string = req.cookies[SESSION_COOKIE_KEY];
  try {
    if (sessionId) {
      const updateSQL = `UPDATE ${TablesName.UserSessions} SET expired_at=$1 WHERE session_id=$2`;
      await pool.query(updateSQL, [new Date(), sessionId]);
    }
    res.clearCookie(SESSION_COOKIE_KEY, { httpOnly: true });
    sendData(res, {
      message: "Log out successful.",
    });
  } catch (ex) {
    consola.error("Error logout a user : ", ex);
    sendUnexpectError(res);
  }
}
