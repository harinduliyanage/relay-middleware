import { Router } from "express";
import * as loginController from "../../controller/login.controller";

const router = Router();

// Static data
router.route("").get(loginController.login);
//
export default router;
