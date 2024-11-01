import { Request, Response } from "express";
import { pool } from "./db_connect";
import { TablesName, ErrorCodes, SuccessCodes } from "../models/enums";
import {
  sendData,
  sendError,
  sendUnexpectError,
  createUniqueId,
  sendMessage,
} from "../utils/utils";

import { createPrizeSchema, updatePrizeSchema } from "../models/validations";
import { updateField } from "./update_status_field_handlers";
import { PoolClient } from "pg";
// import { updateField } from "./update_status_field_handlers";

// Create prize into system
export async function createPrize(req: Request, res: Response) {
  let data: any;
  try {
    data = await createPrizeSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.APIError, err);
  }
  // Generate a unique id
  const id = createUniqueId();
  const { prize_image, khmer_name, english_name } = data;
  try {
    const sql = `INSERT INTO ${TablesName.Prizes} ( id, prize_image, khmer_name, english_name ) VALUES ( $1, $2, $3, $4 )`;
    const values = [id, prize_image, khmer_name, english_name];
    // Excute SQL query to insert data into Prizes table
    await pool.query(sql, values);
    sendMessage(res, SuccessCodes.Created);
  } catch (ex) {
    console.error(ex);
    if (ex.code == "23505") {
      return createPrize(req, res);
    }
    sendUnexpectError(res);
  }
}

// Get all prizes
export async function getAllPrizes(req: Request, res: Response) {
  try {
    // Excute SQL query to fetch all prizes' date from Prizes table
    const prizeQeuryResult = await pool.query(
      `SELECT * FROM ${TablesName.Prizes} ORDER BY id`
    );
    sendData(res, {
      data: prizeQeuryResult.rows,
    });
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Update prize
export async function updatePrize(req: Request, res: Response) {
  let data: any;
  try {
    data = await updatePrizeSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.APIError, err);
  }
  const id = req.params.id;
  const { prize_image, khmer_name, english_name } = data;
  try {
    const sql = `UPDATE ${TablesName.Prizes} SET prize_image=$1, khmer_name=$2, english_name=$3 WHERE id=$4`;
    const values = [prize_image, khmer_name, english_name, id];
    // Excute the SQL to update data in Prizes table
    const prizeQueryUpdate = await pool.query(sql, values);
    if (prizeQueryUpdate.rowCount === 0) {
      return sendError(res, ErrorCodes.PrizeNotFound);
    }
    sendMessage(res, SuccessCodes.Updated);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Update archive in prize by id
export async function updateArchivePrize(req: Request, res: Response) {
  await updateField(
    req,
    res,
    `is_archived`,
    `${TablesName.Prizes}`,
    ErrorCodes.PrizeNotFound
  );
}

// getPrizeWinner
export async function getPrizeWinner(req: Request, res: Response) {
  let client: PoolClient;
  try {
    const campaignId = req.params.id;
    const selectCampaign = await pool.query(
      `SELECT campaign_name, number_of_chance, campaign_image FROM ${TablesName.Campaigns} WHERE id=$1`,
      [campaignId]
    );

    if (selectCampaign.rowCount === 0) {
      throw ErrorCodes.CampaignNotFound;
    }

    client = await pool.connect();
    client.query("BEGIN");

    const cp = selectCampaign.rows[0];
    const campaignImage = cp.campaign_image;
    const campaignName = cp.campaign_name;
    const numberOfChance = cp.number_of_chance;

    // check if campaign exist in tem won user table
    const selectTemWonUser = await client.query(
      `SELECT * FROM ${TablesName.TempWonUsers} WHERE campaign_id=$1`,
      [campaignId]
    );

    const prizesQuery = `SELECT id, english_name as name_en, khmer_name as name_kh, prize_image as image FROM ${TablesName.Prizes} WHERE id = ANY($1)`;
    const existing = selectTemWonUser.rows[0];
    if (existing) {
      const selPrizes = await client.query(prizesQuery, [
        existing.prize_id_list,
      ]);
      await client.query("COMMIT");
      return sendData(res, {
        campaignName,
        campaignImage,
        msisdnList: existing.msisdn_list,
        prizeQtyList: existing.qty_list,
        prizes: selPrizes.rows,
      });
    }

    let campaignPrizeQuery = `SELECT * FROM ${TablesName.PrizesPool} WHERE campaign_id=$1 AND quantity > used_quantity`;
    let values = [campaignId];
    let campaignPrizeQuerySelect = await client.query(
      campaignPrizeQuery,
      values
    );
    if (campaignPrizeQuerySelect.rowCount === 0) {
      throw ErrorCodes.OutOfPrizes;
    }
    const campaignPrizeRow = campaignPrizeQuerySelect.rows;

    // Get prize id from campaign_prize
    const prizeListId = [];
    const prizeQtyList = [];

    for (let i of campaignPrizeRow) {
      const prizeId = i["prize_id"];
      const prizeQty = i["quantity"] - i["used_quantity"];

      prizeListId.push(prizeId);
      prizeQtyList.push(prizeQty);
    }

    // Get msisdn
    const participantQuery = `SELECT msisdn FROM ${TablesName.Participants} WHERE campaign_id=$1`;
    const participantQuerySelect = await client.query(participantQuery, [
      campaignId,
    ]);

    if (participantQuerySelect.rowCount === 0) {
      throw ErrorCodes.NoParticipants;
    }

    const participantRow = participantQuerySelect.rows;
    let msisdnList = [];
    const countSelected = {};

    for (let i = 0; i < prizeListId.length; i++) {
      const qty = prizeQtyList[i];
      for (let j = 0; j < qty && participantRow.length > 0; j++) {
        const randomIndex = Math.floor(Math.random() * participantRow.length);
        const msisdnSelected = participantRow[randomIndex].msisdn;

        countSelected[msisdnSelected] =
          (countSelected[msisdnSelected] || 0) + 1;
        participantRow.splice(randomIndex, 1);
        if (countSelected[msisdnSelected] <= numberOfChance) {
          msisdnList.push(msisdnSelected);
        } else {
          j = j - 1;
          continue;
        }
      }
    }

    // Remove the unused prizes if ran out of phone numbers
    let phoneCount = msisdnList.length;
    for (let i = 0; i < prizeQtyList.length; i++) {
      const qty = prizeQtyList[i];
      if (phoneCount - qty <= 0) {
        prizeQtyList[i] = phoneCount;
        prizeQtyList.splice(i + 1);
        prizeListId.splice(i + 1);
        break;
      }
      phoneCount -= qty;
    }

    const twuQuery = `INSERT INTO ${TablesName.TempWonUsers} (campaign_id, msisdn_list, prize_id_list, qty_list) VALUES ($1, $2, $3, $4)`;
    await client.query(twuQuery, [
      campaignId,
      msisdnList,
      prizeListId,
      prizeQtyList,
    ]);

    const prizeResult = await client.query(prizesQuery, [prizeListId]);
    client.query("COMMIT");

    sendData(res, {
      campaignName,
      campaignImage,
      msisdnList,
      prizes: prizeResult.rows,
      prizeQtyList,
    });
  } catch (ex) {
    if (client) await client.query("ROLLBACK");

    if (typeof ex === "number") {
      sendError(res, ex);
      return;
    }
    console.error(ex);
    sendUnexpectError(res);
  } finally {
    if (client) client.release();
  }
}

// Commit won prize
export async function commitWonPrize(req: Request, res: Response) {
  const campaignId = req.params.id;
  let client: PoolClient;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const twuQuery = `SELECT * FROM ${TablesName.TempWonUsers} WHERE campaign_id=$1`;
    const tempWonUsers = await client.query(twuQuery, [campaignId]);
    const tempWonUsersRow = tempWonUsers.rows;

    const msisdnWinnerList = tempWonUsersRow[0].msisdn_list;
    const prizeWinIdIncrease = tempWonUsersRow[0].prize_id_list;
    const qty = tempWonUsersRow[0].qty_list;
    const newPrizeIdList = [];

    for (let i = 0; i < prizeWinIdIncrease.length; i++) {
      for (let j = 0; j < qty[i]; j++) {
        newPrizeIdList.push(prizeWinIdIncrease[i]);
      }
    }

    for (let i = 0; i < msisdnWinnerList.length; i++) {
      const msisdn = msisdnWinnerList[i];
      const prizeId = newPrizeIdList[i];

      // Delete from participant
      let participantQuery = `DELETE FROM ${TablesName.Participants} WHERE campaign_id=$1 AND msisdn=$2`;
      await client.query(participantQuery, [campaignId, msisdn]);

      // Update use_quantity
      let campaignPrizeQuery = `UPDATE ${TablesName.PrizesPool} SET used_quantity = used_quantity+1 WHERE campaign_id=$1 AND prize_id=$2`;
      await client.query(campaignPrizeQuery, [campaignId, prizeId]);

      // Insert to table wonusers
      const wonUserQuery = `INSERT INTO ${TablesName.WonUsers} (campaign_id, msisdn, prize_id) VALUES ($1, $2, $3) RETURNING *`;
      await client.query(wonUserQuery, [campaignId, msisdn, prizeId]);
    }

    const selectUserWinner = await client.query(
      `SELECT msisdn,prize_id FROM ${TablesName.WonUsers} WHERE campaign_id=$1`,
      [campaignId]
    );
    const winnerData = selectUserWinner.rows;
    var msisdn = [];
    var prize = [];
    for (let i of winnerData) {
      msisdn.push(i.msisdn);
      prize.push(i.prize_id);
    }

    const twuQueryDeleteQuery = `DELETE FROM ${TablesName.TempWonUsers} WHERE campaign_id=$1`;
    const values = [campaignId];
    await client.query(twuQueryDeleteQuery, values);
    await client.query("COMMIT");
    sendMessage(res, SuccessCodes.Created);
  } catch (e) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error(e);
    sendUnexpectError(res);
  } finally {
    if (client) client.release();
  }
}

// Reset won prize
export async function resetWonPrize(req: Request, res: Response) {
  try {
    const campaignId = req.params.id;

    const sqls = `DELETE FROM ${TablesName.TempWonUsers} WHERE campaign_id=$1`;
    const values = [campaignId];
    const resetWonPrize = await pool.query(sqls, values);

    if (resetWonPrize.rowCount === 0) {
      sendError(res, ErrorCodes.CampaignNotFound);
    } else {
      sendMessage(res, SuccessCodes.Deleted);
    }
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}
