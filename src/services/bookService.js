import { fetchBooks, fetchUserBooks, addUserBook, updateUserBook, deleteUserBook } from "../api/booksApi";

export async function getBooks({ page, limit, search, genre }) {
    const { data } = await fetchBooks({ page, limit, search, genre });
    return data;
}

export async function getUserBooks(params = {}) {
    const { data } = await fetchUserBooks(params);
    return data;
}

export async function addBookToRead({ bookId, rating, comment }) {
    const { data } = await addUserBook({ bookId, rating, comment });
    return data;
}

export async function editUserBook(id, { rating, comment }) {
    const { data } = await updateUserBook(id, { rating, comment });
    return data;
}

export async function removeUserBook(id) {
    const { data } = await deleteUserBook(id);
    return data;
}