import { NextFunction, Request, Response } from "express";

export function sseMiddleware(req: Request, res: Response, next: NextFunction): void {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Connection", "keep-alive");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Access-Control-Allow-Origin", "*");

	next();
}
