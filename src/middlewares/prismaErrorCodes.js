const { Prisma } = require("@prisma/client");
// https://www.prisma.io/docs/orm/reference/error-reference
const prismaErrorCodes = {
   P2001: {
      statusCode: 404,
      message: "The record searched does not exist.",
   },
   P2002: {
      statusCode: 409,
      message: "Unique constraint failed on the field.",
   },
   P2007: {
      statusCode: 400,
      message: "Data validation error.",
   },
   P2011: {
      statusCode: 400,
      message: "Null constraint violation on the field.",
   },
   P2014: {
      statusCode: 400,
      message:
         "The change you are trying to make would violate the required relation.",
   },
   P2018: {
      statusCode: 404,
      message: "The required connected records were not found.",
   },
   P2024: {
      statusCode: 500,
      message: "Timed out in fetching data from the database.",
   },
   P2025: {
      statusCode: 404,
      message: "Record not found.",
   },
   P2026: {
      statusCode: 500,
      message: "Error starting a database connection.",
   },
   P2027: {
      statusCode: 500,
      message: "Multiple errors occurred during a query.",
   },
};

const getErrorResponse = (error) => {
   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorCode = prismaErrorCodes[error.code];
      if (errorCode) {
         return {
            statusCode: errorCode.statusCode,
            message: errorCode.message,
         };
      }
   }

   if (error instanceof Prisma.PrismaClientValidationError) {
      return {
         statusCode: 400,
         message: "Validation error",
      };
   }

   if (error instanceof Prisma.PrismaClientInitializationError) {
      return {
         statusCode: 500,
         message: "Initialization error",
      };
   }

   if (error instanceof Prisma.PrismaClientRustPanicError) {
      return {
         statusCode: 500,
         message: "Internal server error",
      };
   }

   return {
      statusCode: 500,
      message: "An unexpected error occurred",
   };
};

module.exports = getErrorResponse;
