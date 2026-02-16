import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import styles from "./styles.module.css";

const BooksList = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [addedBooks, setAddedBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [tempGenre, setTempGenre] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchBooks = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;
      params.page = page;
      params.limit = limit;

      const response = await axios.get("http://localhost:8080/api/books", {
        params,
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to recieve book:", error);
    }
  }, [search, genre, page, limit]);

  const fetchAddedBooks = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/userBooks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addedBookIds = response.data.map((userBook) => userBook.bookId._id);
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

  const handleApplyFilters = () => {
    setSearch(tempSearch);
    setGenre(tempGenre);
    setPage(1);
    fetchBooks();
  };

  const openModal = (bookId) => {
    if (addedBooks.includes(bookId)) {
      alert("This book has already been added");
      return;
    }
    setCurrentBookId(bookId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBookId(null);
    setRating("");
    setComment("");
    setErrorMsg("");
  };

  const handleAddToRead = async (e) => {
    e.preventDefault();
    if (!rating) {
      setErrorMsg("Please select a rating.");
      return;
    }
    try {
      const token = localStorage.getItem("token");    

      await axios.post(
        "http://localhost:8080/api/userBooks",
        { bookId: currentBookId, rating: parseInt(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddedBooks((prev) => [...prev, currentBookId]);
      closeModal()
    } catch (error) {
      console.error("Failed to add book:", error);
      alert("Failed to add book. Please log in.");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.books_container}>
      <nav className={styles.navbar}>
        <h1>Muad'Lib</h1>
        {isAuthenticated ? (
          <div className={styles.nav_buttons}>
            <Link to="/my-books" className={styles.white_btn}>
              My Books
            </Link>
            <button className={styles.white_btn} onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.nav_buttons}>
            <Link to="/login" className={styles.white_btn}>
              Login
            </Link>
          </div>
        )}
      </nav>
      <h1>Welcome to the Library</h1>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          className={styles.search_input}
        />
        <select
          value={tempGenre}
          onChange={(e) => setTempGenre(e.target.value)}
          className={styles.genre_select}
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Biography">Biography</option>
          <option value="History">History</option>
          <option value="Mystery">Mystery</option>
          <option value="Romance">Romance</option>
        </select>
        <button className={styles.filter_btn} onClick={handleApplyFilters}>
          Apply Filters
        </button>
      </div>
      <div className={styles.books_list}>
        {books.map((book) => (
          <div key={book._id} className={styles.book_card}>
            <div className={styles.book_content}>
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className={styles.book_image}
                />
              )}
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
            </div>
            {isAuthenticated ? (
              <button
                className={
                  addedBooks.includes(book._id)
                    ? styles.added_btn
                    : styles.green_btn
                }
                onClick={() => openModal(book._id)}
              >
                {addedBooks.includes(book._id)
                    ? "Added"
                    : "Add to Read"}
              </button>
          
            ) : (
              <p className={styles.auth_prompt}>
                <Link to="/login">Log in</Link> to add
              </p>
            )}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Add Book Review</h2>
            {errorMsg && <p className={styles.error_msg}>{errorMsg}</p>}
            <form onSubmit={handleAddToRead} className={styles.review_form}>
              <label>
                Rating:
                <div className={styles.rating_container}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      className={`${styles.star_btn} ${rating >= star ? styles.star_active : ''}`}
                      onClick={() => setRating(star.toString())}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </label>
              <label>
                Comment:
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  className={styles.comment_textarea}
                  required
                />
              </label>
              <div className={styles.modal_buttons}>
                <button type="submit" className={styles.green_btn}>
                  Submit
                </button>
                <button
                  type="button"
                  className={styles.white_btn}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={styles.page_btn}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={books.length < limit}
          className={styles.page_btn}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BooksList;
