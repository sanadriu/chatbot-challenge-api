import { ServiceStatus } from "../../status";

export interface IChatService {
	subscribe(id: string, phone: string): Promise<ServiceStatus>;
	handleServerReply(id: string, phone: string): Promise<ServiceStatus>;
	handleClientReply(id: string, phone: string, value: string): Promise<ServiceStatus>;
}
