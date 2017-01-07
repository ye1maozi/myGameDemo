/**
 * Created by miaowenjie on 2017/1/6.
 */
var fightPlayer = require("./fightPlayer")
var util = require("util");
/**
 *
 * @constructor
 */
function AIPlayer(id){
    this.id = id;
    this.name = "ai"+id;
    this.isAI = true;
    fightPlayer.call(this);
}

util.inherits(AIPlayer,fightPlayer);

module.exports = AIPlayer;