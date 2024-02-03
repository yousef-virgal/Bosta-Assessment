export const isPostiveNumber = (input: unknown): boolean => {
    return typeof input === "number" && Number.isFinite(input) && Number(input) >= 0;
}