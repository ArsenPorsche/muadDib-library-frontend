import React, { useState } from "react";
import styles from "./styles.module.css";

const ReviewModal = ({ onSubmit, onClose, initialRating = "", initialComment = "", title = "Add Book Review" }) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      setErrorMsg("Please select a rating.");
      return;
    }
    onSubmit({ rating: parseInt(rating), comment });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <h2>{title}</h2>
        {errorMsg && <p className={styles.error_msg}>{errorMsg}</p>}
        <form onSubmit={handleSubmit} className={styles.review_form}>
          <label>
            Rating:
            <div className={styles.rating_container}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.star_btn} ${rating >= star ? styles.star_active : ""}`}
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
            <button type="submit" className={styles.submit_btn}>
              Submit
            </button>
            <button type="button" className={styles.cancel_btn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
