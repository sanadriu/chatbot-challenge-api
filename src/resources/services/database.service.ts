import { IDatabaseService } from "@/utils/interfaces/services/database.service";
import { config } from "../../config/config";
import mongoose from "mongoose";

export class DatabaseService implements IDatabaseService {
	public async connect(): Promise<void> {
		const {
			db: { path, user, pass },
		} = config;

		const uri = user && pass ? `mongodb://${user}:${pass}@${path}` : `mongodb://${path}`;

		await mongoose.connect(uri);

		console.log("Connection with MongoDB established");
	}

	public async disconnect(): Promise<void> {
		await mongoose.disconnect();

		console.log("Closed connection with MongoDB.");
	}
}
