const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/boilerplate', 
{ useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB connected'))
.catch(err => console.log(err))

const app = express()

app.get('/', (req, res) => {
    res.send('Hey')
})



app.listen(5000, () => {
    console.log('Working')
})