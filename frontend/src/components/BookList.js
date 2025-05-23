import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';

const BookList = ({ setEditBook, refreshTrigger }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? 
        `http://localhost:5000/api/books?search=${encodeURIComponent(search)}` : 
        'http://localhost:5000/api/books';
      
      const res = await axios.get(url);
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Error fetching books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchTerm);
  }, [refreshTrigger, searchTerm]);

  const deleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      fetchBooks(searchTerm);
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book. Please try again.');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const downloadFile = async (bookId, filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${bookId}/download`, {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h2>Book List</h2>
      
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      
      {searchTerm && (
        <div className="search-results-info">
          Showing results for: "<strong>{searchTerm}</strong>" ({books.length} books found)
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="no-books">
          {searchTerm ? 'No books found matching your search.' : 'No books available. Add your first book!'}
        </div>
      ) : (
        books.map((book) => (
          <div className="book-item" key={book._id}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            {book.genre && <p><strong>Genre:</strong> {book.genre}</p>}
            {book.description && <p><strong>Description:</strong> {book.description}</p>}
            
            {book.attachment && (
              <div className="attachment-info">
                <p><strong>📎 Attached File:</strong></p>
                <div className="file-details">
                  <span className="file-name">{book.attachment.originalName}</span>
                  <span className="file-size">({formatFileSize(book.attachment.size)})</span>
                  <button 
                    onClick={() => downloadFile(book._id, book.attachment.originalName)}
                    className="download-btn"
                    title="Download/Read this book"
                  >
                    📖 Read Book
                  </button>
                </div>
              </div>
            )}
            
            <div className="book-meta">
              <small>Added: {new Date(book.createdAt).toLocaleDateString()}</small>
              {book.updatedAt !== book.createdAt && (
                <small> | Updated: {new Date(book.updatedAt).toLocaleDateString()}</small>
              )}
            </div>
            
            <div className="actions">
              <button onClick={() => setEditBook(book)}>✏️ Edit</button>
              <button onClick={() => deleteBook(book._id)} className="cancel-btn">
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookList;