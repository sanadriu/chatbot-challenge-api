export interface ServiceStatus {
	message: string;
	success: boolean;
	httpStatusCode: number;
	data?: any;
}

export const serviceStatusList: Record<string, Record<string, (data?: any) => ServiceStatus>> = {
	chat: {
		notFound: (): ServiceStatus => ({
			message: "Chat not found",
			success: false,
			httpStatusCode: 404,
		}),
		getReply: (data: any): ServiceStatus => ({
			message: "Message fetched successfully",
			success: true,
			httpStatusCode: 200,
			data,
		}),
	},
	client: {
		notFound: (): ServiceStatus => ({
			message: "Client not found",
			success: false,
			httpStatusCode: 404,
		}),
		created: (): ServiceStatus => ({
			message: "Client has subscribed to the chat successfully",
			success: true,
			httpStatusCode: 201,
		}),
		createdReply: (): ServiceStatus => ({
			message: "Client reply saved successfully",
			success: true,
			httpStatusCode: 201,
		}),
		exists: (): ServiceStatus => ({
			message: "Client is already subscribed",
			success: false,
			httpStatusCode: 400,
		}),
	},
};

export function errorServiceStatus<T extends Error>(error: T): ServiceStatus {
	return { ...error, success: false, httpStatusCode: 500 };
}
