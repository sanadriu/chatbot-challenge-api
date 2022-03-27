import { ServiceResult } from "../ServiceResult";

export interface IChatService {
	subscribe(id: string, phone: string): Promise<ServiceResult>;
	handleServerReply(id: string, phone: string): Promise<ServiceResult>;
	handleClientReply(id: string, phone: string, value: string): Promise<ServiceResult>;
}
