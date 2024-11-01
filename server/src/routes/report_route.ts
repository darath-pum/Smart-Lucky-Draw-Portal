import { Router } from "express";
import { listWonUsersByDateAndCampaignId } from "../controllers/report_handlers";
import { checkUserLogin } from "../controllers/auth_handlers";
import { checkCampaignViewPermission } from "../middlewares/campaign_middleware";

const reportRoute = Router();

reportRoute.post("/listWonUsers/:campaign_id", checkUserLogin, checkCampaignViewPermission, listWonUsersByDateAndCampaignId);

export default reportRoute;
