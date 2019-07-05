export interface IPostBodySession {
    username: string;
    password: string
}

export interface ISession {
    username: string;
    email: string;
    id?: string;
    sub: string;
    exp: number;
    iat: number;
}
