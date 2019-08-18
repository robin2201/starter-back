import { getProducts } from "./products.query";
import { MyError } from "../../utils/errors/errors.utils";
import { IProduct } from "../../interfaces/product.interface";

export const getProductsService = async (skip: number): Promise<any> => {
    const products: IProduct[] = await getProducts({}, skip);

    if (!products) {
        throw new MyError('products_not_found', 404);
    }

    return products;
};

export const createProduct = async (product: any): Promise<any> => {
    console.log(product);
    return;
    //
    // if (!products) {
    //     throw new MyError('products_not_found', 404);
    // }
    //
    // return products;
};
