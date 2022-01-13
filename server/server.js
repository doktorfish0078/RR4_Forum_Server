const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs');
const cors = require('cors');

const app = express()
const port = process.env.PORT || 4000

app.use(cors())

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.static('public'));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
    Thread.find().then(thread => res.send(thread)).catch(err => console.log(err));
})

app.get('/thread/:id', (req, res) => {
    Topic.find({id_thread: req.params.id}).then(Topic => res.send(Topic)).catch(err => console.log(err));
  })

app.get('/get_thread/:id', (req, res) => {
    Thread.findById(req.params.id).then(Thread => res.send(Thread)).catch(err => console.log(err));
})

app.post('/create_new_thread', (req, res) => {
    Thread.create(
        { 
            theme: req.body.theme,
            title: req.body.title,
            date_create: req.body.date_create,
            count_msg: 0,
            id_creator: req.body.id_creator
        })
        .then(answer => res.send(answer))
        .catch(err => console.log(err));
})

app.post('/thread/:id_thread/create_new_topic', (req, res) => {
    Topic.create(
        { 
            title: req.body.title,
            date_create: req.body.date_create,
            count_msg: 0,
            id_thread: req.params.id_thread,
            id_creator: req.body.id_creator
        })
        .then(answer => res.send(answer))
        .catch(err => console.log(err));
})

app.get('/get_topic/:id', (req, res) => {
    Topic.findById(req.params.id).then(Topic => res.send(Topic)).catch(err => console.log(err));
})
app.get('/topic/:id', (req, res) => {
    Message.find({id_topic: req.params.id}).then(Msg => res.send(Msg)).catch(err => console.log(err));
})

app.post('/thread/:id_thread/topic/:id_topic/create_new_message', (req, res) => {
    Topic.updateOne(
        {_id: req.params.id_topic}, 
        { $inc: {count_msg: 1}}
    ).then(answer => {res.send(answer); console.log(answer)})
    .catch(err => console.log(err));
        
    Thread.updateOne(
        {_id: req.params.id_thread }, 
        { $inc: {count_msg: 1}}
    ).then(answer => res.send(answer))
    .catch(err => console.log(err));
    Message.create(
        { 
            text: req.body.text,
            date_create: req.body.date_create,
            id_topic: req.params.id_topic,
            id_creator: req.body.id_creator
        })
        .then(answer => res.send(answer))
        .catch(err => console.log(err));
})

// app.post('thread/:id_thread/topic/:id_topic/create_new_message', (req, res) => {



    
// })

async function start()
{
    try{
        await mongoose.connect('mongodb+srv://Doktorfish0078:qwertqwert@cloud-yesnogame.xd6dj.mongodb.net/cloudDB?retryWrites=true&w=majority', {
            useNewUrlParser: true,
        })
        .then(() => console.log('MongoDb connected'))
        .catch(err => console.log(err));

        app.listen(port, () => {
            console.log(`app listening at http://localhost:${port}`)
        })
    } catch(e) {
        console.log(e);
    }
}



const ThreadSchema = new mongoose.Schema({
    theme: {type:String},
    title: {type:String},
    date_create: {type:String},
    count_msg: {type:Number},
    id_creator: {type:String}
})

const TopicSchema = new mongoose.Schema({
    title: {type:String},
    date_create: {type:String},
    count_msg: {type:Number},
    id_thread: {type:String},
    id_creator: {type:String}
})

const MessageSchema = new mongoose.Schema({
    text: {type:String},
    date_create: {type:String},
    id_topic: {type:String},
    id_creator: {type:String}
})

const Thread = mongoose.model('Thread', ThreadSchema)
const Topic = mongoose.model('Topic', TopicSchema)
const Message = mongoose.model('Message', MessageSchema)

start()

