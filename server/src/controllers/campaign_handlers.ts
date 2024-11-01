import { Request, Response } from "express";
import { TablesName, ErrorCodes, SuccessCodes } from "../models/enums";
import { pool } from "./db_connect";
import { sendData, sendError, sendMessage, createUniqueId, sendUnexpectError } from "../utils/utils";
import { createCampaignSchema, updateCampaignSchema } from "../models/validations";
import { PoolClient } from "pg";
import { updateField } from "./update_status_field_handlers";
import { LoggedInRequest } from "../types/LoggedInRequest";

/**
 * Insert participants into a campaign.
 *
 * @param campaignId - The ID of the campaign.
 * @param req - The request object containing the file with phone numbers.
 * @param poolClient - The database pool client.
 */
// NEW PROCESS ===============================================================================================

const csv = require("csv-parser");
const { Readable } = require("stream");

async function insertParticipantsToCampaign(campaignId, req, poolClient) {
  if (!req.file) return false;

  const phoneNumbers = [];
  const fileBuffer = req.file.buffer;

  // Wrap the CSV parsing in a Promise
  return new Promise((resolve, reject) => {
    const readableStream = Readable.from(fileBuffer);
    let rowCount = 0; // Track the number of rows processed

    readableStream
      .pipe(csv())
      .on("data", (row) => {
        const columns = Object.keys(row);

        // Check if the row has exactly 2 keys (columns)
        if (columns.length !== 2) {
          reject(new Error("Invalid CSV format"));
          readableStream.destroy(); // Stop further processing
          return;
        }

        // Extract the phone number from the "Entry" column
        const phoneNumber = row[columns[1]].replace(/\D/g, "");
        phoneNumbers.push(phoneNumber);
        rowCount++; // Increment the row count
      })
      .on("end", async () => {
        // Validate if there is at least one row of data
        if (rowCount === 0) {
          reject(new Error("Invalid CSV format"));
          return;
        }

        if (phoneNumbers.length === 0) {
          resolve(false);
          return;
        }

        try {
          // Insert each phone number into the database
          for (let i = 0; i < phoneNumbers.length; i++) {
            const phoneNumber = phoneNumbers[i];
            console.log(phoneNumber)
            const sql = `INSERT INTO ${TablesName.Participants} (campaign_id, msisdn) VALUES ($1, $2) RETURNING id`;
            const values = [campaignId, phoneNumber];
            
            // Execute the query to insert the participants into the database.
            await poolClient.query(sql, values);
          }
          resolve(true); // Resolve successfully after all inserts
        } catch (err) {
          reject(err); // Reject if any database operation fails
        }
      })
      .on("error", (error) => {
        console.error("Error processing CSV file:", error.message);
        reject(error); // Reject on CSV parsing error
      });
  });
}

export async function getParticipantByCampaignID(req: Request, res: Response) {
  try {
    const campaign_id = req.params.id;
    const msisdns = await pool.query(
      `SELECT msisdn FROM ${TablesName.Participants} WHERE campaign_id=$1`,
      [campaign_id]
    );

    // Access the rows array within the result
    const phoneNumber = msisdns.rows;
    sendData(res, phoneNumber);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}



// Get all campaigns from db
export async function getAllCampaigns(req: LoggedInRequest, res: Response) {
  const session = req.userSession;
  const userInfo = session.session_data;

  try {
    // Excute the SQL query to fetch all campaigns's data from Campaigns table
    if (userInfo.role === "admin") {
      const campaignQueryResult = await pool.query(
        `SELECT * FROM ${TablesName.Campaigns} ORDER BY start_date`
      );
      sendData(res, campaignQueryResult.rows);
    } else {
      const campaignQueryResult = await pool.query(`SELECT * FROM ${TablesName.Campaigns} WHERE owner=$1`, [
        userInfo.user_id,
      ]);
      const accessCampaigns = campaignQueryResult.rows;
      const invitedCampaigns = await pool.query(
        `SELECT * FROM ${TablesName.CampaignInvitedEmail} WHERE email=$1`,
        [userInfo.email]
      );

      let campaignsId = invitedCampaigns.rows.map((campaign) => campaign.campaign_id);
      const invitedQueryResult = await pool.query(
        `SELECT * FROM ${TablesName.Campaigns} WHERE id = ANY($1) ORDER BY start_date`,
        [campaignsId]
      );

      accessCampaigns.push(...invitedQueryResult.rows);
      sendData(res, accessCampaigns);
    }
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Create campaign
export async function createCampaign(req: LoggedInRequest, res: Response) {
  let data: any;
  try {
    data = await createCampaignSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.APIError, err);
  }
  // Generate unique id
  const id = createUniqueId();
  const userId = req.userSession.user_id;

  const { campaign_name, campaign_image, start_date, end_date, prizes, number_of_chance } = data;

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  if (startDate > endDate) {
    return sendError(res, ErrorCodes.InvalidDate, "Start date must be before end date.");
  }
  let client: PoolClient | undefined;
  try {
    // Create a connection to the database pool
    const client = await pool.connect();
    // Start the transaction
    await client.query("BEGIN");
    let sql = `INSERT INTO ${TablesName.Campaigns}(id, campaign_name, campaign_image, start_date, end_date, owner, number_of_chance) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    let values = [id, campaign_name, campaign_image, startDate, endDate, userId, number_of_chance];
    // Excute the SQL query to insert campaigns' data into Campaigns table
    await client.query(sql, values);

    // Insert invited email to table
    const { invited_email } = req.body;

    if (invited_email.length > 0) {
      var invitedEmail = JSON.parse(invited_email);
    }

    if (invitedEmail.length > 0) {
      sql = `INSERT INTO ${TablesName.CampaignInvitedEmail} (campaign_id, email, permission) VALUES`;
      let index2 = 2;
      values = [id];
      for (let i = 0; i < invitedEmail.length; i++) {
        const invite = invitedEmail[i];
        sql += `($1, $${index2++}, $${index2++})`;
        values.push(invite.email);
        values.push(invite.permission);
        if (i + 1 < invitedEmail.length) {
          sql += ",";
        }
      }
      await client.query(sql, values);
    }

    // create campaign prizes
    const campaignPrizes = JSON.parse(prizes);
    sql = `INSERT INTO ${TablesName.PrizesPool} (campaign_id, prize_id, quantity) VALUES `;
    let index = 2;
    values = [id];
    for (let i = 0; i < campaignPrizes.length; i++) {
      const prize = campaignPrizes[i];
      sql += `($1, $${index++}, $${index++})`;
      values.push(prize.prize_id);
      values.push(prize.quantity);
      if (i + 1 < campaignPrizes.length) {
        sql += ",";
      }
    }

    // Excute SQL query to insert prizes' data into campaignPrizes table
    await client.query(sql, values);

    // insert participants
     await insertParticipantsToCampaign(id, req, client);
    // try{

    // }catch(ex){
    // }
    // Commit the transaction
    await client.query("COMMIT");
    // Response
    sendMessage(res, SuccessCodes.Created);
  } catch (ex) {
    console.log(ex.message)
    if (ex.message == "Invalid CSV format") {
    
      return sendError(res, ErrorCodes.BadRequest, "Invalid CSV format")
    }
    if (ex.code == "23505") {
      return createCampaign(req, res);
    }
    if (client) {
      // Create a rollback to undo any changes made in the transaction
      await client.query("ROLLBACK");
    }
    sendUnexpectError(res);
  } finally {
    if (client) {
      // End the transaction
      await client.release();
    }
  }
}

// Update campaign by id

export async function updateCampaign(req: Request, res: Response) {
  let data: any;
  try {
    data = await updateCampaignSchema.validateAsync(req.body);
  } catch (err) {
    return sendError(res, ErrorCodes.APIError, err);
  }

  var campaignId = req.params.id;
  const {
    campaign_name,
    campaign_image,
    start_date,
    end_date,
    prizes,
    // invited_email,
    number_of_chance,
  } = data;
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const { invited_email } = req.body;
  const invitedEmail = JSON.parse(invited_email);

  if (startDate > endDate) {
    sendError(res, ErrorCodes.InvalidDate);
    return;
  }
  let client: PoolClient | undefined;
  try {
    let client = await pool.connect();
    await client.query("BEGIN");

    const selectCampaignQuery = `SELECT * FROM ${TablesName.Campaigns} WHERE id=$1`;
    const selectCampaignQueryResult = await pool.query(selectCampaignQuery, [campaignId]);

    if (selectCampaignQueryResult.rowCount === 0) {
      sendError(res, ErrorCodes.CampaignNotFound);
      return;
    }

    let updateCampaignQuery = `UPDATE ${
      TablesName.Campaigns
    } SET campaign_name=$1, start_date=$2, end_date=$3, number_of_chance=$4 ${
      campaign_image ? `, campaign_image=$6` : ""
    } WHERE id=$5`;
    let values = [campaign_name, startDate, endDate, number_of_chance, campaignId];
    if (campaign_image) values.push(campaign_image);
    await client.query(updateCampaignQuery, values);

    // update campaignPrize
    const prizeList = JSON.parse(prizes);

    // prizes================================================================================================
    // current list
    const currentListData = `SELECT prize_id, quantity FROM ${TablesName.PrizesPool} WHERE campaign_id = $1`;
    const currentListDataResult = await client.query(currentListData, [campaignId]);
    const currentList = currentListDataResult.rows;

    // emails ================================================================================================
    const currentEmail = `SELECT email FROM ${TablesName.CampaignInvitedEmail} WHERE campaign_id = $1`;
    const currentEmailResult = await client.query(currentEmail, [campaignId]);
    const currentEmailList = currentEmailResult.rows;

    // emails ===============================================================================================
    const emailUpdateList = [];
    const emailInsertList = [];
    const emailDeleteList = [];

    // Get update list and insert list
    for (const i of invitedEmail) {
      const emails = i["email"];

      let isFound = false;
      for (const j of currentEmailList) {
        const email = j["email"];
        if (email === emails) {
          emailUpdateList.push(i);
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        emailInsertList.push(i);
      }
    }

    // Get delete list
    for (const i of currentEmailList) {
      const currentEmail = i["email"];
      let isDeleted = true;
      for (const j of emailInsertList) {
        const insertEmail = j["email"];
        if (currentEmail === insertEmail) {
          isDeleted = false;
          break;
        }
      }

      if (isDeleted) {
        for (const j of emailUpdateList) {
          const updateEmail = j["email"];
          if (currentEmail === updateEmail) {
            isDeleted = false;
            break;
          }
        }
      }
      if (isDeleted) {
        emailDeleteList.push(i);
      }
    }
    // Update email
    for (const i of emailUpdateList) {
      const updateEmail = i["email"];
      const updateEmailPermisson = i["permission"];
      const updateInvitedEmailQuery = `UPDATE ${TablesName.CampaignInvitedEmail} SET permission=$1 WHERE campaign_id=$2 AND email=$3`;
      const values = [updateEmailPermisson, campaignId, updateEmail];
      await client.query(updateInvitedEmailQuery, values);
    }
    // Insert prize
    if (emailInsertList.length > 0) {
      let eimailInsertQuery = `INSERT INTO ${TablesName.CampaignInvitedEmail} (campaign_id, email, permission) VALUES`;
      let index = 2;
      values = [campaignId];
      for (let i = 0; i < emailInsertList.length; i++) {
        var invite = emailInsertList[i];
        eimailInsertQuery += `($1, $${index++}, $${index++})`;
        values.push(invite.email);
        values.push(invite.permission);
        if (i + 1 < emailInsertList.length) {
          eimailInsertQuery += ",";
        }
      }
      await client.query(eimailInsertQuery, values);
    }

    // Delete email
    if (emailDeleteList.length > 0) {
      let emailDeleteQuery = `DELETE FROM ${TablesName.CampaignInvitedEmail} WHERE campaign_id=$1 AND (`;
      let index = 2;
      let values = [campaignId];
      for (let i = 0; i < emailDeleteList.length; i++) {
        const deleteEmail = emailDeleteList[i]["email"];
        values.push(deleteEmail);

        emailDeleteQuery += `email=$${index++}`;
        if (i + 1 < emailDeleteList.length) {
          emailDeleteQuery += " OR ";
        }
      }
      emailDeleteQuery += ")";
      await client.query(emailDeleteQuery, values);
    }

    // prizes update, insert, delete==========================================================================
    const updateList = [];
    const insertList = [];
    const deleteList = [];

    // Get update list and insert list
    for (const i of prizeList) {
      const prizeListId = i["prize_id"];

      let isFound = false;
      for (const j of currentList) {
        const currentId = j["prize_id"];
        if (prizeListId === currentId) {
          updateList.push(i);
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        insertList.push(i);
      }
    }

    // Get delete list
    for (const i of currentList) {
      const currentId = i["prize_id"];
      let isDeleted = true;
      for (const j of insertList) {
        const insertListId = j["prize_id"];
        if (currentId === insertListId) {
          isDeleted = false;
          break;
        }
      }

      if (isDeleted) {
        for (const j of updateList) {
          const updateListId = j["prize_id"];
          if (currentId === updateListId) {
            isDeleted = false;
            break;
          }
        }
      }
      if (isDeleted) {
        if (i["used_quantity"] > 0) {
          i["quantity"] = i["used_quantity"];
          updateList.push(i);
        } else {
          deleteList.push(i);
        }
      }
    }

    // Update campaignPrize
    for (const i of updateList) {
      const updatePrizeId = i["prize_id"];
      const updatePrizeQuantity = i["quantity"];

      const updateCampaignPrizeQuery = `UPDATE ${TablesName.PrizesPool} SET quantity=$1 WHERE campaign_id=$2 AND prize_id=$3`;
      const values = [updatePrizeQuantity, campaignId, updatePrizeId];
      await client.query(updateCampaignPrizeQuery, values);
    }

    // Insert prize
    if (insertList.length > 0) {
      let campaignPrizeInsertQuery = `INSERT INTO ${TablesName.PrizesPool} (campaign_id, prize_id, quantity) VALUES`;
      let index = 2;
      values = [campaignId];
      for (let i = 0; i < insertList.length; i++) {
        var prize = insertList[i];
        campaignPrizeInsertQuery += `($1, $${index++}, $${index++})`;
        values.push(prize.prize_id);
        values.push(prize.quantity);
        if (i + 1 < insertList.length) {
          campaignPrizeInsertQuery += ",";
        }
      }
      await client.query(campaignPrizeInsertQuery, values);
    }
    // Delete prize
    if (deleteList.length > 0) {
      let campaignPrizeDeleteQuery = `DELETE FROM ${TablesName.PrizesPool} WHERE campaign_id=$1 AND (`;
      let index = 2;
      let values = [campaignId];
      for (let i = 0; i < deleteList.length; i++) {
        const deletePrizeId = deleteList[i]["prize_id"];
        values.push(deletePrizeId);
        campaignPrizeDeleteQuery += `prize_id=$${index++}`;
        if (i + 1 < deleteList.length) {
          campaignPrizeDeleteQuery += " OR ";
        }
      }
      campaignPrizeDeleteQuery += ")";
      await client.query(campaignPrizeDeleteQuery, values);
    }
    await insertParticipantsToCampaign(campaignId, req, client);
    await client.query("COMMIT");
    sendMessage(res, SuccessCodes.Updated);
    return;
  } catch (e) {
    console.log(e.message)
    if (e.message == "Invalid CSV format") {
    
      return sendError(res, ErrorCodes.BadRequest, "Invalid CSV format")
    }
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error(e);
    sendUnexpectError(res);
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Update archive in campaign by id
export async function updateArchiveCampaign(req: Request, res: Response) {
  await updateField(req, res, "is_archived", `${TablesName.Campaigns}`, ErrorCodes.CampaignNotFound);
}

// Get all campaign prize
export async function getAllCampaignPrize(req: Request, res: Response) {
  try {
    const sql = `SELECT prize_id FROM ${TablesName.PrizesPool} WHERE campaign_id=$1`;
    const campaignId = req.params.id;
    const values = [campaignId];
    const allCampaignPrize = await pool.query(sql, values);

    if (allCampaignPrize.rowCount === 0) {
      sendError(res, ErrorCodes.CampaignNotFound);
      return;
    }
    sendData(res, { message: allCampaignPrize.rows });
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Get details of campaign
export async function getDetailsOfCampaign(req: Request, res: Response) {
  const campaign_id = req.params.id;

  try {
    let sql = `SELECT * FROM ${TablesName.Campaigns} WHERE id=$1`;
    const values = [campaign_id];
    // Excute SQL query to fetch the details of each campaign
    const campaignQueryResult = await pool.query(sql, values);
    if (campaignQueryResult.rowCount === 0) {
      return sendError(res, ErrorCodes.CampaignNotFound);
    }
    // Retrieve the campaign date from the first row of campaignQueryResult
    const campaign = campaignQueryResult.rows[0];
    sql = `SELECT * FROM ${TablesName.PrizesPool} WHERE campaign_id=$1`;
    // Excute the SQL query to fetch details of campaign prize
    const campaignPrizeQueryResult = await pool.query(sql, values);
    // Retrieve the campaign prize date from the first row of campaignQueryRows
    const campaignPrizeQueryRows = campaignPrizeQueryResult.rows;

    sql = `SELECT * FROM ${TablesName.CampaignInvitedEmail} WHERE campaign_id=$1`;
    const invitedEmailResult = await pool.query(sql, values);
    const invitedEmailResultRows = invitedEmailResult.rows;
    sendData(res, {
      campaign,
      prize_pools: campaignPrizeQueryRows,
      invited_emails: invitedEmailResultRows,
    });
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Delete campaign prize by id
export async function deleteCampaignPrizeById(req: Request, res: Response) {
  const campaignId = req.params.campaignId;
  const prizeId = req.params.prizeId;

  try {
    const sql = `DELETE FROM ${TablesName.PrizesPool} WHERE campaign_id=$1 AND prize_id=$2`;
    const value = [campaignId, prizeId];
    const result = await pool.query(sql, value);

    if (result.rowCount === 0) {
      return sendError(res, ErrorCodes.APIError, "Campaign prize not found.");
    }
    sendMessage(res, SuccessCodes.Deleted);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Delete campaign invited email by email
export async function deleteCampaignInvitedEmail(req: Request, res: Response) {
  const campaignId = req.params.campaignId;
  const email = req.params.email;

  try {
    const sql = `DELETE FROM ${TablesName.CampaignInvitedEmail} WHERE campaign_id=$1 AND email=$2`;
    const value = [campaignId, email];
    const result = await pool.query(sql, value);

    if (result.rowCount === 0) {
      return sendError(res, ErrorCodes.APIError, "Campaign email not found.");
    }
    sendMessage(res, SuccessCodes.Deleted);
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}

// Get invited email and permission

export async function getInvitedEmailAndPermission(req: Request, res: Response) {
  try {
    const { campaignId, email } = req.body;
    const sql = `SELECT permission FROM ${TablesName.CampaignInvitedEmail} WHERE campaign_id=$1 AND email=$2`;
    const values = [campaignId, email];
    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      sendError(res, ErrorCodes.CampaignNotFound);
      return;
    }
    const permission = result.rows[0].permission;
    sendData(res, { permission });
  } catch (ex) {
    console.error(ex);
    sendUnexpectError(res);
  }
}
