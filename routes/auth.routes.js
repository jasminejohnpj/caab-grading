import { Router } from "express";
import { createAdmin, adminLogin, userLogin, verifyOtp, company } from '../controller/auth.controller.js';
import { generateToken } from "../middleware/generatetoken.js";

const authRouter = Router();

authRouter.post('/newAdmin', createAdmin);
authRouter.post('/adminLogin', adminLogin, generateToken);
authRouter.post('/login', userLogin);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/addCompany', company)
export default authRouter;