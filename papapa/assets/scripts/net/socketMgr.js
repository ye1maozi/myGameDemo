cc.Class({
    extends: cc.Component,

    properties: {
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
        // init socket
        let self = this;
        var surl = "localhost:3000"
        if(cc.sys.isNative){
            cc.log("native")
            window.io = SocketIO;
            // window.remote = window.io.connect(surl);
            
            // window.remote.on("connected",function(msg){
            //     cc.log(msg);
            //     window.remote.emit("login","asd")
            // })
        }else
        {
            
            // cc.log("------native bo")
            // window.io = new WebSocket("ws:"+surl);
            
            // window.remote.onmessage = function(evt){
            //     var data = evt.data;
                
            // }
            //  window.remote.on("connected",function(msg){
            //     cc.log(msg);
            //     window.remote.send()
            //  })
            window.io = io;
            // window.remote = window.io.connect(surl);
            // window.remote.on("connected",function(msg){
            //     cc.log(msg);
            //     window.remote.emit("login","asd")
            // });
        }
        window.remote = window.io.connect(surl);
        window.send = this.sendData;
        // window.remote.on("connected",function(msg){
        //     cc.log(msg);
        //     var r = window.roleData;
        //     window.send("login",{id:r.id,name:r.name});
        // });
        // window.remote.on("onlogin",function(str){
        //     cc.log("login");
        //     cc.log(str)
        //     var data = JSON.parse(str);
        //     if("state" in data && data.state == 0){
        //         cc.director.loadScene("enterScene");
        //     }else
        //     {
        //         var c = this.getComponent("fightJs");
        //         c.node.emit("login")
        //         cc.log("login ...")
        //     }
        // })
    },
    sendData:function(type,data){
        var str = JSON.stringify(data);
        if(!str)
            str = "";
        cc.log("type..."+type);
        cc.log("data..."+str);
         window.remote.emit(type,str)
    }
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
