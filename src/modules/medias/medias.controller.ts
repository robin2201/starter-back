import { Response, NextFunction } from "express";
import { IRequest } from "../../interfaces/request.interface";
import { deleteMediasService, uploadMedia } from "./medias.service";
import multer from 'multer';
import { IMedias } from "../../utils/s3/s3.utils";

export async function postMediaController(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const storage = multer.memoryStorage();

        const upload = multer({ storage: storage }).single('file');

        upload(req, res, async err => {
                if(err) next(err);

                try {
                        const file = req.file;
                        const picture: IMedias = await uploadMedia(file);

                        res.json(picture);
                } catch (e) {
                        next(e);
                }
        });
}

export async function deleteMediaController(req: IRequest, res: Response, next: NextFunction): Promise<void> {

        try {
                const key: string = req.params.key;
                const baseDir: string = req.query.baseDir;
                const finalKey: string = `${baseDir}/${key}`;

                await deleteMediasService(finalKey);

                res.json();
        } catch (e) {
                next(e);
        }
}
