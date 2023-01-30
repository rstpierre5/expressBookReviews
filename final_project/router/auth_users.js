const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username;
    });
    if(userswithsamename.length > 0){
        return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let matches = users.filter( (item)=>{
        return (item.username === username && item.password === password);
    })
    if(matches.length > 0){
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password ){
        return res.status(404).send("Both username and password required");
    }

    if(!authenticatedUser(username, password)){
        return res.status(404).send("Credentials do not match existing user");
    }
    let accessToken = jwt.sign( {user: username, pass: password}, "secret-access", {expiresIn: 60 * 30});
    req.session.authorization = {accessToken, username};

    return res.status(200).send("Successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let user = req.session.authorization.username;
    let isbn = req.params.isbn;
    books[isbn]["reviews"][user] = req.body.review;
    return res.status(200).send("Successfully added review");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let user = req.session.authorization.username;
    let isbn = req.params.isbn;
    if(!(user in books[isbn]["reviews"])){
        return res.status(400).send("Review does not exist");
    }
    else{
        delete books[isbn]["reviews"][user];
        return res.status(200).send("Successfully deleted review");
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
