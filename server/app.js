/**
 * Created by miaowenjie on 2016/12/23.
 */

var express = require("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var body = require("body-parser");
var url = require("url");
var gameEngine = require("./game/engine/gameEngine");

var socketMgr = require("./game/common/SocketMgr");
var id = 0;

var tmpPlayer = socketMgr.tmpPlayer;
var allPlayers = socketMgr.allPlayers;
app.use(body.urlencoded({extended: true}));
app.post("/login",function(req,res){
    console.log(req.body);
    console.log("http request...")
    res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"})
    var name = req.body.name;
    if(name == null || name == ""){
        //浏览器环境 ajax没有发送数据过来？？？
        //使用url明文发送
        console.log("name null")
        console.log(url.parse(req.url, true).query);
        name = url.parse(req.url, true).query.name;
    }
    if(!name || name == "" || name in allPlayers){
        res.end('{"error":"名字重复"}');
    }else{
        //  单线程
        // allPlayers[name] = id;
        id++;
        tmpPlayer[name] = id;
        res.end('{"success":"","name":'+name+',"id":'+id+'}');
    }
});

socketMgr.init(io);
gameEngine.start();

http.listen(3000,function(){
    console.log("listen on 3000")
});