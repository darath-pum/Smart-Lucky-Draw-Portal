import { Router } from "express";
import {
  signUpHandler,
  getAllUsers,
  updateUser,
  updateUserProfileImage,
  updateArchiveUser,
  updateLockUser,
  sessionHandler,
  searchUserByInput,
} from "../controllers/user_handlers";
import { checkUserLogin } from "../controllers/auth_handlers";
import { checkLevelThreeAndTwo } from "../controllers/auth_handlers";

const userRoute = Router();
userRoute.post("/register", signUpHandler);
userRoute.get("/getAllUsers", checkUserLogin, getAllUsers);
userRoute.get("/session", checkUserLogin, sessionHandler);
userRoute.use(checkLevelThreeAndTwo());
userRoute.put("/updateUser", updateUser);
userRoute.put("/updateUserImageProfile/:userId", updateUserProfileImage);

userRoute.put("/updateArchiveUser/:id", updateArchiveUser);
userRoute.put("/updateLockUser/:id", updateLockUser);

userRoute.get("/searchUserByInput/:input", searchUserByInput);

export default userRoute;
