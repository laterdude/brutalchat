
const mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({roomName:String,roomPassword:String,roomCreationDate:Date,messages:Array,roomAdmin:String,roomAdminPassword:String,roomMembers:Array});

module.exports={'chatRoom':mongoose.model('room',roomSchema)};
