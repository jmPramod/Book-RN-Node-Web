import { ErrorRequestHandler } from "express";

export const ErrorHandelingMiddlewear: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";

  res.status(status).json({
    data: null,
    error: {title:message,status},
    meta:null,
    stack:  err.stack ,
  });
};
