import { ValidationSchema } from "express-validator/check";

export const PostSessionSchemaValidator: ValidationSchema = {
    username: {
        in: ['body'],
        optional: false,
        isAlpha: {
            errorMessage: 'bad_request_username',
        },
        isLength: {
            errorMessage: 'bad_request',
            options: { min: 2, max: 25 }
        }
    },
    password: {
        in: ['body'],
        optional: false,
        isLength: {
            errorMessage: 'bad_request_password',
            options: { min: 8, max: 35 }
        },
    },
};
