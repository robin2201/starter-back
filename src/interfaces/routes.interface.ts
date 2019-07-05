export interface IRoutes {
    method: string;
    path: string;
    session: boolean;
    handler: any[];
    validate?: any;
}