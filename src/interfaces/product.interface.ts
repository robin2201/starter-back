import { ObjectId } from "mongodb";
import { IPrice } from "./price.interface";

export interface IProduct {
    _id: ObjectId;
    name: string;
    label: string;
    quantity: number;
    price: IPrice;
    pictures: any[];
    description: string;
}
