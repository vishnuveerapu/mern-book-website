
# 📘 Book Website — MERN Stack Project

## 1. Project Abstract

The **Book Website** is a full-stack web application developed using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It serves as a platform for users to manage a digital collection of books. Users can add, edit, delete, and search for books based on title and author.

### Objectives:
- To provide a user-friendly platform for managing a personal or shared book collection.
- To allow CRUD (Create, Read, Update, Delete) operations on books.
- To implement real-time filtering/search functionality based on book title and author.

### Key Features:
- Add new books with details like title, author, genre, and description.
- Edit or delete existing books.
- Search books dynamically by title or author.
- Simple, clean, and responsive user interface using HTML + CSS (no frameworks like Tailwind).
- RESTful API integration with MongoDB backend.

## 2. Technologies Used

### Frontend:
- **React.js**: For building the user interface with component-based architecture.
- **Axios**: For making HTTP requests to the backend API.
- **HTML & CSS**: For structuring and styling the frontend layout.

### Backend:
- **Node.js**: Runtime environment for executing JavaScript on the server.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database used for storing book data.
- **Mongoose**: ODM for connecting and interacting with MongoDB from Node.js.

## 3. System Architecture

```
Frontend (React)
   |
   | (Axios HTTP Requests)
   |
Backend (Node + Express)
   |
   | (Mongoose)
   |
Database (MongoDB)
```

## 4. Functionalities

### 🔍 Book Search
- Users can search books in real-time by entering title or author keywords.

### 📖 Add Book
- Users can input book details and submit to store in MongoDB.

### ✏️ Edit Book
- Users can edit any existing book details via a form.

### 🗑️ Delete Book
- Users can delete a book entry from the database.

## 5. File Structure
```
bookWebsite/
│
├── backend/
│   ├── models/
│   │   └── Book.js
│   ├── uploads/
│   │   └── (list of book files that are uploaded when that book is added)
│   ├── routes/
│   │   └── bookRoutes.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   │   ├── Components/
│   │   │   ├── BookForm.js
│   │   │   ├── BookList.js
│   │   │   ├── SearchBar.js	 
│   │   └── App.css
│   │   └── Pages/
│   │   	     ├── Home.js
│   └── public/
│
└── README.md (this documentation)

```

## 6. Running the Project

### Prerequisites:
- Node.js
- MongoDB (local or cloud via MongoDB Atlas)

### Backend Setup:
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup:
```bash
cd frontend
npm install
npm start
```

### .env (backend)
```env
MONGO_URI=mongodb+srv://bookuser:bookpass123@bookcluster.io3fzru.mongodb.net/
PORT=5000
```

## 7. Future Enhancements

- ✅ Pagination for large datasets.
- ✅ Filter books by genre.
- ⏳ User authentication (sign up/login).
- ⏳ Upload book cover images.
- ⏳ Add ratings and reviews for each book.

## 8. Conclusion

This Book Website demonstrates how to build a complete full-stack web application using the MERN stack. It provides a strong foundation for more advanced features such as authentication, file uploads, and user dashboards. The project is ideal for beginners and intermediate developers aiming to improve their practical understanding of modern web development.
