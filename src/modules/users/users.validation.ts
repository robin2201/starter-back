import { ValidationSchema } from "express-validator/check";

// Gender validation, only 2 values possible => man, woman
const genderValidator: ValidationSchema = {
    gender: {
        in: ['body'],
        isIn: {
            options: [ 'man', 'woman' ],
            errorMessage: 'bad_gender_format'
        },
        optional: false,
    },
};

// Picture profile validation use IMedias[] as interface
export const pictureValidator: ValidationSchema = {
    pictures: {
        in: ['body'],
        optional: false,
        isArray: {
            options: { min: 1 },
            errorMessage: 'empty_picture_field',
        }
    },
    ['pictures.*.key']: {
        in: ['body'],
        optional: false,
        isString: {
            options: { min: 1 },
            errorMessage: 'empty_picture_key_field',
        }
    },
    ['pictures.*.url']: {
        in: ['body'],
        optional: false,
        isString: {
            options: { min: 1 },
            errorMessage: 'empty_picture_key_field',
        }
    },
    ['pictures.*.used']: {
        in: ['body'],
        optional: false,
        isBoolean: {
            errorMessage: 'empty_picture_used_field',
        }
    },
};

// Name profile validator
const usernameValidator: ValidationSchema = {
    username: {
        in: ['body'],
        optional: false,
        isAlpha: {
            errorMessage: 'bad_request_username',
        },
        isLength: {
            errorMessage: 'bad_request_username',
            options: { min: 2, max: 25 }
        }
    },
};

// Email validator
const emailValidator: ValidationSchema = {
    email: {
        in: ['body'],
        optional: false,
        isEmail: {
            errorMessage: 'bad_request_email',
        },
    },
};

// Password validator
const passwordValidator: ValidationSchema = {
    password: {
        in: ['body'],
        optional: false,
        isLength: {
            errorMessage: 'bad_request_password',
            options: { min: 8, max: 35 }
        },
    },
};

// Validation used in POST /users
export const PostUsersSchemaValidator: ValidationSchema = {
    ...usernameValidator,
    ...emailValidator,
    ...passwordValidator,
    ...genderValidator,
    ...pictureValidator
};


// Validation used in POST /users/credentials
export const PostCheckNameOrEmailValidator: ValidationSchema = {
    ...usernameValidator,
    ...emailValidator,
};
