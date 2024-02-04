/**
 * This interface is used to repesent the Borrower entity in the database
 */
export interface Borrower {
    borrower_id: number; // the borrpwer id
    name: string; // the borrower name
    email: string; // the borrower email
    register_date: Date; // the registeration date for the borrower
}