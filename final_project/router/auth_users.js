const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password) {
    if(authenticatedUser(username,password)) {
      //create a JWT token

      let token = jwt.sign({username: username}, 'fingerprint_customer', { expiresIn: '1h' });
      req.session.authorization = {
        token, username
      }
      console.log({token})
      return res.send("User logged in successfully");
    }
    else {
      return res.send("Username or password is incorrect");
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;

  let username = req.user

  if(!username) {
    return res.status(400).json({message: 'User not logged in'})
  }

  const bookByIsbn = books[isbn]
  if(!bookByIsbn) {
    return res.status(400).json({message: 'ISBN not found'})
  }

  if(bookByIsbn.reviews[username]) {
    bookByIsbn.reviews[username] = review
    return res.status(200).json({message: 'Review modified'})
  }

  bookByIsbn.reviews[username] = review
  return res.status(200).json({message: 'Review added'})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
