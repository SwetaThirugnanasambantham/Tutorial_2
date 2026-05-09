import { useState, useEffect } from 'react'
import axios from 'axios'
import BookList from './components/BookList'
import AddBookModal from './components/AddBookModal'
import './App.css'

const API_URL = 'http://localhost:4000/api'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/books`)
      setBooks(res.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch books from the library')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateBookStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/books/${id}`, { status })
      setBooks(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch (err) {
      setError('Failed to update book status')
    }
  }

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_URL}/books/${id}`)
      setBooks(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      setError('Failed to delete book')
    }
  }

  const addBook = async (bookData) => {
    try {
      const res = await axios.post(`${API_URL}/books`, bookData)
      setBooks(prev => [res.data, ...prev])
      setShowAddModal(false)
      setError(null)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add book'
      setError(msg)
    }
  }

  useEffect(() => { fetchBooks() }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>📚 Book Library Manager</h1>
            <p>Track, manage, and organise your library collection</p>
          </div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + Add Book
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading library...</p>
          </div>
        ) : (
          <BookList
            books={books}
            onUpdateStatus={updateBookStatus}
            onDelete={deleteBook}
            onRefresh={fetchBooks}
          />
        )}
      </main>

      {showAddModal && (
        <AddBookModal
          onAdd={addBook}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

export default App
