/**
 * Created by miaowenjie on 2016/12/26.
 */

var _ = require("underscore");
var gameRoom = require("./gameRoom");
var fightPlayer = require("../fightPlayer");
var commonEngine = require("./commonEngine");
var cfg = require("../common/configMgr");
var max = cfg.getConfigValue("maxPlayer");
/**
 * 游戏战斗逻辑
 * @constructor
 */
var rooms = [];

/**
 * 简单的对象池
 * @type {Array}
 */
var plyPool = [];
function FightEngine(){


}

FightEngine.tick = function(tm){
    _.each(rooms,function(room){
        room.tick(tm);
    })
};

/**
 * 准备加入房间
 * @param roomId  [del]未使用[/del]
 * @return 能否加入
 */
FightEngine.tryJoinRoom = function(roomId,ply) {
    var join = false;
    var room;
    _.each(rooms,function(r){
        var ps = r.players;
        if(r.state ==0 && ps.length < max){
            if(!join){
                join = true;
                room = r;
            }
        }
    });
    if(room == null){
        //create
        room = new gameRoom();
        rooms.push(room);
        // room = rooms[roomId];
        // room.roomId = roomId;
    }
    // else if(room.players.length >= max){
    //     return false;
    // }
    var fight = FightEngine.getFightPoolPlayer();
    fight.bindPlayer(ply);
    // room.players.push(fight);
    room.playerJoin(fight);
    return true;

};
/**
 *
 * @returns {*}
 */
FightEngine.getFightPoolPlayer = function(){
    if(plyPool.length > 0)
    {
        var p = plyPool.pop();
        p.reset();
        return p;
    }
    return new fightPlayer({});
};

/**
 * 回收
 * @param ply
 */
FightEngine.disposeFightPlayer = function(ply){
    plyPool.push(ply)
};

/**
 * 准备好战斗
 * @param socket
 * @param data
 */
FightEngine.readyFight = function(ply){
    var room = FightEngine.checkPlayerLegal(ply)
    if(room !== null){
        room.readyFight(ply,ply.ready());
    }
};

FightEngine.selectSkill = function(ply,data){

    console.log("fight selectSkill")
    var room = FightEngine.checkPlayerLegal(ply);
    if(room !== null && room.state == 1 ){
        if(ply.selectSkill(data)){
            room.checkState();
        }else{
            // ply.
            ply.socket.emit("selectSkillRes",{err:true,msg:"选择技能错误"})
        }
    }
};

/**
 * 玩家退出
 * @param ply
 */
FightEngine.disconnect = function(ply){
    console.log("playerOff fight")
    var room = FightEngine.checkPlayerLegal(ply);
    if(room == null  ){
        console.log("null")
        FightEngine.disposeFightPlayer(ply);
        // ply.offline();
        ply.offline();
    }else if(room.state != 0)
    {
        console.log("state != 0")
        //已经在战斗中了  设置离线状态
        ply.offline();
        var ps = room.checkOff();
        if(ps ){
            _.each(ps,FightEngine.disposeFightPlayer)
        }
    }else
    {
        room.playerOff(ply);
        FightEngine.disposeFightPlayer(ply);
    }
};
/**
 * 检测玩家是否在战斗房间内
 */
FightEngine.checkPlayerLegal = function(ply){
    if(ply !== null){
        for(var i=0;i<rooms.length;i++){
            var room = rooms[i];
            var plys = room.players;
            for(var j=0;j<plys.length;j++){
                var player = plys[j];
                if(player === ply){
                    return room;
                }
            }
        }

    }

    return null;
};

/**
 * 找到战斗中玩家
 * @param socket
 * @returns {null}
 */
FightEngine.getFightPlayer = function(userId){
     // console.log(userId);
    for(var i=0;i<rooms.length;i++){
        var room = rooms[i];
        var plys = room.players;
        for(var j=0;j<plys.length;j++){
            var player = plys[j];
            if(player.id == userId){
                return player;
            }
        }
    }

    return null;
};


module.exports = FightEngine;