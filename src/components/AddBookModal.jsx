import { useState } from 'react'
import './AddBookModal.css'

const GENRES = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Biography', 'History', 'Other']

function AddBookModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    isbn: '',
    title: '',
    author: '',
    genre: 'Fiction',
    year: '',
    status: 'available',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await onAdd({
      ...form,
      year: form.year ? parseInt(form.year) : null,
    })
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Book</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label>ISBN *</label>
            <input name="isbn" value={form.isbn} onChange={handleChange} required placeholder="e.g. 978-0-000-00000-0" />
          </div>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Book title" />
          </div>
          <div className="form-group">
            <label>Author *</label>
            <input name="author" value={form.author} onChange={handleChange} required placeholder="Author name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Genre *</label>
              <select name="genre" value={form.genre} onChange={handleChange}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="e.g. 2024" min="1000" max="2099" />
            </div>
          </div>
          <div className="form-group">
            <label>Initial Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="checked_out">Checked Out</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal
