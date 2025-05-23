const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: String,
    genre: String,
    description: String,
    // New field for file attachment
    attachment: {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

// Add text index for search functionality
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);