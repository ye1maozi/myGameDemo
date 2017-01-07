//视图
//暂时的解决方案 保存上下文
var instance ;
function viewMgr(){
    
}
function getInstance(){
    if(instance == null)
    {
        instance = new viewMgr;
    }
    return instance;
}

var viewList = {};

viewMgr.prototype.register = function(name,module){
    viewList[name] = module;
};

viewMgr.prototype.unregister = function(name){
    delete viewList[name];
};

viewMgr.prototype.findViewByName = function(name){
    return viewList[name];
};

module.exports = {getInstance:getInstance};