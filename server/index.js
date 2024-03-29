const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 5000
const config = require('./config/key')
const { User } = require('./models/user');
const { auth } = require('./middleware/auth')

mongoose
.connect(config.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log('DB connected'))
.catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({"hello": "It is working"})
})

app.get('/api/user/auth', auth, (req, res) => {
    res.status(200).json({
        _id:req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.post('/api/users/register', async (req, res) => {
    const user = new User(req.body)

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({
            success: true,
            userData: doc

            // try {
    //     await user.save()
    //     res.status(201).send({user})
    // } catch (e) {
    //     res.status(400).send(e)
    // }
        })
    }) 
})

app.post('/api/user/login', (req, res) => {
    // Find email
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user)
        return res.json({
            loginSuccess: false,
            message: "Auth failed, email not found"
        })
    // Compare password
    user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch){
            return res.json({ loginSuccess: false , message: "wrong password"})
        }
    })
    
    // GenerateToken
    user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)
        res.cookie("x_auth", user.token)
           .status(200)
           .json({
               loginSuccess: true
           })
        })
    })
})

app.get('/api/user/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, { token: ""}, (err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).send({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})