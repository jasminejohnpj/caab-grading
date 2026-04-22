import { Router } from "express";
import { companyInfo , editCompany ,generateOtp, superadminOtp , branch , branchList , branchDetails,
         updateBranch , removeBranch , document , updateDocument ,removeDocument , branchDocuments,
        documentById , evaluationResponse , viewResponse , updateResponse, businessTypes, getDepartmentsByBusinessType} from '../controller/user.controller.js';
import{ verifyToken} from "../middleware/verifytoken.js";
const userRouter = Router();

userRouter.get('/companyInfo/:caab_id',verifyToken, companyInfo);
userRouter.put('/editCompany/:caab_id' , verifyToken,editCompany);
userRouter.post('/generateOtp' ,verifyToken, generateOtp);
userRouter.post('/verifySuperAdminOtp',verifyToken, superadminOtp);



userRouter.post('/addBranch',verifyToken, branch);
userRouter.get('/listBranches/:caab_id',verifyToken,branchList);
userRouter.get('/branchDetails/:branch_id' ,verifyToken, branchDetails);
userRouter.put('/editBranchDetails/:branch_id',verifyToken, updateBranch);
userRouter.delete('/removeBranch/:branch_id',verifyToken, removeBranch);


userRouter.post('/newDocument',verifyToken,document);
userRouter.put('/editDocument/:id',verifyToken,updateDocument);
userRouter.delete('/deleteDocument/:id',verifyToken, removeDocument);
userRouter.get('/branchDocuments/:branch_id',verifyToken,branchDocuments);
userRouter.get('/documentById/:id',verifyToken,documentById);

userRouter.post('/evaluationResponse',verifyToken, evaluationResponse);
userRouter.get('/viewResponse/:branch_id',verifyToken,viewResponse);
userRouter.put('/editResponses/:branch_id', verifyToken,updateResponse);

userRouter.get('/listBusinessType',verifyToken, businessTypes);
userRouter.get('/getDepartmentsByBusinessType/:business_type',verifyToken, getDepartmentsByBusinessType);

export default userRouter;
