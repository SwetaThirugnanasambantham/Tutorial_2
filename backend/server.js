const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite setup
const dbPath = process.env.DB_PATH || path.join(__dirname, 'library.db');
const db = new Database(dbPath);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isbn TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    year INTEGER,
    status TEXT CHECK(status IN ('available','checked_out','reserved')) DEFAULT 'available',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// ── Routes ────────────────────────────────────────────────

// GET all books (optional ?genre= filter)
app.get('/api/books', (req, res) => {
  try {
    const { genre } = req.query;
    let stmt;
    if (genre && genre !== 'all') {
      stmt = db.prepare('SELECT * FROM books WHERE genre = ? ORDER BY created_at DESC');
      return res.json(stmt.all(genre));
    }
    stmt = db.prepare('SELECT * FROM books ORDER BY created_at DESC');
    res.json(stmt.all());
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// GET single book
app.get('/api/books/:id', (req, res) => {
  try {
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book', error: err.message });
  }
});

// POST create a book
app.post('/api/books', (req, res) => {
  try {
    const { isbn, title, author, genre, year, status } = req.body;
    if (!isbn || !title || !author || !genre) {
      return res.status(400).json({ message: 'isbn, title, author and genre are required' });
    }
    const stmt = db.prepare(
      'INSERT INTO books (isbn, title, author, genre, year, status) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(isbn, title, author, genre, year || null, status || 'available');
    const created = db.prepare('SELECT * FROM books WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'A book with that ISBN already exists' });
    }
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
});

// PUT update book status (or any field)
app.put('/api/books/:id', (req, res) => {
  try {
    const { status, title, author, genre, year } = req.body;
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const validStatuses = ['available', 'checked_out', 'reserved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be available, checked_out, or reserved' });
    }

    const updated = {
      title: title ?? book.title,
      author: author ?? book.author,
      genre: genre ?? book.genre,
      year: year ?? book.year,
      status: status ?? book.status,
    };

    db.prepare(
      'UPDATE books SET title=?, author=?, genre=?, year=?, status=? WHERE id=?'
    ).run(updated.title, updated.author, updated.genre, updated.year, updated.status, req.params.id);

    res.json(db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ message: 'Error updating book', error: err.message });
  }
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book', error: err.message });
  }
});

// GET unique genres
app.get('/api/genres', (req, res) => {
  try {
    const genres = db.prepare('SELECT DISTINCT genre FROM books ORDER BY genre').all().map(r => r.genre);
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching genres', error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Library API running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
