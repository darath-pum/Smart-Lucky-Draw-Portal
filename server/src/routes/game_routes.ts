import { Router } from "express";
import {
  commitWonPrize,
  getPrizeWinner,
  resetWonPrize,
} from "../controllers/prize_handlers";
import { checkUserLogin, loginHandler } from "../controllers/auth_handlers";

const gameRouter = Router();

gameRouter.post("/login/:id", loginHandler);
gameRouter.use(checkUserLogin);
gameRouter.get("/getPrizeWinner/:id", getPrizeWinner);
gameRouter.post("/commitWonPrize/:id", commitWonPrize);
gameRouter.delete("/resetWonPrize/:id", resetWonPrize);

export default gameRouter;
