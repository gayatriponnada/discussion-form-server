import { resetPassword, signUp, login } from "@server/controllers/auth.controller";
import { Router } from "express";


const router = Router();

router.post('/sign-up', signUp);
router.post('/reset-password', resetPassword);
router.post('/login', login);

export default router;
