import { useState, useEffect, useCallback, useContext } from "react";
import { getBooks, getUserBooks, addBookToRead } from "../../services/bookService";
import AuthContext from "../../context/AuthContext";

const useBooks = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [addedBooks, setAddedBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  const fetchBooks = useCallback(async () => {
    try {
      const data = await getBooks({ page, limit, search, genre });
      setBooks(data);
    } catch (error) {
      console.error("Failed to receive books:", error);
    }
  }, [search, genre, page, limit]);

  const fetchAddedBooks = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const data = await getUserBooks();
        const addedBookIds = data.map((userBook) => userBook.bookId._id);
        setAddedBooks(addedBookIds);
      } catch (error) {
        console.error("Failed to fetch added books:", error);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBooks();
    fetchAddedBooks();
  }, [fetchBooks, fetchAddedBooks]);

  const applyFilters = (newSearch, newGenre) => {
    setSearch(newSearch);
    setGenre(newGenre);
    setPage(1);
  };

  const addBook = async ({ bookId, rating, comment }) => {
    await addBookToRead({ bookId, rating, comment });
    setAddedBooks((prev) => [...prev, bookId]);
  };

  const changePage = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    books,
    addedBooks,
    page,
    limit,
    applyFilters,
    addBook,
    changePage,
  };
};

export default useBooks;
