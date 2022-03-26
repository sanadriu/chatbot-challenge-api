import "dotenv/config";
import "module-alias/register";
import { config } from "./config/config";
import { App } from "./app";
import { DatabaseService } from "./resources/services/database.service";
import { ChatController } from "./resources/controllers/chat.controller";
import { ChatService } from "./resources/services/chat.service";
import { ChatRepository } from "./resources/repositories/chat.repository";
import { ChatControllerTest } from "./resources/controllers/chat.controller.test";

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);
const testChatController = new ChatControllerTest();

const db = new DatabaseService();

const app = new App([testChatController], Number(config.port), db);

app.listen();
