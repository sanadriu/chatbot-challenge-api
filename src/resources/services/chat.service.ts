import { IChatService } from "@/utils/interfaces/services/chat.service";
import { serviceStatusList, ServiceStatus, errorServiceStatus } from "@/utils/status";
import { ChatRepository } from "../repositories/chat.repository";

export class ChatService implements IChatService {
	constructor(private chatRepository: ChatRepository) {}

	public async subscribe(id: string, phone: string): Promise<ServiceStatus> {
		try {
			const chat = await this.chatRepository.getChatById(id);

			if (chat === null) return serviceStatusList.chat.notFound();

			const client = await this.chatRepository.getClient(phone, id);

			if (client !== null) return serviceStatusList.client.exists();

			await this.chatRepository.createClient(phone, id);

			return serviceStatusList.client.created();
		} catch (error) {
			return errorServiceStatus(error as Error);
		}
	}

	public async handleServerReply(id: string, phone: string): Promise<ServiceStatus> {
		try {
			const chat = await this.chatRepository.getChatById(id);

			if (chat === null) return serviceStatusList.chat.notFound();

			const client = await this.chatRepository.getClient(phone, id);

			if (client === null) return serviceStatusList.client.notFound();

			const chatStep = this.chatRepository.getCurrentChatStep(client, chat);
			const value = this.chatRepository.getLastClientReply(client);
			const isValid = this.chatRepository.validateClientReply(value, chatStep.datatype, chatStep.options);
			const reply = this.chatRepository.getServerReply(chatStep, client, isValid);

			if (isValid) {
				await this.chatRepository.incrementClientStep(client);
			} else {
				await this.chatRepository.deleteLastClientReply(client);
			}

			return serviceStatusList.chat.getReply(reply);
		} catch (error) {
			return errorServiceStatus(error as Error);
		}
	}

	public async handleClientReply(id: string, phone: string, value: string): Promise<ServiceStatus> {
		try {
			const chat = await this.chatRepository.getChatById(id);

			if (chat === null) return serviceStatusList.chat.notFound();

			const client = await this.chatRepository.getClient(phone, id);

			if (client === null) return serviceStatusList.client.notFound();

			const { name } = this.chatRepository.getCurrentChatStep(client, chat);

			await this.chatRepository.createClientReply(client, name, value);

			return serviceStatusList.client.createdReply();
		} catch (error) {
			return errorServiceStatus(error as Error);
		}
	}
}
