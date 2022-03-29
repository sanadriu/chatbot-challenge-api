import { Chat, ChatDocument, Question, QuestionDatatype, QuestionOptions } from "@/resources/models/chat.model";
import { Client, ClientData, ClientDocument } from "@/resources/models/client.model";

export interface IChatRepository {
	getChatById(id: string): Promise<ChatDocument | null>;
	getClient(phone: string, chatId: string): Promise<ClientDocument | null>;
	saveClient(client: ClientDocument): Promise<ClientDocument>;
	createClient(phone: string, chatId: string): Promise<ClientDocument>;
	getLastClientReply(client: Client): ClientData | null;
	createLastClientReply(client: Client, name: string, value: string, isValid: boolean): void;
	deleteLastClientReply(client: Client): void;
	setClientPending(client: Client, isPending: boolean): void;
	setClientCompleted(client: Client, isCompleted: boolean): void;
	isChatCompleted(client: Client, chat: Chat): boolean;
	getCurrentQuestion(client: Client, chat: Chat): Question;
	getPreviousQuestion(client: Client, chat: Chat): Question | null;
	getClientDataObject(client: Client): Record<string, string>;
	getChatbotReplyMsg(question: Question, client: Client): string;
	getChatbotReplyErr(question: Question, client: Client): string;
	validateClientReply(reply?: string, datatype?: QuestionDatatype, options?: QuestionOptions): boolean;
}
