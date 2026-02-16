import { useState, useEffect, useCallback, useContext } from "react";
import { getUserBooks, editUserBook, removeUserBook } from "../../services/bookService";
import AuthContext from "../../context/AuthContext";

const useMyBooks = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [userBooks, setUserBooks] = useState([]);
  const [filterRating, setFilterRating] = useState("");

  const fetchUserBooks = useCallback(async () => {
    try {
      const params = {};
      if (filterRating) params.rating = parseInt(filterRating);
      const data = await getUserBooks(params);
      setUserBooks(data);
    } catch (error) {
      console.error("Error when receiving user books:", error);
    }
  }, [filterRating]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBooks();
    }
  }, [isAuthenticated, fetchUserBooks]);

  const updateBook = async (id, { rating, comment }) => {
    await editUserBook(id, { rating, comment });
    setUserBooks((prev) =>
      prev.map((userBook) =>
        userBook._id === id
          ? { ...userBook, rating, comment }
          : userBook
      )
    );
  };

  const deleteBook = async (id) => {
    await removeUserBook(id);
    setUserBooks((prev) => prev.filter((book) => book._id !== id));
  };

  return {
    userBooks,
    filterRating,
    setFilterRating,
    updateBook,
    deleteBook,
  };
};

export default useMyBooks;
