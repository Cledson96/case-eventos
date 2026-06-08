import type { RequestHandler, Response } from "express";
import type { ZodType } from "zod";

type ValidationSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export type ValidatedRequest<TBody = unknown, TQuery = unknown, TParams = unknown> = {
  body: TBody;
  query: TQuery;
  params: TParams;
};

export type ValidatedResponse<TBody = unknown, TQuery = unknown, TParams = unknown> = Response<
  unknown,
  {
    validatedRequest: ValidatedRequest<TBody, TQuery, TParams>;
  }
>;

export function validateRequest(schemas: ValidationSchemas): RequestHandler {
  return (request, response, next): void => {
    try {
      response.locals.validatedRequest = {
        body: schemas.body ? schemas.body.parse(request.body) : request.body,
        query: schemas.query ? schemas.query.parse(request.query) : request.query,
        params: schemas.params ? schemas.params.parse(request.params) : request.params,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
