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
} from "../schemas/chat.schema";

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
		console.log("on Subscribe");

		try {
			const { phone } = req.query;
			const { id } = req.params;

			await this.chatService.subscribe(id, phone);

			const connection = setInterval(async () => {
				const result = await this.chatService.handleServerReply(id, phone);

				if (!result.success) throw new HttpException(result.httpStatusCode);

				res.status(200).write(`data: ${JSON.stringify(result.data)}\n\n`);
			}, config.pollingTime);

			req.on("close", () => {
				clearInterval(connection);
			});
		} catch (error) {
			next(error);
		}
	};

	private reply = async (
		req: Request<ChatParams, {}, ChatReplyBody, {}>,
		res: Response,
		next: NextFunction
	): Promise<Response | void> => {
		try {
			const { phone, message } = req.body;
			const { id } = req.params;

			const result = await this.chatService.handleClientReply(id, phone, message);

			if (result.success) throw new HttpException(result.httpStatusCode, result.message);

			res.status(201).send({
				success: true,
				message: result.message,
				data: result.data,
			});
		} catch (error) {
			next(error);
		}
	};
}
