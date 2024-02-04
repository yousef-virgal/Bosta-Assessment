/**
 * This interface is used to represent the junction between the book and borrower entities
 */
export interface BookBorrower {
    book_id: number; // the book id
    borrower_id: number; // the borrower id
    book_title: string; // the book title
    late_period: number; // the number of days the book is late by 
}