export interface IPrice {
    unit: {
        value: number;
    },
    vat: {
        value: number;
        percent: number;
    },
    total: {
        value: number;
    },
}
