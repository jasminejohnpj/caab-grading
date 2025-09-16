import { Router } from "express";
import { companyInfo , editCompany ,superadminOtp} from '../controller/user.controller.js';

const userRouter = Router();

userRouter.get('/companyInfo/:caab_id', companyInfo);
userRouter.put('/editCompany/:caab_id' , editCompany);
userRouter.post('/verifySuperAdminOtp', superadminOtp);
export default userRouter;
