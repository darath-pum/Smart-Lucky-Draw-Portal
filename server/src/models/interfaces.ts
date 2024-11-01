//  Users
export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  profile: string;
  email: string;
  password: string;
  role: string;
  user_lock: boolean;
  user_archive: boolean;
  created_at: Date;
  updated_at: Date;
}
// User_sessions
export interface IUserSession {
  session_id: string;
  user_id: number;
  ip: string;
  created_at: Date;
  updated_at: Date;
}
// Campaigns
export interface ICampaign {
  id: string;
  campaign_name: string;
  campaign_image: string;
  start_date: Date;
  end_date: Date;
  active: boolean;
  archive_campaign: boolean;
  created_at: Date;
  updated_at: Date;
}
// prizes
export interface IPrize {
  id: string;
  prize_image: string;
  khmer_name: string;
  english_name: string;
  archive_prize: boolean;
  created_at: Date;
  updated_at: Date;
}
// Campaign_prizes
export interface ICampaignPrize {
  id: string;
  campaign_id: string;
  prize_id: string;
  prize_name: string;
  quantity: number;
  used_quantity: number;
  created_at: Date;
  updated_at: Date;
}
// Participants
export interface IParticipant {
  id: number;
  msisdn: string;
  created_at: Date;
  updated_at: Date;
}
// Won_users
export interface IWonUser {
  id: number;
  prize_id: string;
  msisdn: string;
  won_date: Date;
  created_at: Date;
  updated_at: Date;
}
// Temp_won_users
export interface ITempWonUser {
  id: number;
  msisdn: string;
  won_date: Date;
  created_at: Date;
  updated_at: Date;
}
// Session Data
export interface ISessionData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: string;
  role: string;
}

