import { Schema, Types, model, Model, Document } from "mongoose";
import { boolean } from "yup";

export interface ClientData {
	name: string;
	value: string;
	isValid: boolean;
}

export interface Client {
	chat: Types.ObjectId;
	phone: string;
	datalist: Array<ClientData>;
	isCompleted: boolean;
	isPending: boolean;
}

export interface ClientDocument extends Document<unknown, any, Client>, Client {}

const clientDataSchema = new Schema<ClientData>({
	name: {
		type: String,
		required: true,
	},
	value: {
		type: String,
		required: true,
	},
	isValid: {
		type: Boolean,
		required: true,
	},
});

const clientSchema = new Schema<Client>(
	{
		chat: {
			type: Schema.Types.ObjectId,
			ref: "chat",
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		datalist: {
			type: [clientDataSchema],
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
		isPending: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const ClientModel = model("client", clientSchema);
