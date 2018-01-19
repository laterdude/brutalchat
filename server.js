
// required modules

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var roomModel = require('./server/models/chatrooms') // import roomModel
var index = require('./server/routes/index')
var createRoom = require('./server/routes/createRoom')
var joinRoom = require('./server/routes/joinRoom')
var chat = require('./server/routes/chat');
var sendMessage = require('./server/routes/sendMessage');
var fetchMessages = require('./server/routes/fetchMessages')
var exitChat = require('./server/routes/exitChat')
var logEachUserOut = require('./server/routes/logEachUserOut')
var deleteGroup = require('./server/routes/deleteGroup')
var pingSocket = require('./server/routes/pingSocket')
var expressWs = require('express-ws')(app);
var morgan = require('morgan');

app.use(morgan('dev'));

clients=[];  //initially set the clients array empty, it will map user's ws according to roomname


mongoose.connect('mongodb://yw:chatapp@ds263317.mlab.com:63317/chatapp');

var room = roomModel.chatRoom;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));
app.use(session({secret:'ssshhhhh'}));
app.set('view engine','jade');
app.set('views',__dirname+'/public/views')

//mapping different errors originating at createroom or joinroom
parseError = ['A room with same name already exists. Try choosing another room name','Invalid Username','Invalid Roomname','Invalid Password','RoomName Does Not Exist','Invalid Roomname Password Combination','A user with same name already exists in this room, try another username','Invalid Admin Password','You are trying to login as admin, enter the admin password rather than room password.'];

// when websocket is intiated it means a new user has connected, clients array has to be updated and a request is to be sent to all current users to update their active users
app.ws('/',function(ws,req){
  roomName=req.session.roomName;
  username=req.session.username;
  try {
    clients[roomName][username]=ws;
  } catch(e1){
    clients[roomName]=[];
    clients[roomName][username]=ws;
  }
  room_clients=clients[roomName];
  console.log('-----------client updated, web socket updated or a new client joined--------------');
  console.log(clients);
  Object.keys(room_clients).forEach(function(key,index){           // send a request to everyone specifying a new user has connected
      console.log('accessing '+key);
      room_clients[key].send(JSON.stringify({'message_type':'new user','username':username}));
  });
});

app.post('/createRoom',createRoom);

app.post('/joinRoom',joinRoom);

app.post('/sendMessage',sendMessage);

app.post('/fetchMessages',fetchMessages);

app.post('/exitchat',exitChat);

app.post('/logEachUserOut',logEachUserOut);

app.post('/deleteGroup',deleteGroup);

app.post('/pingSocket',pingSocket);

app.get('/',index);

app.get('/chat',chat);

// Inactive users(with closed web socket connections) still residing in the room are removed by the server.

setInterval(function(){removeInactiveUsers()},20000);

function removeInactiveUsers() {
  console.log('server requested to remove non active users');
  Object.keys(clients).forEach(function(roomName,index1){
      Object.keys(clients[roomName]).forEach(function(username,index2) {
            if(clients[roomName][username].readyState!=1) {
                room.findOne({'roomName':roomName},function(err,data){
                  try{
                          current_members=data.roomMembers;
                          index=current_members.indexOf(username);
                          current_members.splice(index,1);
                          room.update({'roomName':roomName},{'roomMembers':current_members},function(err,data){
                            room_clients=clients[roomName];
                            console.log('---------------before logout clients---------------');
                            console.log(clients);
                            console.log('---------------------------------------------')
                            delete clients[roomName][username];
                            console.log('---------------after logout clients---------------');
                            console.log(clients);
                            console.log('---------------------------------------------')
                            Object.keys(room_clients).forEach(function(key,index){
                              console.log('trying to access web socket of '+key);
                              try{
                                room_clients[key].send(JSON.stringify({'message_type':'user exit','username':username}));
                              }catch(e){}
                            });
                          });
                      }catch(e){
                        console.log('This means clients has a deleted room so delete it from client');
                        clients[roomName]=[];
                      }
                }
              );
          }
      });
    });
  };

var port=process.env.PORT||3030;

app.listen(port);
