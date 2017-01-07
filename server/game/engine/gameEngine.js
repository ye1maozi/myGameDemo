/**
 * Created by miaowenjie on 2016/12/26.
 */

var commonEngine = require("./commonEngine");
var fightEngine = require("./fightEngine");
/**
 * 游戏引擎
 * 主要逻辑处理
 * @constructor
 */
function GameEngine(){

}
GameEngine.start = function(){
    var fps = parseInt(1000/60);
    setInterval(function(){
        var tm = new Date();
        GameEngine.tick(tm.getTime());
    },fps);
};

/**
 *
 * @constructor
 */
GameEngine.tick = function(tm){

    //常规处理
    commonEngine.tick(tm);
    
    //战斗处理
    fightEngine.tick(tm);


};

module.exports = GameEngine;