import { Request, Response } from "express";
import { pool } from "./db_connect";
import { ErrorCodes, SuccessCodes, TablesName } from "../models/enums";
import { sendError, sendMessage, sendUnexpectError } from "../utils/utils";
import { updateStatusFieldSchema } from "../models/validations";



// Update field
export async function updateField(req: Request, res: Response, fieldName: string, tableName: string, responseCodes: number) {
  let data: any;
  try {
    data = await updateStatusFieldSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.APIError, err);
  }
  const id = req.params.id;
  const fieldValue = data[fieldName];
  try {
    const sql = `UPDATE ${tableName} SET ${fieldName}=$1 WHERE id=$2`;
    const values = [fieldValue, id];
    const queryResult = await pool.query(sql, values);
    if (queryResult.rowCount === 0) {
      return sendError(res, responseCodes);
    }
    if (tableName === TablesName.Users) {
      if (fieldName === "is_archived" || fieldName === "is_locked") {
        const expired = new Date();
        const sql = `UPDATE ${TablesName.UserSessions} SET expired_at=$1 WHERE user_id = $2`;
        const values = [expired, id];
        await pool.query(sql, values);
      }
    }

    sendMessage(res, SuccessCodes.Updated, `Updated ${fieldName} successfully.`);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}