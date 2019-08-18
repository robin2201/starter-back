import { getCollection } from "../mongo";
import { IProduct } from "../../interfaces/product.interface";

export const getProducts = async (query: { [key: string]: any }, skip = 0): Promise<IProduct[]> => {
    const col = await getCollection('products');

    return col.find(query).skip(skip).toArray();
};
