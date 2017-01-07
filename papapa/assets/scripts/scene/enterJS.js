var viewMgr = require("viewMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        flyPrefab:{
          default:null,
          type:cc.Prefab
        },
        nameTxt:{
            default:null,
            type:cc.EditBox
        },
        secondTxt:{
            default:null,
            type:cc.EditBox
        },
        myBtn:{
            default:null,
            type:cc.Button
        },
        flytxt:null
    },

    // use this for initialization
    onLoad: function () {
        viewMgr.getInstance().register("enter",this);
        // window.alert = this.alertText;
    },
    alertText:function(txt){
      var f = this.getFlyTxt();
        this.node.addChild(f.node);
        f.node.setPosition(0,0)
        f.play(txt);
        
    },
    onEnterGame:function(){
        cc.log("enter game  " + this.nameTxt.string +"  "+ this.secondTxt.string);
        if(this.nameTxt.string.replace(/\s/,"") == ""){
            this.alertText("名字为空")
            return;
        }
        // var f = this.getFlyTxt();
        // this.node.addChild(f.node);
        // f.node.setPosition(0,0)
        // f.play("name:" + this.nameTxt.string + " second:"+ this.secondTxt.string);
        
        window.httpRequest("http://127.0.0.1:3000/login","name="+this.nameTxt.string,
        this.onLoginSuc,this.onloginFail);
        // cc.director.loadScene("fightScene")
    },
    onLoginSuc:function(data){
        var self = viewMgr.getInstance().findViewByName("enter")
        if('error' in data ){
           self.alertText(data.error)  
        }else
        {
            //  window.alert("")
            var roleData = window.roleData
            roleData.name = data.name;
            roleData.id = data.id;
            cc.director.loadScene("fightScene")
        }
    },
    onloginFail:function(){
        var self = viewMgr.getInstance().findViewByName("enter")
        self.alertTextt("登陆失败")
        
    },
    getFlyTxt:function(){
        if(this.flytxt === null){
            this.flytxt = cc.instantiate(this.flyPrefab).getComponent("flyJs"),
            this.flytxt.init(this);
        }
        return this.flytxt;
    },
    despawnScoreFX (scoreFX) {
        // this.scorePool.put(scoreFX);
        this.node.removeChild(scoreFX);
        cc.log("exit ...")
    },
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
