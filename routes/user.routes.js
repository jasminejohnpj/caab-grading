import { Router } from "express";
import { companyInfo , editCompany ,generateOtp, superadminOtp , branch , branchList , branchDetails} from '../controller/user.controller.js';

const userRouter = Router();

userRouter.get('/companyInfo/:caab_id', companyInfo);
userRouter.put('/editCompany/:caab_id' , editCompany);
userRouter.post('/generateOtp' , generateOtp);
userRouter.post('/verifySuperAdminOtp', superadminOtp);
userRouter.post('/addBranch', branch);
userRouter.get('/listBranches/:caab_id',branchList);
userRouter.get('/branchDetails/:branch_id' , branchDetails);
export default userRouter;
