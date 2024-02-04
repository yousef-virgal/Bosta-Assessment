/**
 * This interface is used to represent the book entity in the database
 */
export interface Book {
    book_id: number, // the book id
    title: string, // the book title
    author: string, // the author of the book
    isbn: string, // the isbn of the book
    available_quantity: number, // the number of avaiable quantities
    shelf_location: string // the location of the book
}