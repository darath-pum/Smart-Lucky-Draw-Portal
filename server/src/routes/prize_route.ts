
import { Router } from 'express';
import { createPrize, updatePrize, getAllPrizes, updateArchivePrize } from "../controllers/prize_handlers";
import { checkLevelThreeAndTwo, checkUserLogin } from "../controllers/auth_handlers";

const prizeRoute = Router();
// prize router
prizeRoute.get("/getAllPrizes", checkUserLogin, getAllPrizes);
prizeRoute.use(checkLevelThreeAndTwo());
prizeRoute.post('/createPrize', createPrize);
prizeRoute.put('/updatePrize/:id', updatePrize);
prizeRoute.put('/updateArchivePrize/:id', updateArchivePrize);
export default prizeRoute;
