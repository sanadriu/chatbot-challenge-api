import { Router } from "express-serve-static-core";

export interface IController {
	router: Router;
	path: string;
}
