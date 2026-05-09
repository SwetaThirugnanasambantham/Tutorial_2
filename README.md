# 📚 Book Library Manager

A full-stack web application for managing a book collection using React.js, Node.js, Express.js, and SQLite.

## Features

- **Browse & Search** – Search books by title, author, or ISBN in real time
- **Status Tracking** – Mark books as *Available*, *Checked Out*, or *Reserved*
- **Genre Filtering** – Filter by genre alongside status
- **CRUD Operations** – Add, update status, and delete books
- **No Database Server Required** – Uses SQLite (single file, zero config)
- **REST API** – Clean, self-documenting endpoints

## Technology Stack

### Frontend
- React 18 + Vite
- Axios for HTTP requests
- CSS3 (no framework)

### Backend
- Node.js + Express 4
- **better-sqlite3** (SQLite – no separate DB server needed)
- dotenv, cors

## Project Structure

```
BookLibrary-main/
├── src/
│   ├── components/
│   │   ├── BookList.jsx / .css
│   │   └── AddBookModal.jsx / .css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
├── package.json
├── vite.config.js
└── index.html
```

## Setup Instructions

### Backend

```bash
cd backend
npm install
node seed.js        # populate with 10 sample books
npm run dev         # nodemon auto-reload on port 4000
```

### Frontend

```bash
# from project root
npm install
npm run dev         # Vite dev server on port 5173
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books` | All books (optional `?genre=Sci-Fi`) |
| GET | `/api/books/:id` | Single book |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update book (any field) |
| DELETE | `/api/books/:id` | Remove a book |
| GET | `/api/genres` | List of distinct genres |

### POST / PUT body

```json
{
  "isbn":   "978-0-00-000000-0",
  "title":  "My Book",
  "author": "Author Name",
  "genre":  "Fiction",
  "year":   2024,
  "status": "available"
}
```

## Database Schema

```sql
CREATE TABLE books (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  isbn       TEXT UNIQUE NOT NULL,
  title      TEXT NOT NULL,
  author     TEXT NOT NULL,
  genre      TEXT NOT NULL,
  year       INTEGER,
  status     TEXT CHECK(status IN ('available','checked_out','reserved')) DEFAULT 'available',
  created_at TEXT DEFAULT (datetime('now'))
);
```

