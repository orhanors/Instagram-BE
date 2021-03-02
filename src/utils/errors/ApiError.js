class ApiError {
	constructor(httpStatusCode = 500, message = "Internal Server Error") {
		this.httpStatusCode = httpStatusCode;
		this.message = message;
	}
}

module.exports = ApiError;
