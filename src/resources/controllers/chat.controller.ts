import { IChatService } from "@/utils/interfaces/services/chat.service";
import { config } from "@/config/config";
import { sseMiddleware } from "@/middlewares/sse.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { HttpException } from "@/utils/exceptions/http.exception";
import { NextFunction, Router, Request, Response } from "express";
import {
	ChatParams,
	chatParamsSchema,
	ChatReplyBody,
	chatReplyBodySchema,
	ChatSubscribeQuery,
	chatSubscribeQuerySchema,
} from "../validation/chat.schema";

export class ChatController {
	public router = Router();
	public path = "/chats";

	constructor(private chatService: IChatService) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			"/:id/subscribe",
			sseMiddleware,
			validationMiddleware(chatParamsSchema, "params"),
			validationMiddleware(chatSubscribeQuerySchema, "query"),
			this.subscribe
		);

		this.router.post(
			"/:id/reply",
			validationMiddleware(chatParamsSchema, "params"),
			validationMiddleware(chatReplyBodySchema, "body"),
			this.reply
		);
	}

	private subscribe = async (
		req: Request<ChatParams, {}, {}, ChatSubscribeQuery>,
		res: Response,
		next: NextFunction
	): Promise<Response | void> => {
		try {
			const { phone } = req.query;
			const { id } = req.params;

			await this.chatService.subscribe(id, phone);

			const connection = setInterval(async () => {
				const result = await this.chatService.handleServerReply(id, phone);
				const { success, message, httpStatus, data } = result;

				res.status(httpStatus).write(`data: ${JSON.stringify({ success, message, data })}\n\n`);

				if (!success) clearInterval(connection);
			}, config.pollingTime);

			req.on("close", () => {
				clearInterval(connection);
			});
		} catch (error) {
			if (error instanceof HttpException) {
				next(error);
			} else {
				next(new HttpException());
			}
		}
	};

	private reply = async (
		req: Request<ChatParams, {}, ChatReplyBody, {}>,
		res: Response,
		next: NextFunction
	): Promise<Response | void> => {
		try {
			const { phone, content } = req.body;
			const { id } = req.params;

			const result = await this.chatService.handleClientReply(id, phone, content);
			const { success, message, httpStatus } = result;

			if (!success) throw new HttpException(httpStatus, message);

			res.status(201).send({
				success,
				message,
			});
		} catch (error) {
			if (error instanceof HttpException) {
				next(error);
			} else {
				next(new HttpException());
			}
		}
	};
}
