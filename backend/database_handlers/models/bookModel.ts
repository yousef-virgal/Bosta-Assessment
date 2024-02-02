export interface Book {
    book_id: number,
    title: string,
    author: string,
    isbn: string,
    available_quantity: number,
    shelf_location?: string
}