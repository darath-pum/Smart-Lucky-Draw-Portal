import { Router } from 'express';
import { loginHandler, logoutHandler } from "../controllers/auth_handlers";
import { generateLinkHandler, changePassword } from '../controllers/auth_handlers';

const authRoute = Router();
// User router
authRoute.post('/login', loginHandler);
authRoute.post('/logout', logoutHandler);
authRoute.post('/generateLink', generateLinkHandler);
authRoute.post('/changePassword', changePassword);



export default authRoute;