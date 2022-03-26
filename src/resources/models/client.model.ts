import { Schema, Types, model, Model, Document } from "mongoose";

export interface ClientData {
	name: string;
	value: string;
	status: "valid" | "invalid" | "pending";
}

export interface Client {
	chat: Types.ObjectId;
	phone: string;
	datalist: Array<ClientData>;
	currentStep: number;
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
	// status: {
	// 	type: String,
	// 	required: true,
	// }
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
		currentStep: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const ClientModel = model("client", clientSchema);
