import React, { useState } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';

function App() {
  const [editBook, setEditBook] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBookAdded = () => {
    // Trigger a refresh of the book list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container">
      <h1>📚 Book Library Management</h1>
      <p className="subtitle">Manage your book collection with search and file attachments</p>
      
      <BookForm 
        editBook={editBook} 
        setEditBook={setEditBook} 
        onBookAdded={handleBookAdded}
      />
      
      <hr style={{ margin: "2rem 0" }} />
      
      <BookList 
        setEditBook={setEditBook} 
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}

export default App;