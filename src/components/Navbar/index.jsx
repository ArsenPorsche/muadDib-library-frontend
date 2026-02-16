import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import styles from "./styles.module.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to="/" className={styles.logo_link}>Muad'Lib</Link>
      </h1>
      {isAuthenticated ? (
        <div className={styles.nav_buttons}>
          <Link to="/" className={styles.white_btn}>
            All Books
          </Link>
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
  );
};

export default Navbar;
