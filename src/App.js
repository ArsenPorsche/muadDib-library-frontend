import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import BooksList from "./components/BooksList";
import MyBooks from "./components/MyBooks";


function App() {
  return (
    <Routes>
      <Route path="/" exact element={<BooksList />} />
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/my-books" exact element={<MyBooks />} />
    </Routes>
  );
}

export default App;