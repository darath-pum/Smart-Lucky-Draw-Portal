export enum ErrorCodes {
  UserPasswordIncorrect = 404,
  UserDoesNotExist = 401,
  EmailDoesNotExist = 402,
  APIError = 400,
  UnAuthorized = 403,
  InternalServerError = 500,
  UserNotFound = 405,
  CampaignNotFound = 406,
  PrizeNotFound = 407,
  InvalidDate = 408,
  BadRequest,
  ResourceExpired,
  NoParticipants,
  OutOfPrizes,
}
export enum SuccessCodes {
  Created = 201,
  Updated,
  Deleted,
}

export enum UserRoles {
  LevelThree = "admin",
  LevelTwo = "standard",
  LevelOne = "guest",
}

export enum UserPermissions {
  ReadOnly = "read only",
  ReadAndWrite = "read and write",
}

export enum TablesName {
  Users = "users",
  UserSessions = "user_sessions",
  Campaigns = "campaigns",
  Prizes = "prizes",
  ResetPassWords = "reset_passwords",
  Participants = "participants",
  PrizesPool = "prizes_pool",
  WonUsers = " won_users",
  TempWonUsers = "temp_won_users",
  CampaignInvitedEmail = "campaign_invited_emails",
}

export class ErrorMessage {
  static getMessage(code: ErrorCodes) {
    switch (code) {
      case ErrorCodes.UnAuthorized:
        return "Unauthorized access";
      case ErrorCodes.UserPasswordIncorrect:
        return "Password is incorrected";
      case ErrorCodes.UserNotFound:
        return "User not found";
      case ErrorCodes.UserDoesNotExist:
        return "User does not exist";
      case ErrorCodes.EmailDoesNotExist:
        return "Email does not exist";
      case ErrorCodes.InternalServerError:
        return "Server encounted unexpected error";
      case ErrorCodes.CampaignNotFound:
        return "Campaign not found";
      case ErrorCodes.PrizeNotFound:
        return "Prize not found";
      case ErrorCodes.InvalidDate:
        return "Invalid date";
      case ErrorCodes.NoParticipants:
        return "No participants in this campaign!";
      case ErrorCodes.OutOfPrizes:
        return "Campaign has ran out of prizes!";
    }
  }
}

export class SuccessMessage {
  static getMessage(code: SuccessCodes) {
    switch (code) {
      case SuccessCodes.Created:
        return "Created successfully";
      case SuccessCodes.Updated:
        return "Updated successfully";
      case SuccessCodes.Deleted:
        return "Deleted successfully";
    }
  }
}
