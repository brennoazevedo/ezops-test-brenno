require('dotenv').config();

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var api_key = process.env.API_KEY;
var api_user = process.env.API_USER;
var dbUrl = `mongodb://${api_user}:${api_key}@cluster0-shard-00-00-c39y2.mongodb.net:27017,cluster0-shard-00-01-c39y2.mongodb.net:27017,cluster0-shard-00-02-c39y2.mongodb.net:27017/simple-chat?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
var Message = mongoose.model('Message', {name : String, message : String});
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages_away', (req, res) =>{
    io.emit('awayMessage', req.body);
})

app.post('/messages', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('saved');

    var censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})


io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true },(err) => {
  console.log('mongodb connected',err);
})

var server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});
