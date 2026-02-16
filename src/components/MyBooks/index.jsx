import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import styles from "../BooksList/styles.module.css";

const MyBooks = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [userBooks, setUserBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [filterRating, setFilterRating] = useState("");

  const fetchUserBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const params = {};
      if (filterRating) params.rating = parseInt(filterRating);

      const response = await axios.get("http://localhost:8080/api/userBooks", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setUserBooks(response.data);
    } catch (error) {
      console.error("Error when receiving user books:", error);
    }
  }, [filterRating]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBooks();
    }
  }, [isAuthenticated, fetchUserBooks]);

  const openModal = (userBook) => {
    setCurrentBookId(userBook._id);
    setRating(userBook.rating);
    setComment(userBook.comment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBookId(null);
    setErrorMsg("");
  };

  const handleDelete = async (bookId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/userBooks/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book. ");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/userBooks/${currentBookId}`,
        { rating: parseInt(rating), comment: comment || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserBooks((prev) =>
        prev.map((userBook) =>
          userBook._id === currentBookId
            ? { ...userBook, rating: parseInt(rating), comment: comment || "" }
            : userBook
        )
      );
      closeModal();
    } catch (error) {
      console.error("Failed to update book:", error);
      alert("Failed to update book. ");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className={styles.books_container}>
      <nav className={styles.navbar}>
        <h1>Muad'Lib</h1>
        <div className={styles.nav_buttons}>
          <Link to="/" className={styles.white_btn}>
            All Books
          </Link>
          <button className={styles.white_btn} onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
      <h1>My Read Books</h1>
      <div className={styles.filters} style={{ marginTop: "0px" }}>
        <div className={styles.rating_container} style={{ flexDirection: "column", }}>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
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
          <div>
            <button
              className={styles.filter_btn}
              onClick={() => setFilterRating("")}
            >
              All my Books
            </button>
          </div>
        </div>
      </div>
      <div className={styles.books_list}>
        {userBooks.length ? (
          userBooks.map((userBook) =>
            userBook.bookId ? (
              <div
                key={userBook._id}
                className={styles.book_card}
                style={{ height: "460px" }}
              >
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
                  <p>
                    <div className={styles.rating_container}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          style={{ pointerEvents: "none" }}
                          className={`${styles.star_btn} ${
                            userBook.rating >= star ? styles.star_active : ""
                          } `}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </p>
                </div>
                <div className={styles.modal_buttons}>
                  <button
                    style={{ background: "green" }}
                    className={styles.green_btn}
                    onClick={() => openModal(userBook)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ background: "orange" }}
                    className={styles.green_btn}
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
          <p>You haven't added any books with such rating.</p>
        )}
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Edit Book Review</h2>
            {errorMsg && <p className={styles.error_msg}>{errorMsg}</p>}
            <form onSubmit={handleUpdate} className={styles.review_form}>
              <label>
                Rating:
                <div className={styles.rating_container}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      className={`${styles.star_btn} ${
                        rating >= star ? styles.star_active : ""
                      }`}
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
    </div>
  );
};

export default MyBooks;
