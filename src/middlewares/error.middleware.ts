import { HttpException } from "@/utils/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";

export function ErrorMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction): void {
	const contentType = res.getHeader("Content-Type");

	switch (contentType) {
		case "text/event-stream":
			res.status(error.status).send();
			break;
		default:
			res.status(error.status).send({
				success: false,
				message: error.message,
				errors: error.errors,
			});
			break;
	}
}
