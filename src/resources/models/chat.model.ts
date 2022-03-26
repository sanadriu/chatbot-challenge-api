import { Schema, model, Document } from "mongoose";

export type StepDatatype = "text" | "number" | "integer" | "email" | "date" | "option";
export type StepOptions = Array<string>;

export interface ChatStep {
	name: string;
	datatype?: StepDatatype;
	options?: StepOptions;
	questionMsgTemplate: string;
	warningMsgTemplate: string;
}

export interface Chat {
	name: string;
	sequence: Array<ChatStep>;
}

export interface ChatDocument extends Document<unknown, any, Chat>, Chat {}

const stepSchema = new Schema<ChatStep>({
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
			return (this as ChatStep).datatype === "option";
		},
	},
	questionMsgTemplate: {
		type: String,
		required: true,
	},
	warningMsgTemplate: {
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
