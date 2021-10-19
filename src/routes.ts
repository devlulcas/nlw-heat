import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLastThreeMessagesController } from "./controllers/GetLastThreeMessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const router = Router();

// Controllers
const authenticateUserController = new AuthenticateUserController();
const createMessageController = new CreateMessageController();
const getLastThreeMessagesController = new GetLastThreeMessagesController();
const profileUserController = new ProfileUserController();

// Rotas
router.post("/authenticate", authenticateUserController.handle);
router.post("/messages", ensureAuthenticated, createMessageController.handle);
router.get("/messages/last3", getLastThreeMessagesController.handle);
router.get("/profile", ensureAuthenticated, profileUserController.handle);

export { router };
