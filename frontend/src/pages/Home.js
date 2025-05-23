import React, { useState } from 'react';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';

const Home = () => {
  const [editBook, setEditBook] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📖 Book Website</h1>
      <BookForm editBook={editBook} setEditBook={setEditBook} />
      <hr />
      <BookList onEdit={setEditBook} />
    </div>
  );
};

export default Home;
