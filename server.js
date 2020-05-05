var express = require('express');
var app = express();
var mongoose = require('mongoose');
require('dotenv').config();
var api_key = process.env.API_KEY;
var api_user = process.env.API_USER;
var dbUrl = `mongodb://${api_user}:${api_key}@cluster0-shard-00-00-c39y2.mongodb.net:27017,cluster0-shard-00-01-c39y2.mongodb.net:27017,cluster0-shard-00-02-c39y2.mongodb.net:27017/simple-chat?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
var Message = mongoose.model('Message', {name : String, message : String});
app.use(express.static(__dirname));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var server = app.listen(3000, () => {
    console.log('server is running on port' , server.address().port);
});

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
});

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    res.sendStatus(200);
  })
});
