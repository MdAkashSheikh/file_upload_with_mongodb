const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const ImageModel = require('./ImageSc')
const port = 5050;



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const DB_CONN = 'mongodb+srv://akash123:akash123@cluster0.oktcuq5.mongodb.net/test';

mongoose.connect(DB_CONN)
.then(()=> console.log('Database Connected...'))
.catch(err => console.log(err))

//Storage
const Storage = multer.diskStorage({
    destination:'uploads', 
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage: Storage
}).single('testImage')

app.get('/', (req, res)=> {
    res.send('Hello world')
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
        }
        else {
            const newImage = new ImageModel({
                name: req.body.name,
                image: {
                    data: req.file.fieldname,
                    contentType: 'image/png'
                }
            })
            newImage.save()
            .then(() => res.send('Successfully Uploaded'))
            .catch((err) => {
                console.log(err)
            })
        }
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})