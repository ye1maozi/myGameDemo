/**
 * Created by miaowenjie on 2016/12/26.
 */

var config = require("../common/configMgr");
var constant = require("../common/constant");
var _ = require("underscore");

var ROOM_STATE_READY = 0; //等待开始
var ROOM_STATE_WAIT = 1; //选择技能
var ROOM_STATE_FIGHT = 2;//战斗
var ROOM_STATE_ALREADY = 3;//已经开始与选择技能之间的时间
var ROOM_STATE_PUSH = 4;//战斗开始前推送阶段

/**
 * 游戏房间
 * 处理房间逻辑
 * @constructor
 */
function GameRoom(){
    this.roomId = 0;
    this.players = [];
    this.state = ROOM_STATE_READY;
    this.waitTime = 0;
    this.flag = true;

    this.socket = null;
    /**
     * 更新
     */
    this.tick = function(tm){
        // console.log("tick.."+tm)
        //this room should be killed
        if(this.players.length == 0)
            return;


        switch(this.state){
            case ROOM_STATE_READY:
                //未开始
                break;
            case ROOM_STATE_ALREADY:
                if(this.waitTime!=0 && this.waitTime < tm){
                    //结束
                    this.state = ROOM_STATE_PUSH;
                    this.waitTime = tm + config.getConfigValue("waitTime");
                    this.broadcast("fightState",{tm:this.waitTime,state:this.state});
                }
                break;
            case ROOM_STATE_PUSH:
                //战斗开始前
                this.broadcast("fightState",this.getCurrRoomState());
                this.state = ROOM_STATE_WAIT;
                break;
            case ROOM_STATE_WAIT:
                if(this.flag){
                    this.flag = false;
                    console.log("curr " + tm);
                    console.log("end " + this.waitTime );
                }
                if(this.waitTime!=0 && this.waitTime < tm){
                    console.log("tick state  wait");
                    //fight
                    this.state = ROOM_STATE_FIGHT;
                    this.checkPlayer();
                    // this.waitTime = tm + config.getConfigValue("fightTime");
                    // socket.to(roomId).emit("fightState",{tm:this.waitTime,state:ROOM_STATE_FIGHT});
                }
                break;
            case ROOM_STATE_FIGHT:
                console.log("tick state fight");

                this.waitTime = tm + config.getConfigValue("FightTime") ;
                this.state = ROOM_STATE_WAIT;
                this.gotoFight();
                break;
        }
    };

    /**
     * 检查玩家技能选择
     * 未选择的自动处理
     */
    this.checkPlayer = function(){

        _.each(this.players,function(ply){
            ply.autoSkill(this);
        })
    };
    /**
     * 战斗
     */
    this.gotoFight = function() {

        var plys = [];
        var maxGroup = [];//最高攻击组
        var deadGroup = [];//死亡组
        var aliveGroup = [];//存活组
        var end = false;

        //计算最大攻击
        var max = 0;
        _.each(this.players, function (ply) {
            if (max < ply.currAtt) {
                max = ply.currAtt;
                maxGroup = [ply];
            } else if (max === ply.currAtt) {
                maxGroup.push(ply);
            } else {

            }
        });

        //存活 死亡  刷新mp
        _.each(this.players, function (ply) {
            var obj = {
                id: ply.id,
                name :ply.name,
                hp : ply.hp,
                mp : ply.mp,
                currAtt: ply.currAtt,
                currDef: ply.currDef,
                state: ply.state,
                alive: false
            };

            plys.push(obj);
            if (ply.isAlive()) {
                switch (ply.state) {
                    case constant.playerState.attack://攻击
                        if (ply.currAtt < max && ply.isDeadByAttack(max)) {
                            deadGroup.push(ply);
                        } else {
                            aliveGroup.push(ply);
                        }
                        break;
                    case constant.playerState.defend://防御
                        if (ply.currDef < max && ply.isDeadByAttack(max)) {
                            deadGroup.push(ply);
                        } else {
                            aliveGroup.push(ply);
                        }

                        break;
                    case constant.playerState.energy://蓄力
                        if (0 < max && ply.isDeadByAttack(max)) {
                            deadGroup.push(ply);
                        } else {
                            aliveGroup.push(ply);

                        }
                        break;
                }
                obj.alive = ply.isAlive();
                ply.updateEnergy();
                console.log("update mp "+ply.mp);
                ply.nextTurn();
                // obj.hp = ply.hp;
                obj.mp = ply.mp;
            }
            ply.state = constant.playerState.ready;
        });
        end = aliveGroup.length <= 1;
        if(end){
            this.state = ROOM_STATE_READY;
        }
        //推送战斗结果
        console.log("fight result...");
        console.log(plys);

        this.broadcast("fightState", {players: plys,tm:this.waitTime,state :this.state,end:end});
    };

    this.playerJoin = function(ply){
        this.players.push(ply);
        this.broadcast("playerJoin",this.getCurrRoomState());
    };
    /**
     * 广播
     * @param common
     * @param data
     */
    this.broadcast = function(common,data){
        _.each(this.players,function(ply){
            if(!ply.isAI)
                ply.socket.emit(common,data)
        })
    };
    /**
     * 获得当前玩家们状态
     */
    this.getCurrRoomState = function(){
        var plys = [];
        _.each(this.players,function(p){
            var o = {
                id:p.id,
                state:p.state,
                name:p.name
            };
            plys.push(o);
        });
        return {players:plys,roomState:this.state};
    };
    /**
     * 准备／取消
     * @param fply
     * @param ready
     */
    this.readyFight = function(fply,ready){

        var allReady = this.players.length >= config.getConfigValue("minPlayer");
        var s = config.getConfigValue("useAI");
        console.log("ready  "+ s);
        if(s == 1){
            var s = this.players.length;
            var e = config.getConfigValue("minPlayer");
            for(var n = s;n<e;n++){
                var ai = getAIPlayer();
                ai.state = 4;
                this.players.push(ai)
            }
          allReady = true;
        }

        console.log("ready")
        console.log(ready);
        _.each(this.players,function(player){
            if(!player.isAI && player.state != constant.playerState.ready){
                allReady = false;
                //undersocre无法break跳出each
            }
        });

        if(allReady){

            var t = new Date();
            t = t.getTime();
            t = t + parseInt(config.getConfigValue("waitTime"));
            this.waitTime = t;
            _.each(this.players,function(player){
                if(!player.isAI)
                    player.socket.emit("playerReady",{waitTime:t});
            });
            //
            this.state = ROOM_STATE_PUSH;

        }else{
            var s = ready?4:3;
            _.each(this.players,function(player){
                if(!player.isAI)
                    player.socket.emit("playerReady",{id:fply.id,state:s})
            })

        }
    };
    /**
     * 检查所有玩家状态
     * 以进行下一步
     */
    this.checkState = function(){
        var allReady = this.players.length >= config.getConfigValue("minPlayer");
        _.each(this.players,function(player){
            if(!player.isAI && player.state !== constant.playerState.ready){
                allReady = false;
                //undersocre无法break跳出each
            }
        });

        if(allReady){
            this.waitTime = 0;//清楚等待
            // this.state = ROOM_STATE_FIGHT;
        }else{
            //todo 是否要推送别人选择
        }

    };

    this.playerOff = function(player){
        console.log("playerOff")
        for(var i = this.players.length -1;i>=0;i--){
                if(this.players[i] == player){
                    this.players.splice(i,1);
                    break;
                }
            }
        this.broadcast("playerJoin",this.getCurrRoomState());
    };


    this.checkOff = function(){
        var allOff = true;
        for(var i = this.players.length -1;i>=0;i--){
            var ply = this.players[i];
            if(!ply.isAI && ply.state != constant.playerState.offline){
                allOff = false;
                break;
            }
        }

        if(allOff){
            //全部离线 只剩ai
            var all = [];
            for(var i = this.players.length -1;i>=0;i--){
                var ply = this.players[i];
                if(ply.isAI ){
                    disposeAI(ply);
                }else{
                    all.push(ply);
                }
            }
            this.players = [];
            return all;
        }

        return null;
    }
}
var AIPlayer = require("../AIPlayer");
var aiPlayers = [];
var aiNum = 100;
getAIPlayer = function(){
    if(aiPlayers.length){
        return aiPlayers.pop();
    }

    return new AIPlayer(aiNum++);
};

disposeAI = function(ai){
    aiPlayers.push(ai);
};
module.exports = GameRoom;