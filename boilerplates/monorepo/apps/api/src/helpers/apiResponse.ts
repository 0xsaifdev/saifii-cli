import { Response } from 'express';

export class ApiResponse {
  static ok(res: Response, data: unknown = null, message = 'Success') {
    return res.status(200).json({ success: true, message, data });
  }

  static created(res: Response, data: unknown = null, message = 'Created') {
    return res.status(201).json({ success: true, message, data });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static error(res: Response, message: string, statusCode = 500, errors?: unknown) {
    return res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });
  }
}
