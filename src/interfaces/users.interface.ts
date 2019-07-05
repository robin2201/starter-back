import { IMedias } from "../utils/s3/s3.utils";

export interface IUserMedias extends IMedias{
    used: boolean;
    created?: Date;
}

export interface IUserAccountValidation {
    ok: boolean;
    token?: string;
    start?: Date;
    end?: Date;
    at?: Date;
    firstLogin?: boolean;
}

export interface IUser {
    _id?: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    validation?: IUserAccountValidation;
    pictures?: IUserMedias[];
    followers?: string[];
    health?: any;
    gender: 'man' | 'woman';
}

// POST request on /users
export interface IUsersPost {
    email: string;
    username: string;
    password: string;
    gender: 'man' | 'woman';
    pictures: IUserMedias[]
}

export interface IProfilePicture {
    createdAt: Date;
    key: string;
    url: string
    default: boolean;
}
