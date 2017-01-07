var viewMgr = require("viewMgr");
var emptyFunc = function (event) {
    event.stopPropagation();
};
var roomState = 0;
var gameState = 0;
var playerList = [];

var playerIns = [];
var playerPool = []
function getPlayerIns(){
    if(playerPool.length){
        return playerPool.pop();
    }
    return null;
}
function disposeIns(ply){
    playerPool.push(ply);
}
function parse2Obj(str){
    cc.log(typeof str)
    if(typeof str == "object")
    {
        return str;
    }else{
        return JSON.parse(str);
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab:{
            default : null,
            type:cc.Prefab
        },
        players:{
            default:null,
            type:cc.Node
        },
        skillNode:{
            default:null,
            type:cc.Node
        },
        waitTxt:{
            default:null,
            type:cc.Label
        },
        modal:{
            default:null,
            type:cc.Sprite
        },
        readybtn:{
            default:null,
            type:cc.Button
        },
        tid:0,
        time:0
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        //todo  socket
        //1. wait until all be ready  ->change picture with state 
        //2. count down 
        //3. select skill
        //4. wait ...   ->change pic ...
        //5. skill ani
        //x. cd
        //6. goto 3
        //7. win/lose ani
        //8. goto 1
        viewMgr.getInstance().register("fight", this)
        this.addEvents();
        let self = this;
        playerList = [];
        if(window.remote.connected){
             var r = window.roleData;
            window.send("login",{id:r.id,name:r.name});
        }else{
            window.remote.on("connected",function(msg){
                cc.log(msg);
                var r = window.roleData;
                window.send("login",{id:r.id,name:r.name});
            });
        }
        // window.remote.on("connected",function(msg){
        //     cc.log(msg);
        //     var r = window.roleData;
        //     window.send("login",{id:r.id,name:r.name});
        // });
        window.remote.on("onlogin",function(str){
            cc.log("login....123");
            cc.log(str);
            var data = parse2Obj(str);
            var self = viewMgr.getInstance().findViewByName("fight");
            // if(typeof str != "object")
            // {
            //   data = JSON.parse(str);
            // }   
            cc.log(data);
            cc.log("login ed")
            if(data && "err" in data ){
                cc.log("re enter")
                cc.director.loadScene("enterScene");
            }else
            {
                self.node.emit("login");
                cc.log("login ...")
            }
        })
    },
    onTouchAtt:function(){
        cc.log("on touch att")
        // var self = viewMgr.getInstance().findViewByName("fight");
        window.send("selectSkill",{state:0,value:1});//攻击
        
    },
    onTouchDef:function(){
         window.send("selectSkill",{state:1,value:1});//防御
         cc.log("on touch def")
    },
    onTouchEnergy:function(){
         window.send("selectSkill",{state:2,value:1});//蓄力
         cc.log("on touch energy")
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    /**
    onLoad  加载资源 
    start  第一次激活  
    update  帧渲染
    lateUpdate  组件update之后
    onDestroy  调用destory之后
    onEnable  
    onDisable
    **/
    
    onDestroy:function(){
        this.removeEvents();
    },
    removeEvents:function(){
        // this.modal.node.off('touchstart', emptyFunc, this);
        // this.node.off("login",this.onlogin,this)
    },
    addEvents:function(){
        this.node.on("login",this.onlogin,this)
        //emit(testevent,{})
        this.modal.node.on('touchstart', emptyFunc, this);
        
        window.remote.on("fightState",this.updateFight);
    },
    onlogin:function(){
        cc.log("emit login...")
      this.modal.enabled = true;
      this.readybtn.enabled = (true);
      this.waitTxt.enabled = (false);
    },
    
    onTouchReady:function(){
        cc.log("on touch ready");
        
        if(roomState === 0){
            window.remote.on("playerJoin",this.onJoinRoom);
            window.send("joinRoom");//准备
        }else{
            
            window.remote.on("playerReady",this.onready);
            window.send("readyFight");//准备
        }
    },
    onJoinRoom:function(info){
        //这里会返回所有房间玩家状态
        //并且刷新调用此接口
        //todo 拆分接口
        cc.log("onJoinRoom")
        var data = parse2Obj(info);//JSON.parse(info);
        cc.log(info);
        roomState = 1;
        gameState = data.roomState;
        playerList = data.players;
        // playerIns = [];//todo pool
        var self = viewMgr.getInstance().findViewByName("fight");
        self.addPlayers(playerList);
        
        cc.find("Label",self.readybtn.node).getComponent(cc.Label).string = "准备";
    },
    addPlayers:function(playerList){
        var self = viewMgr.getInstance().findViewByName("fight");
        while(playerIns.length){
            var p = playerIns.pop();
            self.node.removeChild(p);
            disposeIns(p);
        }
       
    //   playerIns = [];//todo pool
        
        var num = playerList.length;
         cc.log("add "+num);
        for(var i =0 ;i < num;i++){
            var ply = getPlayerIns();
            if(ply === null)
            {
                ply = cc.instantiate(self.playerPrefab);
            }
            cc.log("add player "+i)
                
            
            ply.getComponent("playerJS").initData(playerList[i]);
            ply.x = -300 + 200*(i%4);
            ply.y = parseInt(i/4)==0?-100:100;
            playerIns.push(ply);
            self.node.addChild(ply)
        }  
    },
    onready:function(info){
        
        var data = parse2Obj(info);//JSON.parse(info);
        // var plys = data.players;//[]  //id state 
        // cc.log(plys);
        
        var self = viewMgr.getInstance().findViewByName("fight");
        self.waitTxt.enabled = true;
        // cc.find("Label",self.readybtn.node).getComponent(cc.Label).textKey = "取消准备";
        if("id" in data){
            //有人ready
            var r = window.roleData;
            if(r.id == data.id){
                cc.log("self action  "+data.state )
                if(data.state == 3){
                    //waitTxt
                    cc.find("Label",self.readybtn.node).getComponent(cc.Label).string = "取消准备";
                }else{
                    //ready
                    cc.find("Label",self.readybtn.node).getComponent(cc.Label).string = "准备";
                }
            }
            
            //todo拆分接口
            for(var i = 0;i<playerIns.length;i++){
                var p = playerIns[i];
                if(p.id == data.id){
                    p.getComponent("playerJS").setState(data.state);
                }
            }
        }else{
            //all ready
            //let's start
            //wait for push msg
            self.modal.enabled = false;
            self.readybtn.enabled = (false);
            var wait = data.waitTime;//  等待结束时间戳
            // self.waitTxt.enabled = true;
            self.startCD(wait);
            // self.waitTxt.string = wait.toString();
        }
        
        // self.modal.enabled = false;
        // self.readybtn.enabled = (false);
        // self.waitTxt.enabled = (false);
    },
    updateFight:function(info){
        cc.log("updateFight")
        cc.log(info);
        var data = parse2Obj(info);
         var self = viewMgr.getInstance().findViewByName("fight");
         if("players" in data){
            playerList = data.players;
            // playerIns = [];//todo pool
            var self = viewMgr.getInstance().findViewByName("fight");
            self.addPlayers(playerList);
         }
         var state = data.roomState;
         if("tm" in data)
         {
            //  this.time = data.tm.toString();
            self.startCD( data.tm);
             
         }
         cc.log("fight state "+state);
         if(state == 4){
             //开始阶段
             self.modal.node.active = false;
             self.readybtn.node.active = false;
         }
         
    },
    startCD:function(tm){
        cc.log("cd..."+tm);
        this.time = tm;
    //   this.waitTxt.string = 
        if(this.tid != 0){
            clearInterval(this.tid);
            
        }
        this.tid = setInterval(this.coolDown, 500);
    },
    coolDown:function(){
      var self = viewMgr.getInstance().findViewByName("fight");
      var curr = new Date();
    //   cc.log("curr " + curr.getTime() );
    //   cc.log("end "+ self.time);
      var left = self.time - curr.getTime() ;
      left = parseInt(left/1000);
      if(left <= 0){
          clearInterval(self.tid);
          self.node.emit("timeOut");
          left = 0;
      }
      self.waitTxt.string = left.toString();
    },
    createSecondSkill:function(){
        
    },
    /*
    等待
    */
    showWaitPanel:function(){
    }
});
