/**
 * Created by miaowenjie on 2016/12/28.
 */
var msg_type = require("../../public/socketEvent.json").SocketEvent;

var handler = {};
handler[msg_type.login] = new onUserLogin();

exports.handler = handler;

function onUserLogin(){
    this.handler = function(data,client){
        
    }
}