import { Router } from "express";
import {
    Department, Departments, updateDepartment, removeDept, deptById, listDept, getDepartmentsByBusinessType,
    Businesstype, businessTypes, updateBusinessType, removeBusinesstype, businesstypeByid,
    newLaw, listLaws, updateLaw, deleteLaw, NewQuestions, questions, deleteQuestions, evaluation,
    listSections, companies
} from "../controller/admin.controller.js";
import { verifyToken } from "../middleware/verifytoken.js";

const adminRouter = Router();

adminRouter.post("/newDepartment", verifyToken, Department);
adminRouter.get('/departments', verifyToken, Departments);
adminRouter.put('/updateDepartment/:id', verifyToken, updateDepartment);
adminRouter.delete('/deleteDepartment/:id', verifyToken, removeDept);
adminRouter.get('/getDepartmentById/:id', verifyToken, deptById);
adminRouter.get('/listDepartment', verifyToken, listDept);
adminRouter.get('/getDepartmentsByBusinessType/:business_type', verifyToken, getDepartmentsByBusinessType);


adminRouter.post('/addBusinessType', verifyToken, Businesstype);
adminRouter.get('/listBusinessType', verifyToken, businessTypes);
adminRouter.put('/updateBusinessType/:id', verifyToken, updateBusinessType);
adminRouter.delete('/deleteBusinessType/:id', verifyToken, removeBusinesstype);
adminRouter.get('/getBusinessTypeById/:id', verifyToken, businesstypeByid);


adminRouter.post('/addLaw', verifyToken, newLaw);
adminRouter.get('/listlaws', verifyToken, listLaws);
adminRouter.put('/updateLaw/:id', verifyToken, updateLaw);
adminRouter.delete('/deleteLaw/:id', verifyToken, deleteLaw);


adminRouter.post('/addQuestions', verifyToken, NewQuestions);
adminRouter.get('/listQuestions', verifyToken, questions);
adminRouter.delete('/removeQuestions/:id', verifyToken, deleteQuestions);
adminRouter.get('/evaluationQuestions', verifyToken, evaluation);



adminRouter.get('/listSections', verifyToken, listSections);
adminRouter.get('/listCompanies', verifyToken, companies);
export default adminRouter;
