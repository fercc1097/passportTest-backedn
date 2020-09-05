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
const mongoPass = require('./foo'); // This file is not included in git

const app = express();
const mongoString = `mongodb+srv://passport:${mongoPass()}@cluster0.hhwfo.mongodb.net/<dbname>?retryWrites=true&w=majority`.toString();

mongoose.connect(
    mongoString,
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

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

app.post("/login", (req,res,next) => {
    passport.authenticate('local', (err,user, info) => {
        if(err) throw err;
        if(!user) res.send("No user exists");
        else{
            req.logIn(user,(err)=>{
                if(err) throw err;
                res.send("Succesfully Authenticated")
                console.log(req.user);
            });
        }
    })(req, res, next);
})
app.post("/register", (req,res) => {
    console.log(req.body);
    User.findOne({username: req.body.username}, async (err,doc) => {
        if(err) throw err;
        if(doc) res.send('User already exists');
        if(!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            console.log(hashedPassword);

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            await newUser.save();
            res.send("User created succesfully");
        }
    })
})
app.get("/user", (req,res) => {
    res.send(req.user);
})


app.listen(4000, ()=>{
    console.log('server has started');
});