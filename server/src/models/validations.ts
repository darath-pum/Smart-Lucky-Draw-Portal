import joi from "joi";

const passwordInputRule = joi.string().min(3);

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: passwordInputRule.required(),
});

export const resetPassword = joi.object({
  email: joi.string().email().required(),
});

export const changePasswordSchema = joi.object({
  new_password: joi.string().min(8).required(),
  verification_id: joi.string().required(),
});

// User validation ==============================

export const createUserSchema = joi.object({
  first_name: joi.string().trim().required(),
  last_name: joi.string().trim().required(),
  email: joi.string().required(),
  password: passwordInputRule.required(),
  role: joi.string().required(),
});

export const updateStatusFieldSchema = joi.object({
  is_locked: joi.boolean().optional(),
  is_archived: joi.boolean().optional(),
});

export const updateUserSchema = joi
  .object({
    first_name: joi.string().trim().required(),
    last_name: joi.string().trim().required(),
    email: joi.string().email().required(),
    role: joi.string().optional(),
    password: passwordInputRule.optional(),
    new_password: passwordInputRule.optional(),
  })
  .with("new_password", "password");

// Campaign validation ===========================

export const createCampaignSchema = joi.object({
  campaign_name: joi.string().trim().required(),
  campaign_image: joi.string().optional(),
  start_date: joi.string().required(),
  end_date: joi.string().required(),
  prizes: joi.string().required(),
  number_of_chance: joi.number().required(),
  invited_email: joi.string(),
});

export const updateCampaignSchema = joi.object({
  campaign_name: joi.string().trim().required(),
  campaign_image: joi.string().optional(),
  start_date: joi.string().required(),
  end_date: joi.string().required(),
  prizes: joi.string().required(),
  number_of_chance: joi.number().required(),
  invited_email: joi.string(),
});

export const getDetailsOfCampaignSchema = joi.object({
  campaign_id: joi.string().required(),
});

export const updateArchiveCampaignSchema = joi.object({
  archive_campaign: joi.boolean().required(),
});

// Prize validation ==============================

export const createPrizeSchema = joi.object({
  prize_image: joi.string().required(),
  khmer_name: joi.string().trim().required(),
  english_name: joi.string().trim().required(),
});

export const updatePrizeSchema = joi.object({
  prize_image: joi.string().required(),
  khmer_name: joi.string().trim().required(),
  english_name: joi.string().trim().required(),
});

export const updatePrizeArchiveSchema = joi.object({
  archive_prize: joi.boolean().required(),
});

// Report validation ================================

export const getWonUsersSchema = joi.object({
  from_date: joi.string().optional().empty(""),
  to_date: joi.string().optional().empty(""),
});
