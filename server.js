var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended : false}))

/*app.use(function(req, res, next) {
  var allowedOrigins = ['https://prj-redsquare.herokuapp.com/','https://redsquare-prj.netlify.com','http://127.0.0.1:8080','http://localhost:8080'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});*/

const mongoURI = 'mongodb://GedeonV:pMC33ON03fdx68zJ@cluster0-shard-00-00-dfgis.mongodb.net:27017,cluster0-shard-00-01-dfgis.mongodb.net:27017,cluster0-shard-00-02-dfgis.mongodb.net:27017/redsquare?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(mongoURI, {useNewUrlParser: true})
	.then(() => console.log("MongoDB Connected"))
	.catch(err => console.log(err))

var Users = require("./routes/Users")
var Streams = require("./routes/Streams")

app.use("/users", Users)	
app.use("/streams", Streams)

const server = app.listen(port, function (){
	console.log("Server is running on port: " + port)
})

const io = require('socket.io')(server);
io.on('connection', function(socket) {
   socket.on('stream',function(image){
      socket.broadcast.emit('stream', image);
   });
});
