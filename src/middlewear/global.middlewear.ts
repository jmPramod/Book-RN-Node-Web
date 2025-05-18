import { ErrorRequestHandler } from "express";

export const ErrorHandelingMiddlewear: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";

  res.status(status).json({
    status,
    message,
    data: null,
    error: message,
    stack:  err.stack ,
  });
};
