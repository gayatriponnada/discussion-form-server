import { login } from "@server/controllers/auth.controller";
import { Router } from "express";


const router = Router();

router.post('/login', login);

export default router;
