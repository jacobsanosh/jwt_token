require('./config/databse').connect();
const bycypt = require('bcryptjs')
const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const User = require('./model/user');
const app = express();
app.use(express.json())
module.exports = app
require('dotenv').config();
const jwt = require("jsonwebtoken");
const user = require('./model/user');
const auth = require('./middleware/auth');
app.post('/register', async(req, res) => {
    try {
        console.log(req.body)
        const { first_name, email, password } = req.body;
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).send('user already exist')
        }
        let encrtyptpassword = await bycypt.hash(password, 10)
        const user = await User.create({
            first_name: first_name,
            email: email.toLowerCase(),
            password: encrtyptpassword
        })

        // creating token
        console.log("token")
        const token = jwt.sign({
                user_id: user._id,
                email
            },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        )
        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err)
    }

})

app.post('/login', async(req, res) => {
    try {
        // console.log("hi")
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (user && (await bycypt.compare(password, user.password))) {
            const token = jwt.sign({ user_id: user._id, email },
                process.env.TOKEN_KEY, {
                    expiresIn: "5h",
                }
            )
            user.token = token
            return res.status(200).json(user)
        }
        return res.status(400).send("invalid cred")
    } catch (err) {

    }
})

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("welcome guyzzzz")
})