import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Navbar from "../Navbar";
import ReviewModal from "../ReviewModal";
import useBooks from "./useBooks";
import styles from "./styles.module.css";

const BooksList = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { books, addedBooks, page, limit, applyFilters, addBook, changePage } = useBooks();

  const [tempSearch, setTempSearch] = useState("");
  const [tempGenre, setTempGenre] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);

  const handleApplyFilters = () => {
    applyFilters(tempSearch, tempGenre);
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
  };

  const handleAddToRead = async ({ rating, comment }) => {
    try {
      await addBook({ bookId: currentBookId, rating, comment });
      closeModal();
    } catch (error) {
      console.error("Failed to add book:", error);
      alert("Failed to add book. Please log in.");
    }
  };

  return (
    <div className={styles.books_container}>
      <Navbar />
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
                {addedBooks.includes(book._id) ? "Added" : "Add to Read"}
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
        <ReviewModal
          onSubmit={handleAddToRead}
          onClose={closeModal}
          title="Add Book Review"
        />
      )}
      <div className={styles.pagination}>
        <button
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
          className={styles.page_btn}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => changePage(page + 1)}
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
