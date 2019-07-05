import { ValidationSchema } from "express-validator/check";

const keyS3Params: ValidationSchema = {
    key: {
        in: ['params'],
        optional: false,
        isString: {
            options: { min: 1 },
            errorMessage: 'invalid_key_params'
        }
    }
};

export const deleteMediasValidator: ValidationSchema = {
  ...keyS3Params
};