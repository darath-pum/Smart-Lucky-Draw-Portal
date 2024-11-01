export interface ICampaign {
  id: string;
  campaign_name: string;
  campaign_image: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_archived: boolean;
  number_of_chance: number;
}

export interface IPrize {
  id: string;
  prize_image: string;
  khmer_name: string;
  english_name: string;
  archive_prize: boolean;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
  prize_id: string;
  quantity: number;
  used_quantity: number;
}
export interface IEmailInvite {
  email: string;
  permission: string;
}

export interface IAccountSearchInfo {
  email: string;
  first_name: string;
  last_name: string;
}

export interface IPrizePool {
  prize_id: string;
  quantity: number;
  used_quantity: number;
}

export interface IAPIResponse {
  status: number;
  code: number;
  data?: any;
  error?: string;
}
