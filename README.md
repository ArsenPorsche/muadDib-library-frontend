# BookShelf Client

Frontend for a book collection management app. Provides user authentication, book browsing with search/filter/pagination, and personal reading lists with ratings and comments.

## Tech Stack

- React 19
- React Router 7
- Axios
- CSS Modules

## Project Structure

```
client/src/
├── index.js                        # Entry point
├── App.js                          # Route definitions
├── api/                            # HTTP client layer
│   ├── axiosConfig.js              # Axios instance & auth interceptor
│   ├── authApi.js                  # Auth endpoints (login, register)
│   └── booksApi.js                 # Books & user books endpoints
├── services/                       # Business logic layer
│   ├── authService.js              # Auth operations
│   └── bookService.js              # Book & user book operations
├── context/                        # React context providers
│   └── AuthContext.js              # Authentication state
├── components/                     # UI components
│   ├── Navbar/                     # Navigation bar (reusable)
│   │   ├── index.jsx
│   │   └── styles.module.css
│   ├── ReviewModal/                # Rating & comment modal (reusable)
│   │   ├── index.jsx
│   │   └── styles.module.css
│   ├── BooksList/                  # Book catalog page
│   │   ├── index.jsx
│   │   ├── useBooks.js             # Custom hook for book logic
│   │   └── styles.module.css
│   ├── MyBooks/                    # Personal reading list page
│   │   ├── index.jsx
│   │   ├── useMyBooks.js           # Custom hook for user books logic
│   │   └── styles.module.css
│   ├── Login/                      # Login page
│   │   └── index.jsx
│   └── Signup/                     # Registration page
│       └── index.jsx
└── styles/                         # Shared styles
    └── auth.module.css             # Login & Signup shared styles
```

### Architecture

```
Component → Custom Hook → Service → API → Backend
```

Each layer has a single responsibility:

| Layer      | Responsibility                                  |
| ---------- | ----------------------------------------------- |
| Components | UI rendering, user interaction                  |
| Hooks      | State management, business logic for components |
| Services   | Data transformation, orchestration              |
| API        | HTTP requests via Axios                         |
| Context    | Global state (authentication)                   |
| Styles     | CSS Modules, scoped per component               |

## Setup

```bash
npm install
```

Run the development server:

```bash
npm start
```

App runs on [http://localhost:3000](http://localhost:3000).

## Pages

| Route       | Component   | Auth | Description                        |
| ----------- | ----------- | ---- | ---------------------------------- |
| `/`         | BooksList   | No   | Browse books with search & filters |
| `/login`    | Login       | No   | User login                         |
| `/signup`   | Signup      | No   | User registration                  |
| `/my-books` | MyBooks     | Yes  | Personal reading list              |

## Features

- **Book Catalog** — browse, search by title/author, filter by genre, pagination
- **Authentication** — JWT-based login/register with persistent sessions
- **Reading List** — add books with rating (1–5 stars) and comments
- **Edit & Delete** — update or remove books from reading list
- **Rating Filter** — filter personal books by star rating

## Environment

The client expects the backend API running at `http://localhost:8080/api`. This is configured in `src/api/axiosConfig.js`.

## Related

- [BookShelf API (Backend)](https://github.com/ArsenPorsche/muadDib-library-backend)
