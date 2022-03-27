import { Chat, ChatDocument, ChatModel, Question, QuestionDatatype, QuestionOptions } from "../models/chat.model";
import { Client, ClientData, ClientDocument, ClientModel } from "../models/client.model";
import { fillTemplate } from "@/helpers/fillTemplate";
import validator from "validator";

export class ChatRepository {
	private chatModel = ChatModel;
	private clientModel = ClientModel;

	public saveClient(client: ClientDocument): Promise<ClientDocument> {
		return client.save({ validateBeforeSave: true, validateModifiedOnly: true });
	}

	public createClient(phone: string, chatId: string): Promise<ClientDocument> {
		return this.clientModel.create({ phone, chat: chatId });
	}

	public getChatById(id: string): Promise<ChatDocument | null> {
		return this.chatModel.findById(id).exec();
	}

	public getClient(phone: string, chatId: string): Promise<ClientDocument | null> {
		return this.clientModel.findOne({ phone, chat: chatId }).exec();
	}

	public getLastClientReply(client: Client): ClientData | null {
		const index = client.datalist.length - 1;

		return index < 0 ? null : client.datalist[index];
	}

	public createClientReply(client: Client, name: string, value: string, isValid: boolean): void {
		client.datalist.push({ name, value, isValid });
	}

	public deleteLastClientReply(client: Client): void {
		client.datalist.pop();
	}

	public setClientPending(client: Client, isPending: boolean): void {
		client.isPending = isPending;
	}

	public setClientCompleted(client: Client, isCompleted: boolean): void {
		client.isCompleted = isCompleted;
	}

	public hasBeenCompleted(client: Client, chat: Chat) {
		return chat.sequence.length === client.datalist.length;
	}

	public getCurrentQuestion(client: Client, chat: Chat): Question {
		return chat.sequence[client.datalist.length];
	}

	public getPreviousQuestion(client: Client, chat: Chat): Question | null {
		const index = client.datalist.length - 1;

		return index < 0 ? null : chat.sequence[index];
	}

	public getClientDataObject(client: Client) {
		const dataObj: Record<string, string> = {};

		client.datalist.forEach((item: ClientData) => (dataObj[item.name] = item.value));

		return dataObj;
	}

	public getChatbotReplyMsg(question: Question, client: Client): string {
		const clientDataObj = this.getClientDataObject(client);

		return fillTemplate(question.msgTemplate, clientDataObj);
	}

	public getChatbotReplyErr(question: Question, client: Client): string {
		const clientDataObj = this.getClientDataObject(client);

		return fillTemplate(question.errTemplate, clientDataObj);
	}

	public validateClientReply(reply?: string, datatype?: QuestionDatatype, options?: QuestionOptions): boolean {
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
