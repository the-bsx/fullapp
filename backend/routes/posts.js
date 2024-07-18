import express from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Create a post
router.post('/', authenticate, (req, res) => {
    const { title, content } = req.body;
    db.query('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, req.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Post created' });
    });
});

// Get all posts
router.get('/', (req, res) => {
    db.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Update a post
router.put('/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.query('UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?', [title, content, id, req.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Post not found or not authorized' });
        res.json({ message: 'Post updated' });
    });
});

// Delete a post
router.delete('/:id', authenticate, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [id, req.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Post not found or not authorized' });
        res.json({ message: 'Post deleted' });
    });
});

export default router;
