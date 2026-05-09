const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'library.db'));

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

const seed = db.prepare(
  'INSERT OR IGNORE INTO books (isbn, title, author, genre, year, status) VALUES (?, ?, ?, ?, ?, ?)'
);

const books = [
  ['978-0-06-112008-4', 'To Kill a Mockingbird',       'Harper Lee',        'Fiction',    1960, 'available'],
  ['978-0-7432-7356-5', '1984',                         'George Orwell',     'Sci-Fi',     1949, 'checked_out'],
  ['978-0-7432-7357-2', 'Brave New World',              'Aldous Huxley',     'Sci-Fi',     1932, 'available'],
  ['978-0-14-028329-7', 'The Great Gatsby',             'F. Scott Fitzgerald','Fiction',   1925, 'reserved'],
  ['978-0-14-243723-7', 'Pride and Prejudice',          'Jane Austen',       'Romance',    1813, 'available'],
  ['978-0-618-00222-3', 'The Lord of the Rings',        'J.R.R. Tolkien',    'Fantasy',    1954, 'checked_out'],
  ['978-0-06-093546-9', 'Thinking, Fast and Slow',      'Daniel Kahneman',   'Non-Fiction',2011, 'available'],
  ['978-0-593-31025-0', 'Atomic Habits',                'James Clear',       'Non-Fiction',2018, 'available'],
  ['978-0-316-76948-0', 'The Catcher in the Rye',       'J.D. Salinger',     'Fiction',    1951, 'reserved'],
  ['978-0-7432-7358-9', 'Dune',                         'Frank Herbert',     'Sci-Fi',     1965, 'available'],
];

const insertMany = db.transaction((rows) => rows.forEach(r => seed.run(...r)));
insertMany(books);

console.log(`Seeded ${books.length} books into the library database.`);
db.close();
