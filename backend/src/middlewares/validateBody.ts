import type { Request, Response, NextFunction } from 'express';
import { safeParse } from 'valibot';
import type { BaseSchema, BaseIssue } from 'valibot';

/**
 * Type definition for Valibot schemas used in validation
 * @template TInput - The input type of the schema
 * @template TOutput - The output type after validation
 * @template TIssue - The type of validation issues that can occur
 */
type SchemaType = BaseSchema<unknown, unknown, BaseIssue<unknown>>;

/**
 * Generic middleware for validating request body against Valibot schemas
 * @param isUpdate - Whether this is an update operation (true) or create operation (false)
 * @param updateSchema - The schema to use for update operations
 * @param postSchema - The schema to use for create operations
 * @returns Express middleware function that validates the request body
 */
export const validateBody = (isUpdate: boolean = false, updateSchema: SchemaType, postSchema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const schema = isUpdate ? updateSchema : postSchema;
      const result = safeParse(schema, req.body);

      if (!result.success) {
        res.status(400).json({
          status: 'Operación fallida',
          message: 'Error al validar el cuerpo de la solicitud.',
          data: {
            errors: result.issues.map(issue => ({
              field: issue.path?.map(p => String(p.key)).join('.') || 'unknown',
              message: issue.message
            }))
          }
        });
        return;
      }

      // If the validation is successful, we assign the validated data to the request
      req.body = result.output;
      next();
    } catch (error) {
      res.status(500).json({
        status: 'Operación fallida',
        message: 'Error interno del servidor.',
        data: []
      });
      return;
    }
  };
}; 