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
const User = require('./user');
const mongoPass = require('./foo');

const app = express();

mongoose.connect(
    `mongodb+srv://passport:${mongoPass}@cluster0.hhwfo.mongodb.net/<dbname>?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.log('Mongoose is connected succesfully')
)

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
    User.findOne({username: req.body.username}, async (err,doc) => {
        if(err) throw err;
        if(doc) res.send('User already exists');
        if(!doc) {
            console.log(req.body)
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
            });
            await newUser.save();
            res.send("User created succesfully");
        }
    })
})
app.get("/user", (req,res) => {

})

app.use(cookieParser("secretcode"));

app.listen(4000, ()=>{
    console.log('server has started');
});