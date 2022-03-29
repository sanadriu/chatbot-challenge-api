import { IChatService } from "@/utils/interfaces/services/chat.service";
import { ChatResults } from "@/resources/services/chat.results";
import { ServiceException } from "@/utils/exceptions/service.exception";
import { ServiceResult } from "@/utils/interfaces/ServiceResult";
import { IChatRepository } from "@/utils/interfaces/repositories/chat.repository";

export class ChatService implements IChatService {
	constructor(private repository: IChatRepository, private results: ChatResults) {}

	public async subscribe(id: string, phone: string): Promise<ServiceResult> {
		try {
			const chat = await this.repository.getChatById(id);

			if (chat === null) return this.results.chatNotFound();

			const client = await this.repository.getClient(phone, id);

			if (client === null) await this.repository.createClient(phone, id);

			return this.results.clientSubscribed();
		} catch (error) {
			return new ServiceException();
		}
	}

	public async handleServerReply(id: string, phone: string): Promise<ServiceResult> {
		try {
			const chat = await this.repository.getChatById(id);

			if (chat === null) return this.results.chatNotFound();

			const client = await this.repository.getClient(phone, id);

			if (client === null) return this.results.clientNotFound();

			if (client.isPending) return this.results.noChatbotReply("Chatbot is pending of getting a reply...");
			if (client.isCompleted) return this.results.noChatbotReply("Client has already fulfilled the chatbot requests.");

			let clientReply = this.repository.getLastClientReply(client);
			let chatbotReply: string;

			if (clientReply?.isValid || clientReply === null) {
				const question = this.repository.getCurrentQuestion(client, chat);
				const isCompleted = this.repository.isChatCompleted(client, chat);

				if (isCompleted) {
					chatbotReply = "Thanks to answer all of our questions! We will get you know anything.";

					this.repository.setClientCompleted(client, true);
				} else {
					chatbotReply = this.repository.getChatbotReplyMsg(question, client);

					this.repository.setClientPending(client, true);
				}
			} else {
				const question = this.repository.getPreviousQuestion(client, chat)!;

				chatbotReply = this.repository.getChatbotReplyErr(question, client);

				this.repository.deleteLastClientReply(client);
				this.repository.setClientPending(client, true);
			}

			await this.repository.saveClient(client);

			return this.results.getChatbotReply(chatbotReply);
		} catch (error) {
			return new ServiceException();
		}
	}

	public async handleClientReply(id: string, phone: string, value: string): Promise<ServiceResult> {
		try {
			const chat = await this.repository.getChatById(id);

			if (chat === null) return this.results.chatNotFound();

			const client = await this.repository.getClient(phone, id);

			if (client === null) return this.results.clientNotFound();

			if (!client.isPending || client.isCompleted) return this.results.ignoredClientReply();

			const { name, datatype, options } = this.repository.getCurrentQuestion(client, chat);

			const isValid = this.repository.validateClientReply(value, datatype, options);

			this.repository.createLastClientReply(client, name, value, isValid);
			this.repository.setClientPending(client, false);

			await this.repository.saveClient(client);

			return this.results.createdClientReply();
		} catch (error) {
			return new ServiceException();
		}
	}
}
