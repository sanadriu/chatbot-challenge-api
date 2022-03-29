import { object, string, InferType } from "yup";
import validator from "validator";

export const chatSubscribeQuerySchema = object({
	phone: string()
		.required()
		.test(
			"phone",
			"Phone number is not valid",
			(value) => typeof value === "string" && validator.isMobilePhone(value, "es-ES")
		)
		.label("Phone"),
});

export const chatReplyBodySchema = object({
	phone: string()
		.required()
		.test(
			"phone",
			"Phone number is not valid",
			(value) => typeof value === "string" && validator.isMobilePhone(value, "es-ES")
		)
		.label("Phone"),
	content: string().required().label("Content"),
});

export const chatParamsSchema = object({
	id: string()
		.required()
		.test("chat", "Chat ID is not valid", (value) => typeof value === "string" && validator.isMongoId(value))
		.label("Chat ID"),
});

export interface ChatSubscribeQuery extends InferType<typeof chatSubscribeQuerySchema> {}
export interface ChatReplyBody extends InferType<typeof chatReplyBodySchema> {}
export interface ChatParams extends InferType<typeof chatParamsSchema> {}
