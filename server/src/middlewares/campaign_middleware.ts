import { NextFunction, Response } from "express";
import { LoggedInRequest } from "../types/LoggedInRequest";
import { sendData, sendError, sendUnexpectError } from "../utils/utils";
import { ErrorCodes, TablesName, UserPermissions, UserRoles } from "../models/enums";
import { pool } from "../controllers/db_connect";


export async function checkAdminAdnStanard(req: LoggedInRequest, res: Response, next: NextFunction) {
  const session = req.userSession;
  const userInfo = session.session_data;

  try {
    if (userInfo.role === "guest") {
      return sendError(res, ErrorCodes.UnAuthorized, "Permission Denied.");
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    sendUnexpectError(res);
    return;
  }
}

export async function checkCampaignUpdatePermission(req: LoggedInRequest, res: Response, next: NextFunction) {
  const session = req.userSession;
  const userInfo = session.session_data;
  const campaignId = req.params.id || req.params.campaign_id;

  try {
    if (userInfo.role === UserRoles.LevelThree) {
      next();
    } else {
      let sql = `SELECT * FROM ${TablesName.Campaigns} WHERE id=$1 AND owner=$2 `;
      let queryResult = await pool.query(sql, [campaignId, userInfo.user_id]);

      if (queryResult.rowCount > 0) {
        next();
        return;
      }

      sql = `SELECT * FROM ${TablesName.CampaignInvitedEmail} WHERE campaign_id=$1 AND email=$2`;
      const result = await pool.query(sql, [campaignId, userInfo.email]);

      if (result.rowCount > 0) {
        const userInfo = result.rows[0];
        if (userInfo.permission === UserPermissions.ReadOnly) {
          return sendError(res, ErrorCodes.UnAuthorized, "Permission Denied. You don't have permission to make changes.");
        }
      } else {
        return sendError(res, ErrorCodes.UnAuthorized, "Permission Denied. You don't have permission in this campaign.");
      }

      next();
    }
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
    return;
  }
}

export async function checkCampaignViewPermission(req: LoggedInRequest, res: Response, next: NextFunction) {
  const session = req.userSession;
  const userInfo = session.session_data;
  const campaignId = req.params.id || req.params.campaign_id;

  try {
    if (userInfo.role === UserRoles.LevelThree) {
      next();
    } else {
      let sql = `SELECT * FROM ${TablesName.Campaigns} WHERE id=$1 AND owner=$2 `;
      let queryResult = await pool.query(sql, [campaignId, userInfo.user_id]);

      if (queryResult.rowCount > 0) {
        next();
        return;
      }

      sql = `SELECT * FROM ${TablesName.CampaignInvitedEmail} WHERE campaign_id=$1 AND email=$2`;
      queryResult = await pool.query(sql, [campaignId, userInfo.email]);

      if (queryResult.rowCount > 0) {
        next();
        return;
      } else {
        return sendError(res, ErrorCodes.UnAuthorized, "Permission Denied. You don't have permission in this campaign.");
      }
    }
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
    return;
  }
}
