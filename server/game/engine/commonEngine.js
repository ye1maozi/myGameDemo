/**
 * Created by miaowenjie on 2016/12/27.
 */

var fightEngine = require("./fightEngine");
var player = require("../player");


var alivePlayers = {};

var roomNum=1;
/**
 * 战斗外的处理
 * @constructor
 */
function CommonEngine(){

}

/**
 *
 * @constructor
 */
CommonEngine.tick = function(tm){

};
/**
 * 登陆游戏
 * @param socket
 */
CommonEngine.playerLogin = function(socket){
    alivePlayers[socket.userId] = new player(socket);
};

/**
 * 加入房间
 * @param socket
 * @param data
 */
CommonEngine.playerJoinRoom = function(socket,data){
    var roomId = roomNum;//data.roomId;
    var ply = CommonEngine.findPlayer(socket.userId);
    if(ply && (!ply.isFighting()) && fightEngine.tryJoinRoom(roomId,ply)){
        ply.goFight();
    }
};
/**
 *
 * @param socket
 * @param data
 */
CommonEngine.readyFight = function (socket,data) {
    var ply = fightEngine.getFightPlayer(socket.userId);
    if(ply && !ply.isFighting()){
        fightEngine.readyFight(ply);
    }
};

/**
 *
 * @param socket
 * @param data
 */
CommonEngine.selectSkill = function (socket,data) {
    var ply = fightEngine.getFightPlayer(socket.userId);
    if(ply && !ply.isFighting()){
        fightEngine.selectSkill(ply,data);
    }
};

/**
 * socket断开
 * @param socket
 */
CommonEngine.disconnect = function(socket){
    console.log("playerOff common");
    var ply = fightEngine.getFightPlayer(socket.userId);
    if(ply ){
        fightEngine.disconnect(ply);
    }
    delete alivePlayers[socket.userId];
};


/**
 * 找到玩家
 */
CommonEngine.findPlayer = function(userId){
    return alivePlayers[userId]
};



module.exports = CommonEngine;