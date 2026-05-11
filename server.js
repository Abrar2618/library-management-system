const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('SQLite Connected');
    }
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    price INTEGER
)`);

// HOME REDIRECT
app.get('/', (req, res) => {
    res.redirect('/home.html');
});

// Add dummy book
app.get('/add', (req, res) => {

    const sql = `
        INSERT INTO books(title, author, price)
        VALUES (?, ?, ?)
    `;

    db.run(sql, ['Harry Potter', 'J.K Rowling', 500], (err) => {

        if (err) {
            console.log(err.message);
        } else {
            res.send('Book Added Successfully');
        }
    });
});

// ADD BOOK FROM FORM (UPDATED FLOW)
app.get('/addbook', (req, res) => {

    const { title, author, price } = req.query;

    const sql = `
        INSERT INTO books(title, author, price)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [title, author, price], (err) => {

        if (err) {
            console.log(err.message);
            res.send('Error adding book');
        } else {
            // ⭐ IMPORTANT CHANGE (AUTO REDIRECT)
            res.redirect('/books.html');
        }
    });
});

// GET ALL BOOKS
app.get('/books', (req, res) => {

    const sql = `SELECT * FROM books`;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.log(err.message);
        } else {
            res.json(rows);
        }
    });
});

// DELETE BOOK
app.get('/delete/:id', (req, res) => {

    const id = req.params.id;

    const sql = `DELETE FROM books WHERE id = ?`;

    db.run(sql, [id], (err) => {

        if (err) {
            console.log(err.message);
            res.send('Error deleting book');
        } else {
            res.redirect('/books.html');
        }
    });
});

// UPDATE BOOK
app.get('/update/:id', (req, res) => {

    const id = req.params.id;
    const { title, author, price } = req.query;

    const sql = `
        UPDATE books 
        SET title = ?, author = ?, price = ?
        WHERE id = ?
    `;

    db.run(sql, [title, author, price, id], (err) => {

        if (err) {
            console.log(err.message);
            res.send('Error updating book');
        } else {
            res.redirect('/books.html');
        }
    });
});

// SEARCH BOOK
app.get('/search', (req, res) => {

    const keyword = req.query.q;

    const sql = `
        SELECT * FROM books 
        WHERE title LIKE ?
        OR author LIKE ?
    `;

    db.all(sql, [`%${keyword}%`, `%${keyword}%`], (err, rows) => {

        if (err) {
            console.log(err.message);
        } else {
            res.json(rows);
        }
    });
});

// START SERVER
app.listen(8000, () => {
    console.log('Server running on port 8000');
});