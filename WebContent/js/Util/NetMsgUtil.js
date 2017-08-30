/**
 * @author LancelotWG
 * 网络消息
 */
dojo.require("dojo.Stateful");
dojo.declare("NetMsgUtil",dojo.Stateful,{
    //消息模式
    msgUnParse:0,//解析用户发来的信息
    msgNew:1,
    msgChange:2,
    msgDelete:3,
    msgSynchronize:4,
    msgSave:5,//与服务器交换信息，保存
    msgLoad:6,//与服务器交换信息，读取
    msgProtection:7,
    msgRoleChange:8,//用户权限变化
    msgUserOnline:9,//用户上下线
    msgUserChat:10,
    //消息响应与请求(类型)
    typeRequest:0,
    typeResponse:1,
    //消息类别
    classMainFrame:0,
    classOS:1,
    classBus:2,
    classProcess:3,
    classComponent:4,
    classControlFlow:5,
    classBusConnect:6,
    //分隔符
    separatorAddress:"->",//消息发送与接收用户名分隔符
    separatorOperate:"->",
    separatorData:"?",
    separatorAttributes:"*",
    separatorAttribute:"#",
    separatorMultiAttribute:"^",
    //数据分隔符
    separatorArray:"^",
    separatorObjectItem:"$",
    separatorObjectAttribute:"-",
    separatorArrayStart:"|",
    separatorArrayEnd:"!",
    separatorObjectStart:"%",
    separatorObjectEnd:"~",
    separatorPlaceholder:"`",
    separatorNumber:"@",
    //配置标识
    notConfigure:0,
    configured:1,
    //组件操作方式
    ComponentCreateMode:0,
    ComponentNetCreateMode:1,
    ComponentMoveMode:2,
    dataSerialization:function(data){
        var serialization = "";
        if(data instanceof Array){
            serialization += this.separatorArrayStart;
            for(var i = 0;i<data.length;i++){
                serialization += this.dataSerialization(data[i]);
                if(i == data.length-1){

                }else{
                    serialization += this.separatorArray;
                }
            }
            serialization += this.separatorArrayEnd;
        }else if(data instanceof Object){
            var first = true;
            serialization += this.separatorObjectStart;
            for(var item in data){
                if(!first){
                    serialization += this.separatorObjectAttribute;
                }
                serialization = serialization + item + this.separatorObjectItem;
                serialization += this.dataSerialization(data[item]);
                first = false;
            }
            serialization += this.separatorObjectEnd;
        }else{
            if((typeof data) == "string"){
                serialization += data;
            }else if((typeof data) == "number"){
                serialization = serialization + this.separatorNumber + data;
            }
        }
        return serialization;
    },
    dataDeserialization:function(data){
        var type = data.charAt(0);
        if(type== this.separatorArrayStart || type == this.separatorObjectStart){
            var deserialization;
            var temp = [];
            data = data.slice(1,data.length-1);
            var indexStart;
            var charStart;
            var indexEnd;
            var charEnd;
            var find = false;
            var repeat = 1;
            for(var i = 0;i<data.length;i++){
                if(!find){
                    if(data.charAt(i) == this.separatorArrayStart || data.charAt(i) == this.separatorObjectStart){
                        charStart = data.charAt(i);
                        indexStart = i;
                        find = true;
                        if(charStart == this.separatorArrayStart){
                            charEnd = this.separatorArrayEnd;
                        }else if(charStart == this.separatorObjectStart){
                            charEnd = this.separatorObjectEnd;
                        }
                        continue;
                    }
                }
                if(find){
                    if(data.charAt(i) == charEnd){
                        repeat--;
                        if(repeat == 0){
                            indexEnd = i;
                            var subData = data.slice(indexStart,indexEnd+1);
                            data = data.replace(subData,this.separatorPlaceholder);
                            var deserializationTemp = this.dataDeserialization(subData);
                            temp.push(deserializationTemp);
                            find = false;
                            i=-1;
                            repeat = 1;
                        }
                    }else if(data.charAt(i) == charStart){
                        repeat++;
                    }
                }
            }
            if(type == this.separatorArrayStart){
                deserialization = [];
                if(data == ""){

                }else{
                    var items = data.split(this.separatorArray);
                    var tempIndex = 0;
                    for(var i = 0; i<items.length;i++){
                        if(items[i] == this.separatorPlaceholder){
                            deserialization.push(temp[tempIndex++]);
                        }else{
                            deserialization.push(this.dataDeserialization(items[i]));
                        }
                    }
                }
            }else if(type == this.separatorObjectStart){
                deserialization = {};
                if(data == ""){

                }else{
                    var items = data.split(this.separatorObjectAttribute);
                    var tempIndex = 0;
                    for(var i = 0; i<items.length;i++){
                        var attributes = items[i].split(this.separatorObjectItem);
                        if(attributes[1] == this.separatorPlaceholder){
                            deserialization[attributes[0]] = temp[tempIndex++];
                        }else{
                            deserialization[attributes[0]] = this.dataDeserialization(attributes[1]);
                        }
                    }
                }
            }
        }else{
            if(type == this.separatorNumber){
                var items = data.split(this.separatorNumber);
                deserialization = parseFloat(items[1]);
            }else{
                deserialization = data;
            }
        }
        return deserialization;
    }
});