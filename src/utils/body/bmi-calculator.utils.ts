
export const BMICalculator = async (height: number, weight: number): Promise<any> => {
    return weight / ( height * height );
};
