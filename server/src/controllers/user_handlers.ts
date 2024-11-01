import { Request, Response } from "express";
import { pool } from "./db_connect";
import {
  TablesName,
  ErrorCodes,
  SuccessCodes,
  UserRoles,
} from "../models/enums";
import {
  sendData,
  sendError,
  sendMessage,
  sendUnexpectError,
} from "../utils/utils";
import { LoggedInRequest } from "../types/LoggedInRequest";
import { IUser, ISessionData } from "../models/interfaces";
import { hashPassword } from "../utils/utils";
import { updateField } from "./update_status_field_handlers";

import { createUserSchema, updateUserSchema } from "../models/validations";

// Register user into system
export async function signUpHandler(req: Request, res: Response) {
  let data: any;
  try {
    data = await createUserSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.APIError, err);
  }
  const { first_name, last_name, email, password, role } = data;
  try {
    const sql = `INSERT INTO ${TablesName.Users} (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    // Generate a hashed password
    const hashPass = hashPassword(password);
    const values = [first_name, last_name, email, hashPass, role];
    // Execute the SQL query with the provided values to insert data into Users table.
    await pool.query(sql, values);
    sendMessage(res, SuccessCodes.Created);
  } catch (ex) {
    // Check if email already exist
    if (ex.code === "23505") {
      return sendError(res, ErrorCodes.APIError, "Email is already taken.");
    }
    console.error("Error create a new user", ex);
    sendUnexpectError(res);
  }
}

// Get all users​​ from db
export async function getAllUsers(req: LoggedInRequest, res: Response) {
  const userInfo = req.userSession.session_data;

  try {
    if (userInfo.role !== UserRoles.LevelThree) {
      return sendError(res, ErrorCodes.UnAuthorized, "Permission Denied!");
    }
    // Execute the SQL query to fetch all users' data from the Users table
    const userQueryResult = await pool.query(
      `SELECT id, first_name, last_name, profile, email, role, is_locked, is_archived FROM ${TablesName.Users} ORDER BY id`
    );

    const userQueryRows = userQueryResult.rows;
    sendData(res, userQueryRows);
  } catch (ex) {
    console.error("No user.", ex);
    sendUnexpectError(res);
  }
}

// Update user
export async function updateUser(req: LoggedInRequest, res: Response) {
  let data: any;
  try {
    data = await updateUserSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.APIError, err);
  }
  const { first_name, last_name, email, role, password, new_password } = data;
  const userSession = req.userSession;
  const userRole = userSession.session_data.role;
  const userEmail = userSession.session_data.email;

  // Check if role is not empty
  if (userRole !== "admin" && userEmail !== email) {
    return sendError(res, ErrorCodes.UnAuthorized);
  }
  try {
    let sql = `SELECT * FROM ${TablesName.Users} WHERE email=$1`;
    let values = [email];
    const userQueryResult = await pool.query(sql, values);
    if (userQueryResult.rowCount === 0) {
      return sendError(res, ErrorCodes.UserNotFound);
    }
    const user: IUser = userQueryResult.rows[0];
    if (password) {
      const hashPass = hashPassword(password);
      if (hashPass !== user.password) {
        return sendError(res, ErrorCodes.UserPasswordIncorrect);
      }
    }
    sql = `UPDATE ${TablesName.Users} SET first_name=$1, last_name=$2`;
    values = [first_name, last_name];
    let roleChanged = false;
    let passwordChanged = false;
    if (role !== user.role) {
      sql += `, role=$${values.length + 1}`;
      values.push(role);
      roleChanged = true;
    }
    if (password) {
      sql += `, password=$${values.length + 1}`;
      values.push(hashPassword(new_password));
      if (hashPassword(password) !== hashPassword(new_password)) {
        passwordChanged = true;
      }
    }
    sql += ` WHERE email=$${values.length + 1} RETURNING *`;
    values.push(email);
    // Update user
    const updateUserResult = await pool.query(sql, values);
    const updatedUser: IUser = updateUserResult.rows[0];
    const sessionData = {
      user_id: updatedUser.id,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      role: updatedUser.role,
      profile: updatedUser.profile,
    };
    // Update session data
    sql = `UPDATE ${TablesName.UserSessions} SET session_data=$1 WHERE user_id=$2 AND expired_at > $3`;
    values = [sessionData, user.id, new Date()];
    await pool.query(sql, values);

    if (roleChanged || passwordChanged) {
      sql = `UPDATE ${TablesName.UserSessions} SET expired_at=$1 WHERE user_id=$2 AND session_id !=$3 AND expired_at>$1`;
      values = [new Date(), user.id, userSession.session_id];
      // Update all users sessions of this logged in user to be expired, except current logged in session
      await pool.query(sql, values);
    }
    sendMessage(res, SuccessCodes.Updated);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Update archive user
export async function updateArchiveUser(req: Request, res: Response) {
  await updateField(
    req,
    res,
    "is_archived",
    `${TablesName.Users}`,
    ErrorCodes.UserNotFound
  );
}

// Update lock user
export async function updateLockUser(req: Request, res: Response) {
  await updateField(
    req,
    res,
    "is_locked",
    `${TablesName.Users}`,
    ErrorCodes.UserNotFound
  );
}

// Session handler
export async function sessionHandler(req: any, res: Response) {
  sendData(res, req.userSession);
}

// Update user profile image
export async function updateUserProfileImage(
  req: LoggedInRequest,
  res: Response
) {
  const userId = req.params.userId;
  const { profile } = req.body;
  const sessionId = req.userSession.session_id;
  try {
    let sql = `UPDATE ${TablesName.Users} SET profile=$1 WHERE id=$2 RETURNING id AS user_id, first_name, last_name, email, profile, role`;
    let values = [profile, userId];
    const userQueryUpdate = await pool.query(sql, values);
    const sessionData: ISessionData = userQueryUpdate.rows[0];
    sql = `UPDATE ${TablesName.UserSessions} SET session_data=$1 WHERE session_id=$2`;
    values = [sessionData, sessionId];
    // Execute the SQL query to update the session data in the UserSessions table
    await pool.query(sql, values);
    sendData(res, sessionData);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Search user by input
export async function searchUserByInput(req: Request, res: Response) {
  const input = req.params.input;
  try {
    const sql = `SELECT first_name, last_name, email FROM ${TablesName.Users} WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`;
    const QueryResult = await pool.query(sql, [`${input}%`]);
    sendData(res, QueryResult.rows);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}
