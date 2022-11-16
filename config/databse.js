const mongoose = require('mongoose')
exports.connect = () => {
    mongoose.connect('mongodb://localhost:27017/sanosh', { useNewUrlParser: true }).then(() => {
        console.log("connected")
    }).catch(() => {
        console.log("error on db")
    })
}