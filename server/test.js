/**
 * Created by miaowenjie on 2016/12/28.
 */
function aaa(){
    this.a = 1;
};
aaa.b = 2;
aaa.prototype.c = 3;

aaa.d = function(){

};
module.exports = aaa;