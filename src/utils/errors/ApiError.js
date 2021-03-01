class ApiError {
	constructor(httpStatusCode = 500, message) {
		this.httpStatusCode = httpStatusCode;
		this.message = message;
	}
}

module.exports = ApiError;
