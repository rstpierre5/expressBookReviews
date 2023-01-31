const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    return !isValid(username);
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username, "password":password});
        return res.status(200).send("User successfully registered. Now you can login");
      } else {
        return res.status(404).send("User already exists!");    
      }
    } 
    return res.status(404).send("Unable to register user, no username or password.");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        resolve(res.status(200).send(JSON.stringify(books, null, 4)));
    });
    myPromise.then(console.log("Sent books"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        let isbn = req.params.isbn;
        resolve(res.status(200).send(JSON.stringify(books[isbn], null, 4)));
    });
    myPromise.then(console.log("Sent books by isbn"));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        let author = req.params.author;
        let details = Object.values(books);
        let book = details.filter((item) =>{
            return item.author === author;
        });
        resolve(res.status(200).send(JSON.stringify(book, null, 4)));
    });
    myPromise.then(console.log("Sent books by author"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        let title = req.params.title;
        let details = Object.values(books);
        let book = details.filter((item) =>{
            return item.title === title;
        });
    resolve(res.status(200).send(JSON.stringify(book, null, 4)));
    });
    myPromise.then(console.log("Sent books by title"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn]["reviews"], null, 4));
});

module.exports.general = public_users;
