/**
 * @author LancelotWG
 * 数据通信类
 */
dojo.declare("NetController",dojo.Stateful,{
    //
    ws:null,
    connect:false,
    constructor: function(){
        if (!window.WebSocket && window.MozWebSocket)
            window.WebSocket=window.MozWebSocket;
        if (!window.WebSocket)
            alert("抱歉，此版本的浏览器不支持Websocket，请升级浏览器或更换浏览器。");
    },
    onConnect: function(){
        var thisWs = this;
        this.ws = new WebSocket("ws://" + location.host + contextPath +"/ws/BaseNetAction");
        this.ws.onopen = function(){
            thisWs.connect = true;
            console.log("success open");
        };
        this.ws.onmessage = function(event) {
            console.log("***********接收消息**********");
            console.log("RECEIVE:"+event.data);
            thisWs.handleData(event.data);
        };
        this.ws.onclose = function(event){
            console.log("Client notified socket has closed",event);
            if(!thisWs.connect){
                alert("Websocket连接服务器失败，请稍后再试。");
                window.opener = null;
                window.open('','_self');
                window.close();
                window.location.href = "user_logout.xhtml";
            }
            thisWs.connect = false;
        };
    },
    handleData:function(data){
        var msg = new NetMsg(0,data);
    },
    send:function(data){
        this.ws.send(data);
    }
});