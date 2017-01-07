/**
 * Created by miaowenjie on 2016/12/27.
 */

/**
 * socket处理
 */
var SocketEvent = require("../../public/socketEvent.json").SocketEvent;

var commonEngine = require("../engine/commonEngine");
var fightEngine = require("../engine/fightEngine");

var socket ;
function SocketMgr(){

};

var tmpPlayer = {};
var allPlayers = {};
SocketMgr.tmpPlayer = tmpPlayer;
SocketMgr.allPlayers = allPlayers;
SocketMgr.init = function(io){

    console.log("socket init...");
    io.on("connection",function(socket){

        console.log("socket connect.." );
        // console.log(tmpPlayer);
        socket.on("disconnect",function(data){


            if(socket.nameInfo && socket.nameInfo.name in allPlayers){
                console.log("disconnect");
                commonEngine.disconnect(socket);
                delete allPlayers[socket.nameInfo.name];
            }
        });

        socket.emit("connected","send to client ...");

        socket.on("login",function(data){

            data = JSON.parse(data);
            var name = data.name+"";
            var id = data.id;
            if(name in tmpPlayer && tmpPlayer[name] == id){
                //suc
                console.log("login suce")
                allPlayers[name] = data;
                delete tmpPlayer[name];
                socket.nameInfo = data;
                socket.userId = id;
                socket.emit("onlogin",data);
                //todo
                // new player
                commonEngine.playerLogin(socket);
            }else
            {
                socket.emit("onlogin",{err:true,msg:"login failed"});
                // socket.disconnect(true);
            }

            console.log("loign ...");
        });


        socket.on("joinRoom",function(data){
            console.log("joinRoom..." + socket.userId);
            commonEngine.playerJoinRoom(socket,data);
            //find player
            //get player state
            //join room
            //set player's room
            //broadcast
        });
        //todo
        //修改成handler  ->
        socket.on("readyFight",function(data){
            console.log("readyFight");
            commonEngine.readyFight(socket,data);
        });
        socket.on("selectSkill",function(data){
            console.log("selectSkill");
            data = parse2Obj(data);
            commonEngine.selectSkill(socket,data);
        });
        // socket.on("")
        

    });
};

parse2Obj = function(info){
    if(typeof  info == "object"){
        return info;
    }
    return JSON.parse(info);
}


module.exports = SocketMgr;
