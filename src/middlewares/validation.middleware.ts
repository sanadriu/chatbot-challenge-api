import { HttpException } from "@/utils/exceptions/http.exception";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { AnyObjectSchema, ValidationError } from "yup";

export function validationMiddleware(schema: AnyObjectSchema, property: "body" | "query" | "params"): RequestHandler {
	return async function (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			req[property] = await schema.validate(req[property], {
				abortEarly: false,
				stripUnknown: true,
			});

			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				next(new HttpException(400, error.message, error.errors));
			} else {
				next(new HttpException());
			}
		}
	};
}
