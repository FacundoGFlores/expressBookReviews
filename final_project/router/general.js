const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password) {
    if(isValid(username)) {
      users.push({username: username, password: password});
      return res.json({message: "User registered successfully"})
    }
    else {
      return res.status(400).json({message: "Username already exists"})
    }
  } else {
    return res.status(400).json({message: "Username or password not provided"})
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const data = await Promise.resolve(books);
    res.json(data);
  } catch {
    res.status(500).send("Error");
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;

    // simulate async access (future-proof)
    const bookByIsbn = await Promise.resolve(books[isbn]);

    if (!bookByIsbn) {
      return res.status(404).send("ISBN not found");
    }

    return res.json(bookByIsbn);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});
  
// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    const { author } = req.params;

    const booksByAuthor = await Promise.resolve(
      Object.values(books).filter(b => b.author === author)
    );

    if (booksByAuthor.length === 0) {
      return res.status(404).send("Author not found");
    }

    return res.json(booksByAuthor);
  } catch {
    return res.status(500).send("Internal Server Error");
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  try {
    const { title } = req.params;

    const booksByTitle = await Promise.resolve(
      Object.values(books).filter(b => b.title === title)
    );

    if (booksByTitle.length === 0) {
      return res.status(404).send("Title not found");
    }

    return res.json(booksByTitle);
  } catch {
    return res.status(500).send("Internal Server Error");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const bookByIsbn = books[isbn]

  if(!bookByIsbn) {
      return res.send("ISBN not found")
  }

  return res.send(bookByIsbn.reviews)
});

module.exports.general = public_users;
