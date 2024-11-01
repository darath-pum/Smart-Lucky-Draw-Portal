import { Request, Response } from "express";
import { sendData, sendError, sendUnexpectError } from "../utils/utils";
import { ErrorCodes, TablesName } from "../models/enums";
import { pool } from "./db_connect";
import { getWonUsersSchema } from "../models/validations";

export async function listWonUsersByDateAndCampaignId(
  req: Request,
  res: Response
) {
  const data = await getWonUsersSchema.validateAsync(req.body);
  const { from_date, to_date } = data;
  const campaign_id = req.params.campaign_id;
  const fromDate = new Date(from_date);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to_date);
  toDate.setHours(23, 59, 59, 0);

  if (fromDate > toDate) {
    return sendError(
      res,
      ErrorCodes.InvalidDate,
      "Start date must be before end date"
    );
  }
  try {
    let sql = `
          SELECT ${TablesName.Campaigns}.campaign_name, ${TablesName.WonUsers}.msisdn, ${TablesName.Prizes}.prize_image, ${TablesName.Prizes}.khmer_name, ${TablesName.Prizes}.english_name, ${TablesName.WonUsers}.created_at
          FROM ${TablesName.WonUsers} 
          INNER JOIN ${TablesName.Campaigns} ON ${TablesName.WonUsers}.campaign_id = ${TablesName.Campaigns}.id 
          INNER JOIN ${TablesName.Prizes} ON ${TablesName.WonUsers}.prize_id = ${TablesName.Prizes}.id
          WHERE ${TablesName.WonUsers}.campaign_id = $1`;

    const params = [campaign_id];
    if (from_date && to_date) {
      sql += ` AND ${TablesName.WonUsers}.created_at BETWEEN $2 AND $3`;
      params.push(fromDate.toISOString(), toDate.toISOString());
    } else if (from_date) {
      sql += ` AND ${TablesName.WonUsers}.created_at >= $2`;
      params.push(fromDate.toISOString());
    } else if (to_date) {
      sql += ` AND ${TablesName.WonUsers}.created_at <= $2`;
      params.push(toDate.toISOString());
    }
    const queryResults = await pool.query(sql, params);
    sendData(res, queryResults.rows);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}
