import { Router } from "express";
import { postMediaController, deleteMediaController } from "./medias.controller";
import addRoutes from "../../utils/router/router.utils";
import { IRoutes } from "../../interfaces/routes.interface";
import { deleteMediasValidator } from "./medias.validation";

const routes: IRoutes[] = [
    {
        method: 'post',
        path: '/medias',
        session: false,
        handler: [ postMediaController ]
    },
    {
        method: 'delete',
        path: '/medias/:key',
        session: false,
        validate: deleteMediasValidator,
        handler: [ deleteMediaController ]
    }
];

export default async (): Promise<Router> => {
    return addRoutes(routes, 'medias');
}
