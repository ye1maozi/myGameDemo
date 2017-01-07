/**
 * Created by miaowenjie on 2016/12/26.
 */
/*
*战斗中的玩家
**/
var _ = require("underscore");
var Player = require("./player");
var constant = require("./common/constant");
var util = require("util");
function FightPlayer(initData){
    // Player.call(this,initData);
    initData = initData || {};
    //param
    //初始属性
    this.hp = initData.hp || 1;
    this.mp = initData.mp || 0;

    //本轮攻击防御值
    this.currAtt = 0;
    this.currDef = 0;
    this.state = constant.playerState.wait;//玩家状态  攻击 ／ 防御／蓄力

    this.select = null;//技能选择
    //function
    /**
     * 加入房间
     * @param room
     */
    this.joinRoom = function(room){
        this.room = room;
    };
    /**
     * 是否可以使用攻击
     * @param att 攻击值
     */
    this.isCanAttack = function(att){
        return this.mp >= att;
    }
    /**
     * 蓄力更新mp
     */
    this.updateEnergy = function(){
        console.log("update energy."+this.mp)
        console.log(this.state)
        if(this.state == constant.playerState.energy)
        {
            this.mp = this.mp + 1;
        }else if(this.state == constant.playerState.attack){
            this.mp = this.mp - this.currAtt;
        }
        console.log("after.."+this.mp)
    };
    /**
     * 下一轮
     */
    this.nextTurn = function(){
        this.currAtt = 0;
        this.currDef = 0;
        this.state = constant.playerState.wait
    }
    /**
     * 自动选择技能
     */
    this.autoSkill = function(room){


        if(this.state != constant.playerState.ready)
            return;

        console.log("autoSkill");
        var maxMp = 0;
        _.each(room.players,function(ply){
            if(ply.id !== this.id){
                   if(ply.mp > maxMp){
                       maxMp = ply.mp;
                   }
            }
        });
        //自己与最大的差值
        var dis = this.mp - maxMp;
        var rand = parseInt(Math.random()*100);
        if(dis < 0){
            //自己不是最大
            if(this.mp === 0){
                //并且没有mp
                if(maxMp > 3)
                {//差距过大
                    this.state = constant.playerState.defend;
                }else{
                    if(rand > 50 + 10*maxMp){
                        this.state =  constant.playerState.energy;
                    }else{
                        this.state = constant.playerState.defend;
                    }
                }
            }
        }else if(dis == 0){
            //自己和别人一样大
            if(this.mp === 0){
                this.state =  constant.playerState.energy;
            }else{
                if(maxMp > 3){
                    if(rank > 50){
                        this.state = constant.playerState.defend;
                        this.currDef = this.getAllResponseHeaders();
                    }else{
                        this.state = constant.playerState.attack;
                        this.currAtt = this.mp;
                    }
                }else{
                    // var t = 35 20 5
                    var t = 5 + 15*(3-maxMp);
                    if(rank < t){
                        this.state = constant.playerState.energy;
                    }else if(rank < t + 20){
                        this.state = constant.playerState.defend;
                        this.currDef = this.getAllResponseHeaders();
                    }else{
                        this.state = constant.playerState.attack;
                        this.currAtt = this.mp;
                    }
                }
            }
        }else{
            var t2 ;
            //自己最大
            if(dis > 3){
                t2 = 85;
            }else{
                t2 = 80;
            }
            if(rand < t2){
                this.state = constant.playerState.attack;
                this.currAtt = this.mp - dis + 1;
            }
            else if(rand < t2 + 10){
                this.state = constant.playerState.defend;
                this.currDef = this.getAllResponseHeaders();
            }else{
                this.state = constant.playerState.energy;
            }
        }

    };
    /**
     * 是否能被杀死
     * @param att 攻击值
     * @returns {boolean} 死亡
     */
    this.isDeadByAttack = function(att) {
        this.hp = this.hp - att;
        return this.hp <= 0;
    };
    /**
     * 是否存活
     * @returns {boolean}
     */
    this.isAlive = function(){
        return this.hp > 0;
    };

    this.getDffDefault = function(){
        return 999;
    };
    /**
     * 绑定球员
     * @param ply
     */
    this.bindPlayer = function(ply){
        // this.player = ply;
        util._extend(this, ply);
    };

    this.reset = function(){

        console.log(".. reset player att")
        //初始属性
        this.hp = 1;
        this.mp = 0;

        //本轮攻击防御值
        this.currAtt = 0;
        this.currDef = 0;
        this.state = constant.playerState.wait;//玩家状态  攻击 ／ 防御／蓄力

        this.select = null;//技能选择
    };

    this.ready = function(){
        console.log(this.state );
        if(this.state == constant.playerState.wait)
        {
            this.state = constant.playerState.ready;
            return true;
        }else{
            this.state = constant.playerState.wait;
        }
        return false;
    };

    this.selectSkill = function(data){
        console.log("select");
        console.log(data);

        if(this.state == constant.playerState.ready)
        {

            if(data.state == constant.playerState.attack ){
                //check mp
                if(this.mp < data.value)
                {
                    return false;
                }
            }
            this.currAtt = 0;
            this.currDef = 0;

            this.state = data.state;
            if(data.state == constant.playerState.attack )
                this.currAtt = data.value;
            if(data.state == constant.playerState.defend )
                this.currDef = 99;

            console.log(this.state);
            return true;
        }
        return false;
    };
    /**
     * 玩家离线
     */
    this.offline = function(){
        this.state = constant.playerState.offline;
    }
}
// util._extend(FightPlayer, Player);
module.exports = FightPlayer;
