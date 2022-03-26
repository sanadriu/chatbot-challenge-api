import { Chat, ChatModel, ChatStep, StepDatatype, StepOptions } from "../models/chat.model";
import { Client, ClientData, ClientDocument, ClientModel } from "../models/client.model";
import { fillTemplate } from "@/helpers/fillTemplate";
import validator from "validator";

export class ChatRepository {
	private chatModel = ChatModel;
	private clientModel = ClientModel;

	public getChatById(id: string) {
		return this.chatModel.findById(id);
	}

	public getClient(phone: string, chatId: string) {
		return this.clientModel.findOne({ phone, chat: chatId });
	}

	public createClient(phone: string, chatId: string) {
		return this.clientModel.create({ phone, chat: chatId });
	}

	public createClientReply(client: ClientDocument, name: string, value: string) {
		return client.update({ $push: { datalist: { name, value } } }, { runValidators: true, new: true });
	}

	public getLastClientReply(client: Client) {
		return client.datalist.at(-1)?.value;
	}

	public deleteLastClientReply(client: ClientDocument) {
		return client.update({ $pop: { datalist: 1 } }, { runValidators: true, new: true });
	}

	public incrementClientStep(client: ClientDocument) {
		return client.update({ $inc: { currentStep: 1 } });
	}

	public getCurrentChatStep(client: Client, chat: Chat): ChatStep {
		return chat.sequence[client.currentStep];
	}

	public getClientDataObject(client: Client) {
		const dataObj: Record<string, string> = {};

		client.datalist.forEach((item: ClientData) => (dataObj[item.name] = item.value));

		return dataObj;
	}

	public getServerReply(step: ChatStep, client: Client, isValid: boolean): string {
		const dataObj = this.getClientDataObject(client);

		if (isValid) {
			return fillTemplate(step.warningMsgTemplate, dataObj);
		} else {
			return fillTemplate(step.questionMsgTemplate, dataObj);
		}
	}

	public validateClientReply(reply?: string, datatype?: StepDatatype, options?: StepOptions): boolean {
		if (reply === undefined) return false;

		switch (datatype) {
			case "text":
				return validator.isAlphanumeric(reply);
			case "date":
				return validator.isDate(reply, { format: "YYYY-MM-DD" });
			case "email":
				return validator.isEmail(reply);
			case "number":
				return validator.isNumeric(reply);
			case "integer":
				return validator.isInt(reply);
			case "option":
				return options !== undefined && options.includes(reply);
			default:
				return true;
		}
	}
}
