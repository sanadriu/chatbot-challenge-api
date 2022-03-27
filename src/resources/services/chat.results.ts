import { ServiceResult } from "@/utils/interfaces/ServiceResult";

export class ChatResults {
	public chatNotFound(): ServiceResult {
		return {
			message: "Chat not found",
			success: false,
			httpStatus: 404,
		};
	}

	public getChatbotReply(data: any): ServiceResult {
		return {
			message: "Message fetched successfully",
			success: true,
			httpStatus: 200,
			data,
		};
	}

	public noChatbotReply(reason: string): ServiceResult {
		return {
			message: reason,
			success: true,
			httpStatus: 200,
		};
	}

	public clientNotFound(): ServiceResult {
		return {
			message: "Client not found",
			success: false,
			httpStatus: 404,
		};
	}

	public clientSubscribed(): ServiceResult {
		return {
			message: "Client has subscribed to the chat successfully",
			success: true,
			httpStatus: 200,
		};
	}

	public ignoredClientReply(): ServiceResult {
		return {
			message: "Client reply has been ignored",
			success: true,
			httpStatus: 200,
		};
	}

	public createdClientReply(): ServiceResult {
		return {
			message: "Client reply saved successfully",
			success: true,
			httpStatus: 201,
		};
	}
}
