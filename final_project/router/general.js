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
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const bookByIsbn = books[isbn]

  if(!bookByIsbn) {
      return res.send("ISBN not found")
  }

  return res.send(bookByIsbn)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author 
  const booksValues = Object.values(books)

  const bookByAuthor = booksValues.find(b => b.author === author)
  if(!bookByAuthor) {
    return res.send("Author not found")
  }
  return res.send(bookByAuthor)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title 
  const booksValues = Object.values(books)

  const bookByTitle = booksValues.find(b => b.title === title)
  if(!bookByTitle) {
    return res.send("Title not found")
  }
  return res.send(bookByTitle)
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
