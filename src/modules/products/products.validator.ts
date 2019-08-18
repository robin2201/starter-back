import {ValidationSchema} from "express-validator/check";

export const getProductsValidation: ValidationSchema = {
    skip: {
        in: ['query'],
        optional: false,
        isString: true,
    },
};

export const postProductsValidation: ValidationSchema = {
    // skip: {
    //     in: ['query'],
    //     optional: false,
    //     isString: true,
    // },
};
