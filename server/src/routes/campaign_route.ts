import { Router } from "express";
import {
  getAllCampaigns,
  createCampaign,
  updateCampaign,
  updateArchiveCampaign,
  getAllCampaignPrize,
  getDetailsOfCampaign,
  deleteCampaignPrizeById,
  deleteCampaignInvitedEmail,
  getInvitedEmailAndPermission,
  getParticipantByCampaignID
} from "../controllers/campaign_handlers";
import { checkLevelThreeAndTwo, checkUserLogin } from "../controllers/auth_handlers";
import multer from "multer";
import { checkCampaignUpdatePermission, checkCampaignViewPermission } from "../middlewares/campaign_middleware";

const fileUploadHandler = multer();
const campaignRoute = Router();

campaignRoute.get("/getParticipantByCampaignID/:id", checkUserLogin, getParticipantByCampaignID);
campaignRoute.get("/getAllCampaigns", checkUserLogin, getAllCampaigns);
campaignRoute.get("/getDetailsOfCampaigns/:id", checkUserLogin, checkCampaignViewPermission, getDetailsOfCampaign);
campaignRoute.put("/updateCampaign/:id", checkUserLogin, checkCampaignUpdatePermission, fileUploadHandler.single("participants"), updateCampaign);

campaignRoute.put("/updateArchiveCampaign/:id", updateArchiveCampaign);
campaignRoute.get("/getAllCampaignPrize/:id", getAllCampaignPrize);
campaignRoute.delete("/deleteCampaignPrize/:campaignId/:prizeId", deleteCampaignPrizeById);
campaignRoute.delete("/deleteCampaignInvitedEmail/:campaignId/:email", deleteCampaignInvitedEmail)

campaignRoute.post("/getInvitedEmail", getInvitedEmailAndPermission);
campaignRoute.use(checkLevelThreeAndTwo());
campaignRoute.post("/createCampaign", checkUserLogin, fileUploadHandler.single("participants"), createCampaign);
campaignRoute.post("/getInvitedEmail", getInvitedEmailAndPermission);
export default campaignRoute;




