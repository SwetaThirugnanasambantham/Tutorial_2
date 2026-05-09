import { useState } from 'react'
import './BookList.css'

const STATUS_COLORS = {
  available:   '#28a745',
  checked_out: '#dc3545',
  reserved:    '#fd7e14',
}

const STATUS_LABELS = {
  available:   'Available',
  checked_out: 'Checked Out',
  reserved:    'Reserved',
}

function BookList({ books, onUpdateStatus, onDelete, onRefresh }) {
  const [filter, setFilter] = useState('all')
  const [genreFilter, setGenreFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const genres = ['all', ...new Set(books.map(b => b.genre).sort())]

  const filtered = books.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter
    const matchGenre  = genreFilter === 'all' || b.genre === genreFilter
    const matchSearch = !searchTerm ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.includes(searchTerm)
    return matchStatus && matchGenre && matchSearch
  })

  const count = (s) => books.filter(b => b.status === s).length

  const handleDelete = (id, title) => {
    if (window.confirm(`Remove "${title}" from the library?`)) {
      onDelete(id)
    }
  }

  return (
    <div className="book-list">
      <div className="list-header">
        <h2>Library Collection</h2>
        <div className="controls">
          <input
            className="search-box"
            type="text"
            placeholder="Search title, author, ISBN…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <div className="filter-row">
            <div className="filter-group">
              <span className="filter-label">Status:</span>
              {['all', 'available', 'checked_out', 'reserved'].map(s => (
                <button
                  key={s}
                  className={`filter-btn ${filter === s ? 'active' : ''}`}
                  style={filter === s && s !== 'all' ? { backgroundColor: STATUS_COLORS[s] } : {}}
                  onClick={() => setFilter(s)}
                >
                  {s === 'all' ? `All (${books.length})` :
                   s === 'available' ? `Available (${count('available')})` :
                   s === 'checked_out' ? `Checked Out (${count('checked_out')})` :
                   `Reserved (${count('reserved')})`}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <span className="filter-label">Genre:</span>
              <select
                className="genre-select"
                value={genreFilter}
                onChange={e => setGenreFilter(e.target.value)}
              >
                {genres.map(g => (
                  <option key={g} value={g}>{g === 'all' ? 'All Genres' : g}</option>
                ))}
              </select>
            </div>

            <button className="refresh-btn" onClick={onRefresh}>↻ Refresh</button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="no-records">
          <p>📭 No books match your filters</p>
        </div>
      ) : (
        <div className="book-table-wrap">
          <table className="book-table">
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(book => (
                <tr key={book.id}>
                  <td className="isbn">{book.isbn}</td>
                  <td className="title"><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td><span className="genre-tag">{book.genre}</span></td>
                  <td>{book.year ?? '—'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: STATUS_COLORS[book.status] }}
                    >
                      {STATUS_LABELS[book.status]}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      <select
                        className="status-select"
                        value={book.status}
                        onChange={e => onUpdateStatus(book.id, e.target.value)}
                      >
                        <option value="available">Available</option>
                        <option value="checked_out">Checked Out</option>
                        <option value="reserved">Reserved</option>
                      </select>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(book.id, book.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="result-count">Showing {filtered.length} of {books.length} books</p>
        </div>
      )}
    </div>
  )
}

export default BookList
