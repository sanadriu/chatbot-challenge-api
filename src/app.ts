import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { IController } from "./utils/interfaces/controllers/controller";
import { IDatabaseService } from "./utils/interfaces/services/database.service";
import { ErrorMiddleware } from "./middlewares/error.middleware";

export class App {
	private server: Application;

	constructor(private port: number, private controllers: IController[], private databaseService: IDatabaseService) {
		this.server = express();

		this.initializeMiddlewares();
		this.initializeControllers();
		this.initializeErrorMiddleware();

		this.server.get("/", (req, res, next) => {
			res.status(200).send("Hello World!");
		});
	}

	private initializeMiddlewares(): void {
		this.server.use(helmet());
		this.server.use(
			cors({
				origin: "*",
			})
		);
		this.server.use(morgan("dev"));
		this.server.use(express.json());
		this.server.use(express.urlencoded({ extended: false }));
	}

	private initializeControllers(): void {
		this.controllers.forEach((controller: IController) => {
			this.server.use(controller.path, controller.router);
		});
	}

	private initializeErrorMiddleware(): void {
		this.server.use(ErrorMiddleware);
	}

	public async listen(): Promise<void> {
		try {
			await this.databaseService.connect();

			this.server.listen(this.port, () => {
				console.log(`Application listening on port ${this.port}`);
			});
		} catch (error) {
			if (error instanceof Error) console.log(error.message);
		}
	}
}
