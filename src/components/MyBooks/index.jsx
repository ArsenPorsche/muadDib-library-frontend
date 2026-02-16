import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Navbar from "../Navbar";
import ReviewModal from "../ReviewModal";
import useMyBooks from "./useMyBooks";
import styles from "./styles.module.css";

const MyBooks = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { userBooks, filterRating, setFilterRating, updateBook, deleteBook } = useMyBooks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  const openModal = (userBook) => {
    setCurrentBook(userBook);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);
  };

  const handleUpdate = async ({ rating, comment }) => {
    try {
      await updateBook(currentBook._id, { rating, comment });
      closeModal();
    } catch (error) {
      console.error("Failed to update book:", error);
      alert("Failed to update book.");
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book.");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className={styles.books_container}>
      <Navbar />
      <h1>My Read Books</h1>
      <div className={styles.filters}>
        <div className={styles.rating_filter}>
          <div className={styles.star_row}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.star_btn} ${
                  filterRating >= star ? styles.star_active : ""
                }`}
                onClick={() => setFilterRating(star.toString())}
              >
                ★
              </button>
            ))}
          </div>
          <button
            className={styles.filter_btn}
            onClick={() => setFilterRating("")}
          >
            All my Books
          </button>
        </div>
      </div>
      <div className={styles.books_list}>
        {userBooks.length ? (
          userBooks.map((userBook) =>
            userBook.bookId ? (
              <div key={userBook._id} className={styles.book_card}>
                <div className={styles.book_content}>
                  {userBook.bookId.coverImage && (
                    <img
                      src={userBook.bookId.coverImage}
                      alt={userBook.bookId.title}
                      className={styles.book_image}
                    />
                  )}
                  <h3>{userBook.bookId.title}</h3>
                  <p>Author: {userBook.bookId.author}</p>
                  <p>Genre: {userBook.bookId.genre || "Unknown"}</p>
                  <p>Comment: {userBook.comment}</p>
                  <div className={styles.rating_container}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${styles.star_btn} ${styles.star_display} ${
                          userBook.rating >= star ? styles.star_active : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.card_buttons}>
                  <button
                    className={styles.edit_btn}
                    onClick={() => openModal(userBook)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.delete_btn}
                    onClick={() => handleDelete(userBook._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p key={userBook._id}>Book data unavailable.</p>
            )
          )
        ) : (
          <p className={styles.empty_message}>
            You haven't added any books with such rating.
          </p>
        )}
      </div>
      {isModalOpen && (
        <ReviewModal
          onSubmit={handleUpdate}
          onClose={closeModal}
          initialRating={currentBook.rating.toString()}
          initialComment={currentBook.comment || ""}
          title="Edit Book Review"
        />
      )}
    </div>
  );
};

export default MyBooks;