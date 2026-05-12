const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('public'));

// =======================
// FILE DATABASE
// =======================
const DATA_FILE = 'books.json';

// Get books
function getBooks() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save books
function saveBooks(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// =======================
// HOME
// =======================
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// =======================
// ADD BOOK
// =======================
app.get('/addbook', (req, res) => {
    const { title, author, price } = req.query;

    let books = getBooks();

    books.push({
        id: Date.now(),
        title,
        author,
        price
    });

    saveBooks(books);

    res.redirect('/books.html');
});

// =======================
// GET ALL BOOKS
// =======================
app.get('/books', (req, res) => {
    res.json(getBooks());
});

// =======================
// DELETE BOOK
// =======================
app.get('/delete/:id', (req, res) => {
    let books = getBooks();

    books = books.filter(b => b.id != req.params.id);

    saveBooks(books);

    res.redirect('/books.html');
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});