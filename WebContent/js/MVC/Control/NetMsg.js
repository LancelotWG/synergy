/**
 * @author LancelotWG
 * 通信消息类
 */
dojo.declare("NetMsg",dojo.Stateful,{
    //
    type:0,
    data:null,
    parseData:"",
    additiveAttribute:"",
    fromUser:"",
    constructor: function(type,data,additiveAttribute){
        mainFrame.currentLoginTime = 0;//有操作登录时间重新计时
        if(netController.connect){
            this.type = type;
            this.data = data;
            this.additiveAttribute = additiveAttribute;
            if(type != NetMsgUtil.prototype.msgUnParse){
                if(type != NetMsgUtil.prototype.msgSave && type != NetMsgUtil.prototype.msgLoad){
                    if(type == 4){
                        this.parseData = userName + NetMsgUtil.prototype.separatorAddress + this.data/*shareUserGroup*/;
                    }else {
                        //发送消息头
                        this.parseData = userName + NetMsgUtil.prototype.separatorAddress + projectName/*shareUserGroup*/;
                    }
                }
            }
            this._msgParse();
        }else{

        }
    },
    _msgParse: function(){
        switch(this.type){
            case NetMsgUtil.prototype.msgUnParse://解析发来的信息
                this._unParseFromUser();
                this._updateWorkflow();
                break;
            case NetMsgUtil.prototype.msgNew:
                this._parseNew();
                break;
            case NetMsgUtil.prototype.msgChange:
                this._parseChange();
                break;
            case NetMsgUtil.prototype.msgDelete:
                this._parseDelete();
                break;
            case NetMsgUtil.prototype.msgSynchronize:
                this._parseSynchronize();
                break;
            case NetMsgUtil.prototype.msgSave://用户流程数据保存消息
                this._parseSave();
                break;
            case NetMsgUtil.prototype.msgLoad://用户流程数据读取消息
                this._parseLoad();
                break;
            case NetMsgUtil.prototype.msgProtection:
                this._parseProtection();
                break;
            case NetMsgUtil.prototype.msgRoleChange:
                this._parseRoleChange();
                break;
            case NetMsgUtil.prototype.msgUserOnline:
                this._parseUserOnline();
                break;
            case NetMsgUtil.prototype.msgUserChat:
                this._parseUserChat();
                break;
        }
    },
    msgSend:function(){
        if(netController.connect){
            console.log("############发送消息###########");
            console.log(this.parseData);
            netController.send(this.parseData);
        }
    },
    _parseOperateAdd:function(msg){
        this.parseData = this.parseData + NetMsgUtil.prototype.separatorOperate + msg;
    },
    _parseDataAdd:function(msg){
        this.parseData = this.parseData + NetMsgUtil.prototype.separatorData + msg;
    },
    _parseAttributesAdd:function(msg){
        this.parseData = this.parseData + NetMsgUtil.prototype.separatorAttributes + msg;
    },
    _parseAttributeAdd:function(msg){
        this.parseData = this.parseData + NetMsgUtil.prototype.separatorAttribute + msg;
    },
    /*_parseMultiAttributeAdd:function(){
        this.parseData = this.parseData + NetMsgUtil.prototype.separatorMultiAttribute;
    },*/
    _parseNew:function(){
        this._parseOperateAdd("new");
        if(this.data instanceof Sequence.Process){
            this._parseDataAdd("Process");
            this._parseAttributesAdd(this.additiveAttribute);
            this._parseAttributeAdd(nameIndexMap.get(this.data.type));
        }else if(this.data instanceof Component){
            this._parseDataAdd("Component");
            this._parseAttributesAdd(this.additiveAttribute);
            this._parseAttributeAdd(this.data.parent.name);
            this._parseAttributeAdd(nameIndexMap.get(this.data.type));
            this._parseAttributeAdd(this.data.type);
            this._parseAttributeAdd(this.data.name);
            this._parseAttributeAdd(this.data.configureTime);
            this._parseAttributeAdd(this.data.version);
        }else if(this.data instanceof OS){
            this._parseDataAdd("OS");
        }else if(this.data instanceof ControlFlow){
            this._parseDataAdd("ControlFlow");
            this._parseAttributesAdd(this.additiveAttribute);
            this._parseAttributeAdd(this.data.parent.name);
        }
        else if(this.data instanceof BusConnect){
            this._parseDataAdd("BusConnect");
            this._parseAttributesAdd(this.data.parent.name);
        }
    },
    _parseChange:function(){
        this._parseOperateAdd("change");
        if(this.data instanceof Sequence.Process){
            this._parseDataAdd("Process");
            if(this.additiveAttribute[0] == "name"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(this.data.name);
            }
        }else if(this.data instanceof Component){
            this._parseDataAdd("Component");
            if(this.additiveAttribute[0] == "position"){
                var index = this.data.parent.children.indexOf(this.data,0);
                index = index + "";
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.data.name);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(index);
            }else if(this.additiveAttribute[0] == "name"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(this.data.name);
            }else if(this.additiveAttribute[0] == "timeConfigure"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.data.name);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(this.data.configureTime);
            }else if(this.additiveAttribute[0] == "property"){
                var parent = this;
                parent._parseAttributesAdd(parent.additiveAttribute[0]);
                parent._parseAttributeAdd(parent.data.name);
                forEach(this.data.property,function(item){

                });
            }else if(this.additiveAttribute[0] == "dataFlow"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.data.name);
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.additiveAttribute[1]));
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.data.dataFlow));
            }
        }else if(this.data instanceof OS){
            this._parseDataAdd("OS");
            if(this.additiveAttribute[0] == "version"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(this.data.version);
            }
            else if(this.additiveAttribute[0] == "timeConfigure"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.additiveAttribute[1]));
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.data.timeConfigure));
            }
        }else if(this.data instanceof BusConnect){
            this._parseDataAdd("BusConnect");
            if(this.additiveAttribute[0] == "dataFlow") {
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.data.parent.name);
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.additiveAttribute[1]));
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.data.dataFlow));
            }
        }else if(this.data instanceof Bus){
            this._parseDataAdd("Bus");
            if(this.additiveAttribute[0] == "dataFlow"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.additiveAttribute[1]));
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.data.dataFlow));
            }else if(this.additiveAttribute[0] == "dataFlowItem"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.additiveAttribute[1]));
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(this.data.getDataItemName(this.data.currentBusName)));
            }
        }
    },
    _parseDelete:function(){
        this._parseOperateAdd("delete");
        if(this.data instanceof Sequence.Process){
            this._parseDataAdd("Process");
            this._parseAttributesAdd(this.additiveAttribute);
        }else if(this.data instanceof Component){
            this._parseDataAdd("Component");
            this._parseAttributesAdd(this.additiveAttribute);
        }else if(this.data instanceof BusConnect){
            this._parseDataAdd("BusConnect");
            this._parseAttributesAdd(this.data.parent.name);
        }else if(this.data instanceof ControlFlow){
            this._parseDataAdd("ControlFlow");
            this._parseAttributesAdd(this.additiveAttribute);
            this._parseAttributeAdd(this.data.parent.name);
        }else if(this.data instanceof Bus){
            this._parseDataAdd("Bus");
        }
    },
    _parseSynchronize:function(){
        this._parseOperateAdd("synchronize");
        if(this.additiveAttribute == "request"){
            this._parseDataAdd("request");
        }else if(this.additiveAttribute == "response"){
            this._parseDataAdd("response");
            //反馈数据
            this._serialize();
            /*var responseProcess = reg.getComponentById(1);//此处添加数据代码
            this._parseAttributesAdd(nameIndexMap.get(responseProcess.type));
            this._parseAttributeAdd(responseProcess.name);
            for(var i = 0;i<responseProcess.children.length;i++){
                var child = responseProcess.children[i];
                if(child instanceof Component){
                    if(child.subProcess != null){
                        this._retrievalSubProcess(child.subProcess);
                    }else{
                        this._parseAttributesAdd(child.parent.name);
                        this._parseAttributeAdd(nameIndexMap.get(child.type));
                        this._parseAttributeAdd(child.type);
                        this._parseAttributeAdd(child.name);
                        this._parseAttributeAdd(child.configureTime);
                    }
                }
            }*/
        }
    },
    _retrievalSubProcess:function(subProcess){
        /*//Component有SubProcess
        if(subProcess != os.mainProcess){
            this._parseAttributesAdd("Component");
            this._parseAttributeAdd(subProcess.parentComponent.parent.name);
            this._parseAttributeAdd(nameIndexMap.get(subProcess.parentComponent.type));
            this._parseAttributeAdd(subProcess.parentComponent.type);
            this._parseAttributeAdd(subProcess.parentComponent.name);
            this._parseAttributeAdd(subProcess.parentComponent.configureTime);
            this._parseAttributeAdd(subProcess.name);
        }
        //可扩展属性
        if(subProcess.parentComponent.busConnect){
            //BusConnect
            this._parseAttributesAdd("BusConnect");
            this._parseAttributeAdd(subProcess.parentComponent.name);
            if(subProcess.parentComponent.busConnect.isConfigure){
                this._parseAttributeAdd(NetMsgUtil.prototype.configured);
            }else{
                this._parseAttributeAdd(NetMsgUtil.prototype.notConfigure);
            }
            //可扩展属性
        }*/
        for(var i = 0;i<subProcess.children.length;i++){
            var child = subProcess.children[i];
            if(child instanceof Component){
                //Component
                this._parseAttributesAdd("Component");
                this._parseAttributeAdd(child.parent.name);
                this._parseAttributeAdd(nameIndexMap.get(child.type));
                this._parseAttributeAdd(child.type);
                this._parseAttributeAdd(child.name);
                this._parseAttributeAdd(child.configureTime);
                this._parseAttributeAdd(child.version);
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(child.dataFlow));
                //可扩展属性
                if (child.subProcess != null){
                    this._parseAttributeAdd(child.subProcess.name);
                    this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(child.subProcess.palette));
                    this._retrievalSubProcess(child.subProcess);
                }
                if(child.busConnect){
                    //BusConnect
                    this._parseAttributesAdd("BusConnect");
                    this._parseAttributeAdd(child.name);
                    //修改支持未配置完成的数据保存
                    if(child.busConnect.isConfigure){
                        this._parseAttributeAdd(NetMsgUtil.prototype.configured);
                        this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(child.busConnect.dataFlow));
                    }else{
                        this._parseAttributeAdd(NetMsgUtil.prototype.notConfigure);
                        this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(child.busConnect.dataFlow));
                    }
                    //可扩展属性
                }
            }else if(child instanceof ControlFlow){
                //ControlFlow
                this._parseAttributesAdd("ControlFlow");
                var index = i + "";
                this._parseAttributeAdd(child.parent.name);
                this._parseAttributeAdd(index);
                //可扩展属性
            }
        }
    },
    _serialize:function(){
        this._parseAttributesAdd(projectName);
        //this._parseAttributeAdd(projectCreator);
        this._parseAttributeAdd(mainFrame.status);
        switch (mainFrame.status){
            case ControlUtil.prototype.statusBlank:

                break;
            case ControlUtil.prototype.statusPrepare:
                //os刚刚创建，并未进行配置
                this._parseAttributesAdd("OS");
                //可扩展属性
                //os刚刚创建，并未进行配置
                break;
            case ControlUtil.prototype.statusReady:
                //新增数据，OS、Bus
                //OS
                this._parseAttributesAdd("OS");
                this._parseAttributeAdd(os.version);
                this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(os.timeConfigure));
                //可扩展属性
                //Bus
                this._parseAttributesAdd("Bus");
                if(bus.isConfigure){
                    this._parseAttributeAdd(NetMsgUtil.prototype.configured);
                    this._parseAttributeAdd(NetMsgUtil.prototype.dataSerialization(bus.dataFlow));
                }else{
                    this._parseAttributeAdd(NetMsgUtil.prototype.notConfigure);
                }
                //可扩展属性
                //mainProcess
                this._parseAttributesAdd("Process");
                var responseProcess = os.mainProcess;//此处添加数据代码
                this._parseAttributeAdd(responseProcess.name);
                this._parseAttributeAdd(nameIndexMap.get(responseProcess.type));
                //可扩展属性
                //Component、ControlFlow、busConnect
                this._retrievalSubProcess(responseProcess);
                /*for(var i = 0;i<responseProcess.children.length;i++){
                    var child = responseProcess.children[i];
                    if(child instanceof Component){
                        if(child.subProcess != null){
                            this._retrievalSubProcess(child.subProcess);
                        }else{
                            //Component
                            this._parseAttributesAdd("Component");
                            this._parseAttributeAdd(child.parent.name);
                            this._parseAttributeAdd(nameIndexMap.get(child.type));
                            this._parseAttributeAdd(child.type);
                            this._parseAttributeAdd(child.name);
                            this._parseAttributeAdd(child.configureTime);
                            //可扩展属性
                            if(child.busConnect){
                                //BusConnect
                                this._parseAttributesAdd("BusConnect");
                                this._parseAttributeAdd(child.name);
                                if(child.busConnect.isConfigure){
                                    this._parseAttributeAdd(NetMsgUtil.prototype.configured);
                                }else{
                                    this._parseAttributeAdd(NetMsgUtil.prototype.notConfigure);
                                }
                                //可扩展属性
                            }
                        }
                    }else if(child instanceof ControlFlow){
                        //ControlFlow
                        this._parseAttributesAdd("ControlFlow");
                        var index = i + "";
                        this._parseAttributeAdd(child.parent.name);
                        this._parseAttributeAdd(index);
                        //可扩展属性
                    }
                }*/
                break;
        }
        /*//新增数据，OS、Bus

        //新增数据，OS、Bus
        //原始串行化数据
        var responseProcess = reg.getComponentById(1);//此处添加数据代码
        this._parseAttributesAdd(nameIndexMap.get(responseProcess.type));
        this._parseAttributeAdd(responseProcess.name);
        for(var i = 0;i<responseProcess.children.length;i++){
            var child = responseProcess.children[i];
            if(child instanceof Component){
                if(child.subProcess != null){
                    this._retrievalSubProcess(child.subProcess);
                }else{
                    this._parseAttributesAdd(child.parent.name);
                    this._parseAttributeAdd(nameIndexMap.get(child.type));
                    this._parseAttributeAdd(child.type);
                    this._parseAttributeAdd(child.name);
                    this._parseAttributeAdd(child.configureTime);
                }
            }
        }
        //原始串行化数据
        //新增数据，Control、BusConnect

        //新增数据，Control、BusConnect*/
    },
    _deserialize:function(values){
        projectCreator = values[0];
        var value = values[1].split("#");
        if(value[0] != ""){
            projectName = value[0];
            switch (parseInt(value[1])){
                case ControlUtil.prototype.statusBlank:
                    mainFrame.onCreate();
                    break;
                case ControlUtil.prototype.statusPrepare:
                    mainFrame.onCreate();
                    value = values[2].split("#");
                    if(value[0] == "OS"){
                        //创建OS
                        this._createOS();
                    }
                    break;
                case ControlUtil.prototype.statusReady:
                    mainFrame.onCreate();
                    var index = new Hash();
                    for(var i = 2;i < values.length;i++){
                        value = values[i].split("#");
                        if(value[0] == "OS"){
                            this._createOS();
                            menuManager.globalMenu.removeChild(0);
                            menuManager.globalMenu.removeChild(0);
                            os.version = value[1];
                            os.isConfigure = true;
                            dojo.removeClass(os.node,"notConfigure");
                            os._initialProject();
                            os.timeConfigure = NetMsgUtil.prototype.dataDeserialization(value[2]);
                            timeConfigureGrid.rebuildGridLayout();
                            os.oldTimeConfigure = [];
                            for(var j = 0;j < os.timeConfigure.length;j++){
                                os.oldTimeConfigure.push(os.timeConfigure[j]);
                            }
                            /*menuManager.globalMenu.removeChild(0);
                            menuManager.globalMenu.removeChild(0);
                            os.configuring();*/
                        }else if(value[0] == "Bus"){
                            if(parseInt(value[1])){
                                bus.dataFlow = NetMsgUtil.prototype.dataDeserialization(value[2]);
                                bus.isConfigure = true;
                                menuManager.busMenu.removeChild(0);
                                menuManager.initialBusMenu();
                                process.validate();
                            }else{

                            }
                        }else if(value[0] == "Process"){
                            nameIndexMap.set("Process",parseInt(value[2]));
                            var mainProcess = os.mainProcess;
                            mainProcess.setName(value[1]);
                        }else if(value[0] == "Component"){
                            if(index.get(value[1])==undefined){
                                index.set(value[1],1);
                            }else{
                                var Index = index.get(value[1]);
                                Index += 2;
                                index.set(value[1],Index);
                            }
                            var parentProcess = reg.getComponentByName(value[1]);
                            nameIndexMap.set(value[3],parseInt(value[2]));
                            var comp;
                            if(parentProcess == os.mainProcess){
                                comp = new Component({type:value[3],mainType:value[3],name:value[4],configureTime:value[5],version:value[6]});
                            }else{
                                comp = new Component({type:value[3],mainType:parentProcess.parentComponent.mainType,name:value[4],configureTime:value[5],version:value[6]});
                            }
                            comp.dataFlow = NetMsgUtil.prototype.dataDeserialization(value[7]);
                            if(comp.nameField) new InplaceEditor({},comp.nameField);
                            Rico.Corner.round(comp.node, {corners:"all", color: "transparent"});
                            dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name, "activity", comp.id));
                            reg.registry(comp);
                            var htmlElement = parentProcess.children[index.get(value[1])].node;
                            var theGUI = comp.node;
                            if (RicoUtil.getElementsComputedStyle(theGUI, "position") == "absolute"){
                                theGUI.style.position = "static";
                                theGUI.style.top = "";
                                theGUI.style.top = "";
                            }
                            dojo.place(theGUI, htmlElement, "after");
                            parentProcess.addChild(comp,ControlUtil.prototype.ComponentNetMoveMode,null);
                            comp.generateTreeNode(false);
                            parentProcess.validate();
                            if(parentProcess != process)
                                YD.setStyle(parentProcess.node,"display","none");
                            else
                                YD.setStyle(parentProcess.node,"display","block");
                            if(value.length == 10) {
                                comp.subProcess = new Sequence.Process({
                                    name: value[8],
                                    type: "Process",
                                    refNode: $("maincontent"),
                                    pos: "last",
                                    parentComponent: comp,
                                    palette:NetMsgUtil.prototype.dataDeserialization(value[9])
                                });
                                /*comp.subProcess.hideBorder();*/
                                reg.registry(comp.subProcess);
                                YD.setStyle(comp.subProcess.node, "display", "none");
                                comp.subProcess.generateTreeNode(false);//树
                            }
                        }else if(value[0] == "ControlFlow"){
                            var parentProcess = reg.getComponentByName(value[1]);
                            var controlFlow = new ControlFlow();
                            controlFlow.parent = parentProcess;
                            var theGUI = controlFlow.node;
                            var ph = parentProcess.children[parseInt(value[2])];
                            var htmlElement = ph.node;
                            dojo.place(theGUI,htmlElement, "after");
                            parentProcess.addControlFlow(ph,controlFlow);
                            parentProcess.validate();
                        }else if(value[0] == "BusConnect"){
                            var comp = reg.getComponentByName(value[1]);
                            var busConnect = new BusConnect();
                            busConnect.parent = comp;
                            var theGUI = busConnect.node;
                            dojo.place(theGUI, comp.componentNode, "after");
                            comp.addBusConnect(busConnect);
                            if(value[3] != undefined){
                                busConnect.dataFlow = NetMsgUtil.prototype.dataDeserialization(value[3]);
                                busConnect._dataFlowDeepCopy(0);
                            }
                            busConnect.isConfigure = value[2];
                            comp.parent.validate();
                        }
                    }
                    break;
                default:
                    //消息有错误请求重新发送
                    var msg = new NetMsg(4,null,"request");
                    msg.msgSend();
                    break;
            }
        }else{
            //消息有错误请求重新发送
            var msg = new NetMsg(4,null,"request");
            msg.msgSend();
        }
        /*var value = values[1].split("#");
        var index = parseInt(value[0]);
        nameIndexMap.set("Process",index);
        var mainProcess = reg.getComponentById(1);
        mainProcess.setName(value[1]);
        index = new Hash();
        for(var i = 2;i < values.length;i++){
            value = values[i].split("#");
            if(index.get(value[0])==undefined){
                index.set(value[0],1);
            }else{
                var Index = index.get(value[0]);
                Index += 2;
                index.set(value[0],Index);
            }
            var parentProcess = reg.getComponentByName(value[0]);
            nameIndexMap.set(value[2],parseInt(value[1]));
            var comp = new Component({type:value[2],name:value[3],configureTime:value[4]});
            if(comp.nameField) new InplaceEditor({},comp.nameField);
            Rico.Corner.round(comp.node, {corners:"all", color: "transparent"});
            dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name, "activity", comp.id));
            reg.registry(comp);
            var htmlElement = parentProcess.children[index.get(value[0])].node;
            var theGUI = comp.node;
            if (RicoUtil.getElementsComputedStyle(theGUI, "position") == "absolute"){
                theGUI.style.position = "static";
                theGUI.style.top = "";
                theGUI.style.top = "";
            }
            dojo.place(theGUI, htmlElement, "after");
            parentProcess.addChild(comp);
            comp.generateTreeNode(false);
            parentProcess.validate();
            if(parentProcess != process)
                YD.setStyle(parentProcess.node,"display","none");
            else
                YD.setStyle(parentProcess.node,"display","block");
            if(value.length == 5){

            }else if(value.length == 6){
                comp.subProcess = new Sequence.Process({
                    name:value[5],
                    type:"Process",
                    refNode: $("maincontent"),
                    pos: "last",
                    parentComponent:comp
                });
                /!*comp.subProcess.hideBorder();*!/
                reg.registry(comp.subProcess);
                YD.setStyle(comp.subProcess.node,"display","none");
                comp.subProcess.generateTreeNode(false);//树
            }
        }*/
    },
    _parseSave:function(){
        this.parseData = this.parseData + userName;
        this._serialize();
    },
    _parseLoad:function(){
        var values = this.data.split("*");
        if(values != ""){
            console.log(values[0]);
            this._deserialize(values);
        }
    },
    _parseProtection:function(){
        this._parseOperateAdd("protection");
        if(this.additiveAttribute == "request"){
            this._parseDataAdd("request");
            this._parseAttributesAdd(this.data.name);
        }else if(this.additiveAttribute == "response"){
            this._parseDataAdd("response");
            if(this.data != null){
                this._parseAttributesAdd(this.data.name);
                var userList = this.data.keyHolder;
                for (var i = 0;i<userList.length;i++){
                    this._parseAttributeAdd(userList[i]);
                }
            }
        }else if(this.additiveAttribute == "unlocked"){
            this._parseDataAdd("unlocked");
            this._parseAttributesAdd(this.data.name);
        }
    },
    _parseRoleChange:function(){
        this._parseOperateAdd("roleChange");
        this._parseDataAdd(this.additiveAttribute[0]);
        this._parseAttributesAdd(this.additiveAttribute[1]);
        this._parseAttributeAdd(this.additiveAttribute[2]);
    },
    _parseUserOnline:function(){
        this._parseOperateAdd("userOnline");
        this._parseDataAdd(this.additiveAttribute[0]);
        this._parseAttributesAdd(this.additiveAttribute[1]);
    },
    _parseUserChat:function(){
        this._parseOperateAdd("userChat");
        this._parseDataAdd(userName);
        this._parseAttributesAdd(this.data);
        this._parseAttributeAdd((new Date()).toLocaleTimeString());
    },
    /*_parseDataClassAdd:function(operate){
        if(this.data instanceof Sequence.Process){
            this._parseDataAdd("Process");
            if(operate == "new"){
                this._parseAttributesAdd(this.additiveAttribute);
            }else if(operate == "change"){
                this._parseAttributesAdd(this.additiveAttribute[0]);
                this._parseAttributeAdd(this.additiveAttribute[1]);
                this._parseAttributeAdd(this.data.name);
            }else if(operate == "delete"){

            }else if(operate == "synchronize"){

            }
        }else if(this.data instanceof Component){
            this._parseDataAdd("Component");
            if(operate == "new"){
                this._parseAttributesAdd(this.additiveAttribute);
                this._parseAttributeAdd(this.data.parent.name);
                this._parseAttributeAdd(this.data.type);
                this._parseAttributeAdd(this.data.name);
                this._parseAttributeAdd(this.data.configureTime);
            }else if(operate == "change"){
                if(this.additiveAttribute[0] == "position"){
                    var index = this.data.parent.children.indexOf(this,0);
                    index = index + "";
                    this._parseAttributesAdd(this.additiveAttribute[0]);
                    this._parseAttributeAdd(this.additiveAttribute[1]);
                    this._parseAttributeAdd(index);
                }else if(this.additiveAttribute[0] == "attribute"){
                    this._parseAttributesAdd(this.additiveAttribute[0]);
                    this._parseAttributeAdd(this.additiveAttribute[1]);
                    this._parseAttributeAdd(this.data.name);
                }
            }else if(operate == "delete"){

            }else if(operate == "synchronize"){

            }
        }
    },*/
    _unParseFromUser:function(){
        var vals = this.data.split(NetMsgUtil.prototype.separatorAddress);
        this.fromUser = vals[0];
        console.log("From:"+vals[0]);
        if(vals[0] == "server"){
            if(vals[1] == "success"){
                console.log("msg:"+vals[2]);
            }else if(vals[1] == "error"){
                console.log("error:"+vals[2]);
                alert("该浏览器用户："+userName+"，已通过websokect连接到组，请勿连接到其他组！");
                window.opener = null;
                window.open('','_self');
                window.close();
                window.location.href = "user_error.xhtml?type=user_exist";
            }
        }else{
            this.data = vals[1];
        }
    },
    _updateWorkflow:function(){
        var vals = this.data.split("?");//可以在这里写new change delete synchronize的相关操作
        var operate = vals[0];
        var data = vals[1];
        if(operate == "new"){
            this._unParseNewData(data);
        }else if(operate == "change"){
            this._unParseChangeData(data);
        }else if(operate == "delete"){
            this._unParseDeleteData(data);
        }else if(operate == "synchronize"){
            this._unParseSynchronizeData(data);
        }else if(operate == "protection"){
            this._unParseProtectionData(data);
        }else if(operate == "roleChange"){
            this._unParseRoleChangeData(data);
        }else if(operate == "userOnline"){
            this._unParseUserOnlineData(data);
        }else if(operate == "userChat"){
            this._unParseUserChatData(data);
        }
    },
    _unParseNewData:function(string){
        var values = string.split("*");
        if(values[0] == "Process"){
            this._createProcess(values[1]);

        }else if(values[0] == "Component"){
            this._createComponent(values[1]);
            /*var value = values[1].split("#");
            var comp = new Component({type:value[1],name:value[2],configureTime:value[3]});
            if(comp.nameField) new InplaceEditor({},comp.nameField);
            //圆角
            Rico.Corner.round(comp.node, {corners:"all", color: "transparent"});
            //将创建好的组件也注册为可移动的
            dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name, "activity", comp.id));

            reg.registry(comp);

            /!*var comp = newComponent.getDroppedGUI();
            console.log(comp);*!/
            var index = value[0] - 1;
            var htmlElement = process.children[index].node;
            /!*var htmlElement = insertPlaceholder.node;*!/
           /!* //此处直接得到的并不是Dom节点，而是节点对应的包装对象
            var wrappedObj = draggableObjects[i].getDroppedGUI();
            //htmlElement和theGUI具有相同的parent,将htmlElement的parent指定给wrappedObj
            var parent = this.wrappedObj.parent;
            var moveOrCopy;
            //如果wrappedObj.parent存在，说明是move或者copy
            if (wrappedObj.parent) {
                moveOrCopy = true;
            }*!/

                var theGUI = comp.node;

                if (RicoUtil.getElementsComputedStyle(theGUI, "position") == "absolute"){
                    theGUI.style.position = "static";
                    theGUI.style.top = "";
                    theGUI.style.top = "";
                }
            /!*var isMove = false;
                if (dndManager.moveStyle == "move" && moveOrCopy) {
                    wrappedObj.parent.removeChild(wrappedObj);
                    isMove = true;
                }*!/
                //Sequence的addChild方法会判断前一个占位符的类型，所以必须等新创建的节点被加入到Dom中后才能使用它
                dojo.place(theGUI, htmlElement, "after");
            process.addChild(comp);
            comp.generateTreeNode(false);*/
        }else if(values[0] == "OS"){
            this._createOS();
        }
        else if(values[0] == "ControlFlow"){
            this._createControlFlow(values[1]);
        }
        else if(values[0] == "BusConnect"){
            this._createBusConnect(values[1]);
        }
        /*else if(string == "Start"){
            process.children = new Array();
            process.start = new Start({
                parent: process,
                refNode: process.node,
                pos: "first",
                name: "Start"
            });
            var arrow = new Arrow({parent:process,refNode:process.start.node,pos:"after"});
            var ph = new Placeholder({
                parent: process,
                refNode: arrow.node,
                pos: "after",
                type: "dropBefore"
            });
            dndManager.registerDropZone(new CustomDropzone(ph));
            process.children.push(process.start);
            process.children.push(arrow);
            process.children.push(ph);
            ph.accept
        }else if(string == "Stop"){
            process.start = new Start({
                parent: process,
                refNode: process.node,
                pos: "first",
                name: "Start"
            });
            process.children.push(process.start);
        }*/
    },
    _unParseChangeData:function(string){
        var values = string.split("*");
        if(values[0] == "Process"){
            var value = values[1].split("#");
            if(value[0] == "name"){
                var change= reg.getComponentByName(value[1]);
                change.setName(value[3]);
            }
        }else if(values[0] == "Component"){
            var value = values[1].split("#");
            if(value[0] == "name"){
                var change = reg.getComponentByName(value[1]);
                change.setName(value[3]);
            }else if(value[0] == "timeConfigure"){
                var change = reg.getComponentByName(value[1]);
                change.configureTime = value[3];
                process.validate();
            }else if(value[0] == "position"){
                var change = reg.getComponentByName(value[1]);
                var parentProcess = change.parent;
                var oldPosition = parseInt(value[2]);
                var newPosition = parseInt(value[3]);
                var placeholderIndex = newPosition - 1;
                var theGUI = change.node;
                parentProcess.removeChild(change,true);
                var htmlElement = parentProcess.children[placeholderIndex].node;
                dojo.place(theGUI, htmlElement, "after");
                parentProcess.addChild(change,ControlUtil.prototype.ComponentNetMoveMode,null);
                parentProcess.addAndSortTreeNode();
                parentProcess.validate();
                if(parentProcess != process)
                    YD.setStyle(parentProcess.node,"display","none");
                else
                    YD.setStyle(parentProcess.node,"display","block");
            }else if(value[0] == "dataFlow"){
                var change = reg.getComponentByName(value[1]);
                change.dataFlow = NetMsgUtil.prototype.dataDeserialization(value[3]);
            }
        }else if(values[0] == "OS"){
            var value = values[1].split("#");
            if(value[0] == "version"){
                menuManager.globalMenu.removeChild(0);
                menuManager.globalMenu.removeChild(0);
                os.version = value[2];
                os.isConfigure = true;
                dojo.removeClass(os.node,"notConfigure");
                os._initialProject();
            }else if(value[0] == "timeConfigure"){
                os.timeConfigure = NetMsgUtil.prototype.dataDeserialization(value[2]);
                timeConfigureGrid.rebuildGridLayout();
                os.oldTimeConfigure = [];
                for(var i = 0;i < os.timeConfigure.length;i++){
                    os.oldTimeConfigure.push(os.timeConfigure[i]);
                }
            }
        }else if(values[0] == "BusConnect"){
            var value = values[1].split("#");
            if(value[0] == "dataFlow"){
                var change = reg.getComponentByName(value[1]);
                change.busConnect.dataFlow = NetMsgUtil.prototype.dataDeserialization(value[3]);
                change.busConnect._dataFlowDeepCopy(0);
                if(change.subProcess){
                    change.busConnect._subProcessApplyChange(change.subProcess);
                }else{
                    change.busConnect.isAllDelete = false;
                }
                process.validate();
            }
        }else if(values[0] == "Bus"){
            var value = values[1].split("#");
            if(value[0] == "dataFlow"){
                bus.dataFlow = NetMsgUtil.prototype.dataDeserialization(value[1]);
                bus.isConfigure = true;
                menuManager.busMenu.removeChild(0);
                menuManager.initialBusMenu();
                process.validate();
            }else if(value[0] == "dataFlowItem"){
                bus.setDataItemName(NetMsgUtil.prototype.dataDeserialization(value[1]));
            }
        }
    },
    _unParseDeleteData:function(string){
        var values = string.split("*");
        if(values[0] == "Process"){
            var deleteProcess = reg.getComponentByName(values[1]);
            var parentComponent = deleteProcess.parentComponent;
            parentComponent.subProcess = null;
            parentComponent.parent.validate();
        }else if(values[0] == "Component"){
            var deleteComponent = reg.getComponentByName(values[1]);
            deleteComponent.parent.removeChild(deleteComponent);
            process.validate();
        }else if(values[0] == "BusConnect"){
            var comp = reg.getComponentByName(values[1]);
            comp.removeBusConnect();
            comp.parent.validate();
        }else if(values[0] == "ControlFlow"){
            var value = values[1].split("#");
            var parent = reg.getComponentByName(value[1]);
            var deleteControlFlow = parent.children[value[0]];
            parent.removeControlFlow(deleteControlFlow);
            parent.validate();
        }else if(values[0] == "Bus"){
            bus._deleteBusConnect();
            bus.dataFlow = [];
            bus.isConfigure = false;
            menuManager.busMenu.removeChild(0);
            menuManager.busMenu.removeChild(0);
            menuManager.initialLoadBusMenu();
            process.validate();
        }
    },
    _unParseSynchronizeData:function(string){
        var values = string.split("*");
        if(values[0] == "request"){
            var msg = new NetMsg(4,this.fromUser,"response");
            msg.msgSend();
        }else if(values[0] == "response"){
            mainFrame.updatePersonnelList();
            this._deserialize(values);
            /*var value = values[1].split("#");
            var index = parseInt(value[0]);
            nameIndexMap.set("Process",index);
            var mainProcess = reg.getComponentById(1);
            mainProcess.setName(value[1]);
            index = new Hash();
            for(var i = 2;i < values.length;i++){
                value = values[i].split("#");
                if(index.get(value[0])==undefined){
                    index.set(value[0],2);
                }else{
                    var Index = index.get(value[0]);
                    Index += 3;
                    index.set(value[0],Index);
                }
                var parentProcess = reg.getComponentByName(value[0]);
                nameIndexMap.set(value[2],parseInt(value[1]));
                var comp = new Component({type:value[2],name:value[3],configureTime:value[4]});
                if(comp.nameField) new InplaceEditor({},comp.nameField);
                Rico.Corner.round(comp.node, {corners:"all", color: "transparent"});
                dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name, "activity", comp.id));
                reg.registry(comp);
                var htmlElement = parentProcess.children[index.get(value[0])].node;
                var theGUI = comp.node;
                if (RicoUtil.getElementsComputedStyle(theGUI, "position") == "absolute"){
                    theGUI.style.position = "static";
                    theGUI.style.top = "";
                    theGUI.style.top = "";
                }
                dojo.place(theGUI, htmlElement, "after");
                parentProcess.addChild(comp);
                comp.generateTreeNode(false);
                parentProcess.validate();
                if(parentProcess != process)
                    YD.setStyle(parentProcess.node,"display","none");
                else
                    YD.setStyle(parentProcess.node,"display","block");
                if(value.length == 5){

                }else if(value.length == 6){
                    comp.subProcess = new Sequence.Process({
                        name:value[5],
                        type:"Process",
                        refNode: $("maincontent"),
                        pos: "last",
                        parentComponent:comp
                    });
                    comp.subProcess.hideBorder();
                    reg.registry(comp.subProcess);
                    YD.setStyle(comp.subProcess.node,"display","none");
                    comp.subProcess.generateTreeNode(false);//树
                }
            }*/
            //
            switch (mainFrame.status){
                case ControlUtil.prototype.statusBlank:
                    break;
                case ControlUtil.prototype.statusPrepare:
                    break;
                case ControlUtil.prototype.statusReady:
                    //修改:暂时注释掉的锁同步请求
                    //var msg = new NetMsg(7,process,"request");
                    //msg.msgSend();
                    break;
            }
            //
        }
    },
    _unParseProtectionData:function(string){
        console.log("##########Protection###########");
        var values = string.split("*");
        if(values[0] == "request"){
            console.log("***********request************");
            /*if(values[1] == process.name){
                var msg = new NetMsg(7,process,"response");
                msg.msgSend();
            }else{
                var msg = new NetMsg(7,process,"response");
                msg.msgSend();
            }*/
            //###########new test###########
            var msg = new NetMsg(7,process,"response");
            msg.msgSend();
            var lockedProcess = reg.getComponentByName(values[1]);
            if(lockedProcess == process){

            }else{
                lockedProcess.keyHolder.push(this.fromUser);
                if(lockedProcess.keyHolder[0] == userName || lockedProcess.keyHolder.length == 0) {
                    lockedProcess.locked = false;
                }else{
                    lockedProcess.locked = true;
                }
                lockedProcess.validate();
                lockedProcess.addAndSortTreeNode();
            }
            process.validate();
            process.addAndSortTreeNode();
        }else if(values[0] == "response"){
            console.log("***********response************");
            var value = values[1].split("#");
            /*if(value[0] == process.name){
                if(value.length > process.keyHolder.length){
                    process.keyHolder = new Array();
                    for(var i = 1;i < value.length;i++){
                        process.keyHolder.push(value[i]);
                    }
                    process.keyHolder.push(userName);
                    if(process.keyHolder.length <= 1) {
                        process.locked = false;
                    }else{
                        process.locked = true;
                    }
                    timeConfigureGrid.isLocked();
                    console.log("userName:"+userName+" processName:"+process.name+" userList:"+process.keyHolder.toString());
                }
            }else{

            }*/
            //###########new test###########
            var lockedProcess = reg.getComponentByName(value[0]);
            if(value.length > lockedProcess.keyHolder.length){
                lockedProcess.keyHolder = new Array();
                for(var i = 1;i < value.length;i++){
                    lockedProcess.keyHolder.push(value[i]);
                }
                if(lockedProcess == process){
                    lockedProcess.keyHolder.push(userName);
                }else{

                }
            }
            if(/*lockedProcess.keyHolder.length <= 1*/lockedProcess.keyHolder[0] == userName || lockedProcess.keyHolder.length == 0) {
                lockedProcess.locked = false;
            }else{
                lockedProcess.locked = true;
            }
            timeConfigureGrid.isLocked();
            console.log("userName:"+userName+" processName:"+lockedProcess.name+" userList:"+lockedProcess.keyHolder.toString());
            lockedProcess.validate();
            lockedProcess.addAndSortTreeNode();
            process.validate();
            process.addAndSortTreeNode();
            /*timeConfigureGrid.grid._refresh();*/
        }else if(values[0] == "unlocked"){
            console.log("***********unlocked************");
            /*if(values[1] == process.name){
                var index = process.keyHolder.indexOf(this.fromUser,0);
                if(index < 0){
                    return;
                }
                process.keyHolder.splice(index,1);
                if(process.keyHolder.length <= 1) {
                    process.locked = false;
                }else{
                    process.locked = true;
                }
                timeConfigureGrid.isLocked();
                console.log("userName:"+userName+" processName:"+process.name+" userList:"+process.keyHolder.toString());
            }else{

            }*/
            //###########new test###########
            var lockedProcess = reg.getComponentByName(values[1]);
            var index = lockedProcess.keyHolder.indexOf(this.fromUser,0);
            if(index < 0){
                return;
            }
            lockedProcess.keyHolder.splice(index,1);
            if(/*lockedProcess.keyHolder.length <= 1*/lockedProcess.keyHolder[0] == userName || lockedProcess.keyHolder.length == 0) {
                lockedProcess.locked = false;
            }else{
                lockedProcess.locked = true;
            }
            timeConfigureGrid.isLocked();
            console.log("userName:"+userName+" processName:"+lockedProcess.name+" userList:"+lockedProcess.keyHolder.toString());
            lockedProcess.validate();
            lockedProcess.addAndSortTreeNode();
            process.validate();
            process.addAndSortTreeNode();
            /*timeConfigureGrid.grid._refresh();*/
        }
    },
    _unParseRoleChangeData:function(string){
        var values = string.split("*");
        var change = values[1].split("#");
        var role = change[0];
        var name = change[1];
        if(values[0] == "a"){

        }else if(values[0] == "b"){
            var strs1 = role.split("|");
            var operation1 = strs1[0];
            var competent1 = strs1[1];
            if(operation1 == "0"){
                mainFrame._removeCompetentMember(true, name + "(" + competent1 + ")");
            }else if(operation1 == "1"){
                if(mainFrame.users.get(name) == "1"){
                    mainFrame._addCompetentMember(name + "(" + competent1 + ")", "1", false);
                }else{
                    mainFrame._addCompetentMember(name + "(" + competent1 + ")", "0", false);
                }
            }
        }else if(values[0] == "c"){
            if(role == "0"){
                mainFrame._removeSoftwareDesigner(true, name);
            }else if(role == "1"){
                if(mainFrame.users.get(name) == "1"){
                    mainFrame._addSoftwareDesigner(name, "1", false);
                }else{
                    mainFrame._addSoftwareDesigner(name, "0", false);
                }
            }
        }else if(values[0] == "x"){
            if(role == "0"){
                mainFrame._removeProjectPersonnel(true, name);
            }else if(role == "1"){

            }
        }
        /*if(userName == name){
            if(values[0] == "a"){
                user.role[0] = role;
            }else if(values[0] == "b"){
                var strs = role.split("|");
                var operation = strs[0];
                var competent = strs[1];
                var temp = "";
                if(operation == "0"){
                    if(user.role[1] != "null"){
                        var competents = user.role[1].split("^");
                        for(var i = 0; i < competents.length; i++){
                            if(competents[i] != competent){
                                temp += (competents[i] + "^");
                            }
                        }
                        temp = temp.substring(0, temp.length - 1);
                        user.role[1] = temp;
                    }
                }else if(operation == "1"){
                    if(user.role[1] == "null"){
                        user.role[1] = competent;
                    }else if(user.role[1] != "null"){
                        user.role[1] += ("^" + competent);
                    }
                }
            }else if(values[0] == "c"){
                user.role[2] = role;
            }
        }*/
    },
    _unParseUserOnlineData:function(string){
        var values = string.split("*");
        mainFrame.usersOnline(values[1], values[0]);
        var frame = window.frames["userMessagesBox"];
        if(values[0] == "0"){
            frame.document.body.innerHTML += ("<div style='color: #FF0000'>System: " + values[1] + " 下线 " + "<i>"
            + (new Date()).toLocaleTimeString() + "</i></div>");
            frame.scrollTo(0,frame.document.body.scrollHeight);
        }else{
            frame.document.body.innerHTML += ("<div style='color: #0B8CD4'>System: " + values[1] + " 上线 " + "<i>"
            + (new Date()).toLocaleTimeString() + "</i></div>");
            frame.scrollTo(0,frame.document.body.scrollHeight);
        }
    },
    _unParseUserChatData:function(string){
        var values = string.split("*");
        var value = values[1].split("#");
        var frame = window.frames["userMessagesBox"];
        frame.document.body.innerHTML += (values[0] + ": " + value[0] + " " + "<i style='color: #0000cc'>"
        + value[1] + "</i><br>");
        frame.scrollTo(0,frame.document.body.scrollHeight);
    },
    _createComponent:function(string){
        var value = string.split("#");
        var parentProcess = reg.getComponentByName(value[1]);
        /*var comp = new Component({type:value[3]});*/
        var comp;
        if(parentProcess == os.mainProcess){
            comp = new Component({type:value[3],mainType:value[3]});
        }else{
            comp = new Component({type:value[3],mainType:parentProcess.parentComponent.mainType});
        }
        nameIndexMap.set(value[3],parseInt(value[2]));
        comp.version = value[6];
        if(comp.nameField) new InplaceEditor({},comp.nameField);
        //圆角
        Rico.Corner.round(comp.node, {corners:"all", color: "transparent"});
        //将创建好的组件也注册为可移动的
        dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name, "activity", comp.id));

        reg.registry(comp);

        /*var comp = newComponent.getDroppedGUI();
         console.log(comp);*/
        var index = value[0] - 1;
        var htmlElement = parentProcess.children[index].node;
        /*var htmlElement = insertPlaceholder.node;*/
        /* //此处直接得到的并不是Dom节点，而是节点对应的包装对象
         var wrappedObj = draggableObjects[i].getDroppedGUI();
         //htmlElement和theGUI具有相同的parent,将htmlElement的parent指定给wrappedObj
         var parent = this.wrappedObj.parent;
         var moveOrCopy;
         //如果wrappedObj.parent存在，说明是move或者copy
         if (wrappedObj.parent) {
         moveOrCopy = true;
         }*/

        var theGUI = comp.node;

        if (RicoUtil.getElementsComputedStyle(theGUI, "position") == "absolute"){
            theGUI.style.position = "static";
            theGUI.style.top = "";
            theGUI.style.top = "";
        }
        /*var isMove = false;
         if (dndManager.moveStyle == "move" && moveOrCopy) {
         wrappedObj.parent.removeChild(wrappedObj);
         isMove = true;
         }*/
        //Sequence的addChild方法会判断前一个占位符的类型，所以必须等新创建的节点被加入到Dom中后才能使用它
        dojo.place(theGUI, htmlElement, "after");
        parentProcess.addChild(comp,ControlUtil.prototype.ComponentNetCreateMode,null);
        comp.generateTreeNode(false);
        parentProcess.validate();
        if(parentProcess != process)
            YD.setStyle(parentProcess.node,"display","none");
        else
            YD.setStyle(parentProcess.node,"display","block");
    },
    _createProcess:function(string){
        var value = string.split("#");
        var comp = reg.getComponentByName(value[0]);
        nameIndexMap.set("Process",parseInt(value[1]));
        comp.subProcess = new Sequence.Process({
            type:"Process",
            refNode: $("maincontent"),
            pos: "last",
            parentComponent:comp
        });
        /*comp.subProcess.hideBorder();*/
        reg.registry(comp.subProcess);
        YD.setStyle(comp.subProcess.node,"display","none");
        comp.subProcess.generateTreeNode(false);//树
    },
    _createOS:function(){
        os = new OS({refNode:$("maincontent")});
        mainFrame.createProject();
        os.freshen();
    },
    _createControlFlow:function(string){
        var value = string.split("#");
        var parentProcess = reg.getComponentByName(value[1]);
        var index = value[0];
        var controlFlow = new ControlFlow();
        controlFlow.parent = parentProcess;
        var theGUI = controlFlow.node;
        var ph = parentProcess.children[index];
        var htmlElement = ph.node;
        dojo.place(theGUI,htmlElement, "after");
        parentProcess.addControlFlow(ph,controlFlow);
        parentProcess.validate();
    },
    _createBusConnect:function(string){
        var value = string.split("#");
        var comp = reg.getComponentByName(value[0]);
        var busConnect = new BusConnect();
        busConnect.parent = comp;
        var theGUI = busConnect.node;
        dojo.place(theGUI, comp.componentNode, "after");
        comp.addBusConnect(busConnect);
    }
});