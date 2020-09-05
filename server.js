const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const expressSessions = require('express-session');
const bodyParser = require('body-parser');
const sessions = require('express-session');

const app = express();

//Middleware 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(sessions({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));
app.post("/login", (req,res) => {
    console.log(req.body);
})
app.post("/register", (req,res) => {
    console.log(req.body);
})
app.get("/user", (req,res) => {})

app.use(cookieParser("secretcode"));

app.listen(4000, ()=>{
    console.log('server has started');
});