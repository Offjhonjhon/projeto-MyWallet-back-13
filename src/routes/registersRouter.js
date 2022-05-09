import { Router } from "express";

import { getResgisters, createRegister, updateRegister, deleteRegister } from "../controllers/registersController.js";
import { validateToken } from "../middlewares/authMiddleware.js";

const registersRouter = Router();

registersRouter.use(validateToken);

registersRouter.get("/registers", getResgisters);
registersRouter.post("/registers", createRegister);
registersRouter.put("/registers", updateRegister);
registersRouter.delete("/registers", deleteRegister);

export default registersRouter;