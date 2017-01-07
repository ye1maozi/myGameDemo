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
        if(window.HttpService  == null){
            window.HttpService = this.getHttp();
        
            window.httpRequest = this.httpRequest;// 绑定全局

            cc.log("http server start...")
        }
        //test
        // window.HttpService.http({
        //     url : "http://127.0.0.1:3000/login",
        //     data:"name=asd",
        //     onSuccess:function(result){
        //         cc.log(result);
        //     },
        //     onError:function(){
        //         cc.log("http error")
        //     }
        // })
    },
    httpRequest:function(url,data,sucCallback,failCallback){
        window.HttpService.http({
            url : url || "http://127.0.0.1:3000/login",
            data:data || "name=asd",
            onSuccess:function(result){
                cc.log(result);
                if(sucCallback != null)
                {
                    sucCallback(result)
                }
            },
            onError:function(){
                cc.log("http error");
                if(failCallback != null)
                    failCallback();
            }
        })
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    getHttp:function(){
        return {  
            urlGame : function(url) {  
                return HH.cfg.URL_API + url + "?sso=" + HH.data.sso.get() + "&src=" + HH.cfg.CHANNEL_ID + "&ts=" + Date.now();  
            },  
            urlWithTick : function(url) {  
                return HH.cfg.URL_API + url + "?ts=" + Date.now();  
            },  
            _seq : 0,  
            seq : function() {  
                this._seq = this._seq + 1;  
                return this._seq;  
             },  
            /** 
             * HTTP请求 
             * @param param {type,url,data,onSuccess,onError} 
             */  
            http : function(param) {  
                var type = param.type || "POST";  
                var url = param.url;  
                var data = param.data || "";  
          
                data = data + "&ts=" + Date.now();  
          
                cc.log(cc.sys.isNative);  
                cc.log("url:" + url);  
                cc.log("data:" + data);  
          
                var onSuccess = param.onSuccess;  
                var onError = param.onError || Network.onError;  
                var responseType = param.responseType || "json";  
                var timeout = param.timeout || 10000;  
          
                // if(!cc.sys.isNative) {  
                    
                //     var reqid = this.seq();  
                //     var obj = {  
                //         type : type.toLowerCase(),  
                //         async : true,  
                //         url : url,  
                //         dataType : "jsonp",  
                //         jsonp : "jcb",  
                //         jsonpCallback : "jcb_" + reqid,  
                //         success : function(result) {  
                //             cc.log(result)
                //             // cc.log(JSON.stringify(result));  
                //             // cc.log(result.code);  
                //             onSuccess(result);  
                //         },  
                //         error : function() {  
                //             cc.log("hq:network error");  
                //             onError();  
                //         },  
                //         timeout : timeout  
                //     }  
                //     if(data != null) {  
                //         obj.data = data;  
                //     }  
                //     try {  
                //         var retid = $.ajax(obj);  
          
                //         return retid;  
                //     } catch (e) {  
                //         cc.log("_______ "+e);  
                //         return null;  
                //     }  
                // } else {  
                    // cc.log("--- native")
                    var http = new XMLHttpRequest();  
                    // http.setRequestHeader("Accept-Encoding", "gzip,deflate");  
                    // url = url+"?"+data;
                    if(cc.sys.isNative){
                        
                    }else{
                        url = url+"?"+data;
                    }
                    http.open(type, url, true);  
                    // http.send();  
          
                    // http.timeout = timeout;  
                    http.onreadystatechange = function() {  
                        cc.log(http.readyState);
                        if(http.readyState!=4)
                            return;
                            
                        var status = http.status;  
                        cc.log("----"+status);  
                        switch (status) {  
                            case 200:  
                                cc.log("200!");  
                                if(http.responseText == null || http.responseText == 'undefined' || http.responseText.length <= 0) {  
                                    onError(status);  
                                } else {  
                                    cc.log("status:" + http.status + ",ret:" + http.responseText);  
                                    if(responseType == "json") {  
                                        var json = JSON.parse(http.responseText);  
                                        if(json == null) {  
                                            onError(status);  
                                        } else {  
                                            onSuccess(json);  
                                        }  
                                    } else if(responseType == "text") {  
                                        onSuccess(http.responseText);  
                                    }  
                                }  
                                break;  
                            default:  
                                cc.log("hq:network error");  
                                onError(status);  
                                break;  
                        }  
                    };  
                    // cc.log("send data.."+data);
                    http.send(data); 
                    return http;  
                // }  
            },  
            onError : function(status) {  
            }  
        };  
    },
});
