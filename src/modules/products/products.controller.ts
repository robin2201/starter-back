import { NextFunction, Request, Response } from "express";
import { createProduct, getProductsService } from "./products.service";

export const getProductsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { skip } = req.query;

        const products = await getProductsService(+skip);

        res.status(200).json(products);
    } catch (e) {
        next(e);
    }
};

export const postProductsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { body } = req;

        await createProduct(body);

        res.sendStatus(203);
    } catch (e) {
        next(e);
    }
};
