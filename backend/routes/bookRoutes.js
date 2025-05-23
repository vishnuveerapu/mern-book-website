const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/books/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedTypes = /pdf|doc|docx|txt|epub/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, TXT, and EPUB files are allowed'));
        }
    }
});

// GET all books with optional search
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let books;
        
        if (search) {
            // Search by title or author using text search
            books = await Book.find({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } }
                ]
            }).sort({ createdAt: -1 });
        } else {
            books = await Book.find().sort({ createdAt: -1 });
        }
        
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new book with file upload
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        const bookData = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description
        };

        // If file was uploaded, add attachment info
        if (req.file) {
            bookData.attachment = {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            };
        }

        const newBook = new Book(bookData);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update a book with optional file upload
router.put('/:id', upload.single('attachment'), async (req, res) => {
    try {
        const bookData = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description
        };

        // If new file was uploaded, add attachment info
        if (req.file) {
            // First, get the existing book to delete old file if exists
            const existingBook = await Book.findById(req.params.id);
            if (existingBook && existingBook.attachment && existingBook.attachment.filename) {
                const oldFilePath = path.join('uploads/books/', existingBook.attachment.filename);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            bookData.attachment = {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            };
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true });
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a book and its associated file
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        // Delete associated file if exists
        if (book && book.attachment && book.attachment.filename) {
            const filePath = path.join('uploads/books/', book.attachment.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book and associated file deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET book file/attachment
router.get('/:id/download', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book || !book.attachment || !book.attachment.filename) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join('uploads/books/', book.attachment.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${book.attachment.originalName}"`);
        res.setHeader('Content-Type', book.attachment.mimetype);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;