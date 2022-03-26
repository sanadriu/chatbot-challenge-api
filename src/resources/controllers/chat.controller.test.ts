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

export class ChatControllerTest {
	public router = Router();
	public path = "/chats";

	constructor() {
		this.initializeRoutes();

		this.router.get("/", (req, res, next) => {
			res.status(200).send("Hello Chats!");
		});
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

			if (res.getHeader("Content-Type") === "text/event-stream") {
				let counter = 0;

				const interval = setInterval(() => {
					res.status(200).write("data: TEST\n\n");
					console.log(counter);

					counter++;
				}, 1000);

				req.on("close", () => {
					clearInterval(interval);
				});
			} else {
				res.status(200).send({ phone, id });
			}
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
			const { phone, message } = req.body;
			const { id } = req.params;

			res.status(201).send({ phone, message, id });
		} catch (error) {
			if (error instanceof HttpException) {
				next(error);
			} else {
				next(new HttpException());
			}
		}
	};
}
