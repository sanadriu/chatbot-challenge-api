import { Schema, model, Document } from "mongoose";

export type QuestionDatatype = "text" | "number" | "integer" | "email" | "date" | "option";
export type QuestionOptions = Array<string>;

export interface Question {
	name: string;
	datatype?: QuestionDatatype;
	options?: QuestionOptions;
	msgTemplate: string;
	errTemplate: string;
}

export interface Chat {
	name: string;
	sequence: Array<Question>;
}

export interface ChatDocument extends Document<unknown, any, Chat>, Chat {}

const stepSchema = new Schema<Question>({
	name: {
		type: String,
		required: true,
	},
	datatype: {
		type: String,
		enum: ["text", "number", "integer", "email", "date", "option"],
	},
	options: {
		type: [String],
		required: function () {
			return (this as Question).datatype === "option";
		},
	},
	msgTemplate: {
		type: String,
		required: true,
	},
	errTemplate: {
		type: String,
		required: true,
	},
});

const chatSchema = new Schema<Chat>(
	{
		name: {
			type: String,
			required: true,
		},
		sequence: [stepSchema],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const ChatModel = model("chat", chatSchema);
