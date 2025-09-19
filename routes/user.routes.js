import { Router } from "express";
import { companyInfo , editCompany ,generateOtp, superadminOtp , branch , branchList , branchDetails,
         updateBranch , removeBranch , document , updateDocument ,removeDocument , branchDocuments,
        documentById , evaluationResponse , viewResponse , updateResponse} from '../controller/user.controller.js';

const userRouter = Router();

userRouter.get('/companyInfo/:caab_id', companyInfo);
userRouter.put('/editCompany/:caab_id' , editCompany);
userRouter.post('/generateOtp' , generateOtp);
userRouter.post('/verifySuperAdminOtp', superadminOtp);



userRouter.post('/addBranch', branch);
userRouter.get('/listBranches/:caab_id',branchList);
userRouter.get('/branchDetails/:branch_id' , branchDetails);
userRouter.put('/editBranchDetails/:branch_id', updateBranch);
userRouter.delete('/removeBranch/:branch_id', removeBranch);


userRouter.post('/newDocument',document);
userRouter.put('/editDocument/:id',updateDocument);
userRouter.delete('/deleteDocument/:id', removeDocument);
userRouter.get('/branchDocuments/:branch_id',branchDocuments);
userRouter.get('/documentById/:id',documentById);

userRouter.post('/evaluationResponse', evaluationResponse);
userRouter.get('/viewResponse/:branch_id',viewResponse);
userRouter.put('/editResponses/:branch_id', updateResponse);
export default userRouter;
