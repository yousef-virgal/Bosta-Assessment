// These contsnats are used for the resposne keys
export const STATUS_FIELD = "status";
export const DATA_FIELD = "data";

// This enum is used for the status field values 
export enum STATUS_FIELD_RESPONSE {
    STATUS_FIELD_SUCCESS_RESPONSE = "success",
    STATUS_FIELD_FAILD_RESPONSE = "failed"
};

// This enum represents the avilable routes
export enum ROUTES {
    LOGIN = "/login",
    REGISETR = "/register",
    BOOKS = "/book",
    BORROWER = "/borrower",
    BORROW = "/borrow"
}
