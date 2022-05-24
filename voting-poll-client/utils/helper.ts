export const convertWeiToNumber = (num: string) => {
    return Math.round(parseFloat(num) * 10 ** 18);
}