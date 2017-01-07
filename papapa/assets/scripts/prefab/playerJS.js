cc.Class({
    extends: cc.Component,

    properties: {
        nameTxt:{
            type:cc.Label,
            default:null
        },
        mpTxt:{
            type:cc.Label,
            default:null
        },
        hpTxt:{
            type:cc.Label,
            default:null
        },
        selfTxt:{
            type:cc.Label,
            default:null
        },
        icon:{
            default:null,
            type:cc.Sprite
        },
        id:null,
        state:null,
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
        this.id = 0;
        this.state =  0;
    },
    initData:function(data){
      //id
    //   cc.log(data)
      this.id = data.id;
      this.state = data.state;
      cc.log("name..."+data.name)
      cc.log("id..."+data.id);
      //state
      var r = window.roleData;
      if(r.id == data.id){
           this.nameTxt.string = data.name + "(me)";
      }else{
        //   cc.log("name..."+data.name)
           this.nameTxt.string = data.name;
      }
    //   this.nameTxt.string = data.name;
    //   this.selfTxt.enabled = this.id == r.id;
    //   this.hpTxt.enabled = this.mpTxt.enabled = false;
      this.setState(data.state);
      var str = "";
      if("alive" in data){
          //战斗返回
          switch(data.state){
                case 0:
                    str = "att" + "  "+ data.currAtt;
                  break;
                case 1:
                    str = "def";
                    break;
                case 2:
                    str = "energy";
                    break;
                default:
                    break;
          }
          this.selfTxt.string = str;
          
          this.hpTxt.string = "hp:"+data.hp;
          
          if(data.alive){
            //   this.hpTxt.string 
          }else{
               this.hpTxt.string = "dead";
          }
        this.mpTxt.string = "mp:" +data.mp;  
      }else{
        this.hpTxt.string = "hp:1";
        this.mpTxt.string = "mp:0";    
      }
      
      
      
    },
    init: function (game) {
        this.game = game;
    },
    setState:function(state){
      this.state = state;
      if(state == 3){
          //wait
          this.selfTxt.string = "等待";
      }else if(state == 4){
          //ready
          this.selfTxt.string = "准备";
      }
      
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
