import { Router } from "express";
import { uploadJson , addQuestions } from "../controller/multiupload.controller.js";

const multiuploadRouter = Router();


multiuploadRouter.post("/uploadJson",  uploadJson);
multiuploadRouter.post('/addQuestions', addQuestions);
export default multiuploadRouter;


