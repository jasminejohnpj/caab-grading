import { Router } from "express";
import { uploadJson , uploadbusinesstype } from "../controller/multiupload.controller.js";

const multiuploadRouter = Router();


multiuploadRouter.post("/uploadJson",  uploadJson);
multiuploadRouter.post('/uploadbusinesstype', uploadbusinesstype);
export default multiuploadRouter;


