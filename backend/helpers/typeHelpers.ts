/**
 * This Function is used to check if the input is a postive intger number
 * @param input the input to check for
 * @returns a boolean indicating if the input was number or not
 */
export const isPostiveNumber = (input: unknown): boolean => {
    return typeof input === "number" && Number.isFinite(input) && Number(input) >= 0;
}