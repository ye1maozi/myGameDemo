/**
 * Created by miaowenjie on 2016/12/26.
 */
/**
 * 玩家基类
 * @constructor
 */

function Player(socket){
    this.id = socket.userId;
    this.socket = socket;
    this.name = socket.nameInfo.name;
    this.Fightstate = 0;
    //function
    this.goFight = function(){
        this.Fightstate = 1;
    };
    this.isFighting = function(){
        return this.Fightstate === 1;
    }
}

module.exports = Player;