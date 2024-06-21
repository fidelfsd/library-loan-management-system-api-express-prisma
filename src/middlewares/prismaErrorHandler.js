const getErrorResponse = require("./prismaErrorCodes");

const prismaErrorHandler = (err, req, res, next) => {
   const errorResponse = getErrorResponse(err);
   res.status(errorResponse.statusCode).json({ error: errorResponse.message });
};

module.exports = prismaErrorHandler;
