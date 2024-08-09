// src/utils/errorResponse.ts

import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
}

const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
  const errorResponse: ErrorResponse = {
    statusCode,
    message,
  };
  return res.status(statusCode).json(errorResponse);
};

export default sendErrorResponse;
