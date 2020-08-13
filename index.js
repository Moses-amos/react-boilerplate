const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')
const { User } = require('./models/user');

mongoose.connect(config.mongoURL, 
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log('DB connected'))
.catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({"hey ~": "bla"})
})

app.post('/api/users/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({user})
    } catch (e) {
        res.status(400).send(e)
    }
})


app.listen(5000, () => {
    console.log('Working')
})