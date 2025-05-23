import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookForm = ({ editBook, setEditBook, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editBook) {
      setFormData({
        title: editBook.title || '',
        author: editBook.author || '',
        genre: editBook.genre || '',
        description: editBook.description || '',
      });
    }
  }, [editBook]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('description', formData.description);
      
      if (selectedFile) {
        formDataToSend.append('attachment', selectedFile);
      }

      if (editBook) {
        await axios.put(`http://localhost:5000/api/books/${editBook._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditBook(null);
      } else {
        await axios.post('http://localhost:5000/api/books', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      // Reset form
      setFormData({ title: '', author: '', genre: '', description: '' });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
      // Trigger book list refresh
      if (onBookAdded) onBookAdded();
      
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditBook(null);
    setFormData({ title: '', author: '', genre: '', description: '' });
    setSelectedFile(null);
    
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input 
        name="title" 
        placeholder="Title" 
        value={formData.title} 
        onChange={handleChange} 
        required 
        disabled={isLoading}
      />
      
      <input 
        name="author" 
        placeholder="Author" 
        value={formData.author} 
        onChange={handleChange} 
        required 
        disabled={isLoading}
      />
      
      <input 
        name="genre" 
        placeholder="Genre" 
        value={formData.genre} 
        onChange={handleChange} 
        disabled={isLoading}
      />
      
      <textarea 
        name="description" 
        placeholder="Description" 
        value={formData.description} 
        onChange={handleChange}
        disabled={isLoading}
      />
      
      <div className="file-input-container">
        <label htmlFor="file-input" className="file-input-label">
          📎 Attach Book File (PDF, DOC, DOCX, TXT, EPUB)
        </label>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,.epub"
          className="file-input"
          disabled={isLoading}
        />
        {selectedFile && (
          <div className="selected-file">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        {editBook && editBook.attachment && !selectedFile && (
          <div className="existing-file">
            Current file: {editBook.attachment.originalName}
          </div>
        )}
      </div>
      
      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : (editBook ? 'Update Book' : 'Add Book')}
        </button>
        {editBook && (
          <button 
            type="button" 
            onClick={handleCancel} 
            className="cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;