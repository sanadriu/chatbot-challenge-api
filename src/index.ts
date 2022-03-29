import "dotenv/config";
import "module-alias/register";
import { config } from "./config/config";
import { App } from "./app";
import { DatabaseService } from "./resources/services/database.service";
import { ChatController } from "./resources/controllers/chat.controller";
import { ChatService } from "./resources/services/chat.service";
import { ChatRepository } from "./resources/repositories/chat.repository";
import { ChatResults } from "./resources/services/chat.results";

const chatRepository = new ChatRepository();
const chatResults = new ChatResults();
const chatService = new ChatService(chatRepository, chatResults);
const chatController = new ChatController(chatService);

const db = new DatabaseService();

const app = new App(config.port, [chatController], db);

app.listen();
