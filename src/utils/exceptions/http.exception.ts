export class HttpException extends Error {
	constructor(public status: number = 500, public message: string = "Something went wrong", public errors?: string[]) {
		super(message);
	}
}
