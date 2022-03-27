export class ServiceException extends Error {
	public success = false;

	constructor(public httpStatus: number = 500, public message: string = "Something went wrong") {
		super(message);
	}
}
