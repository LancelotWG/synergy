/**
 * @author LancelotWG
 * 总线类
 */

dojo.declare("Bus",NamedNode,{
    /*selectBackgroundColor:"#3399FF",*/
    freshBackgroundColor:ColorUtil.prototype.colorWhite,
    configuredBusColor:ColorUtil.prototype.colorLightGreen,
    notConfigureBusColor:ColorUtil.prototype.colorGray,
    textColor:ColorUtil.prototype.colorBlack,
    selectColor:ControlUtil.prototype.selectColor,
    isConfigure:false,
    canvasNode:null,
    busEditorDataMultiSelect:null,
    dataEditorOperateStatus0:null,
    dataEditorOperateStatus1:null,
    dataEditorDataHandle:null,
    dataEditorOperateStatus0Handle:null,
    dataEditorOperateStatus1Handle:null,
    busEditorDataMultiSelectHandle:null,
    dataEditorOperateHandle:null,
    dataEditorApplyHandle:null,
    dialogHandle:null,
    defaultSize:40,
    width:0,
    src:"",
    uploader:null,
    dataEditorStatus:0,
    serverDataFlow:"",
    configureModel:0,
    isSelect:false,
    currentBusName:"",
    dataFlow:[
        /*{
            name:"TEST",
            data:[
                {id:"TEST_1_BUS",type:"SINT16"},
                {id:"TEST_2_BUS",type:"SINT16"},
                {id:"TEST_3_BUS",type:"SINT16"},
                {id:"TEST_4_BUS",type:"SINT16"},
                {id:"TEST_5_BUS",type:"SINT16"},
                {id:"TEST_6_BUS",type:"SINT16"},
                {id:"TEST_7_BUS",type:"SINT16"},
                {id:"TEST_8_BUS",type:"SINT16"},
                {id:"TEST_9_BUS",type:"SINT16"},
                {id:"TEST_10_BUS",type:"SINT16"},
                {id:"TEST_11_BUS",type:"SINT16"},
                {id:"TEST_12_BUS",type:"SINT16"},
                {id:"TEST_13_BUS",type:"SINT16"},
                {id:"TEST_14_BUS",type:"SINT16"},
                {id:"TEST_15_BUS",type:"SINT16"},
                {id:"TEST_16_BUS",type:"SINT16"},
                {id:"TEST_17_BUS",type:"SINT16"},
                {id:"TEST_18_BUS",type:"SINT16"},
                {id:"TEST_19_BUS",type:"SINT16"},
                {id:"TEST_20_BUS",type:"SINT16"},
                {id:"TEST_21_BUS",type:"SINT16"},
                {id:"TEST_22_BUS",type:"SINT16"},
                {id:"TEST_23_BUS",type:"SINT16"}
            ]
        }*/
    ]/*null*/,
    initDomNode: function(){
        this.node = dojo.create("div",{className:"Bus",style:{"width":this.defaultSize,"height":this.defaultSize/*,"float":"left"*/}},this.refNode,this.pos);
        this.canvasNode = dojo.create("canvas",{style:{"width":this.defaultSize,"height":this.defaultSize,"z-index": -1/*,"float":"left"*/}},this.node,"last");
    },
    _draw:function(){
        //总线外形
        var context = this.canvasNode.getContext('2d');
        context.save();
        context.beginPath();
        if(this.isConfigure){
            context.strokeStyle = this.configuredBusColor;
            context.fillStyle = this.configuredBusColor;
        }else{
            context.strokeStyle = this.notConfigureBusColor;
            context.fillStyle = this.notConfigureBusColor;
        }
        var saveColor = context.fillStyle;
        if(this.isSelect){
            context.fillStyle = this.selectColor;
        }else {
            context.fillStyle = saveColor;
        }
        context.lineWidth = 1;
        context.moveTo(0, 20);
        context.lineTo(40, 0);
        context.lineTo(40, 10);
        context.lineTo(this.width-40, 10);
        context.lineTo(this.width-40, 0);
        context.lineTo(this.width, 20);
        context.lineTo(this.width-40, 40);
        context.lineTo(this.width-40, 30);
        context.lineTo(40, 30);
        context.lineTo(40, 40);
        context.lineTo(0, 20);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
        //总线文字
        context.save();
        context.fillStyle = this.textColor;
        context.font="16px Arial";
        context.fillText("BUS",this.width/2-15,25);
        context.restore();
    },
    select:function(isSelect){
        this.isSelect = isSelect;
        this._clear();
        this._draw();
    },
    updateBus:function(width){
        this.width = width;
        /*this.node.width = width + "px";
        this.node.height = this.defaultSize + "px";*/
        Element.setStyle(this.node,{"width":width + "px","height":this.defaultSize + "px"});
        this.canvasNode.width = width;
        this.canvasNode.height = this.defaultSize;
        this._clear();
        this._draw();
    },
    _clear:function(){
        var context = this.canvasNode.getContext('2d');
        context.save();
        context.beginPath();
        context.fillStyle = this.freshBackgroundColor;
        context.fillRect(0,0,this.width,this.defaultSize);
        context.closePath();
        context.fill();
        context.restore();
    },
    _getBusVersion:function(){
        var parent = this;
        dojo.xhrGet({
            url: "user_loadBusVersion.xhtml?templateName=original",
            handleAs: "text",
            load: function (data) {
                parent._updateBusVersionMutiSelect(data);
            },
            error: function (e) {
                if (confirm("用户数据加载失败，是否重试？"))
                    bus._getBusVersion();
            }
        });
    },
    _updateBusVersionMutiSelect:function(data){
        var busVersions = data.split("*");
        var busVersionMutiSelect = dojo.byId('busConfigureMutiSelect');
        var length = busVersionMutiSelect.childNodes.length;
        for(var i = 0;i < length;i++){
            busVersionMutiSelect.removeChild(busVersionMutiSelect.childNodes[0]);
        }
        for(var i = 1;i < busVersions.length;i++){
            var option = window.document.createElement('option');
            option.innerHTML = busVersions[i];
            option.value = i - 1;
            if(i == 1){
                option.selected = true;
            }
            busVersionMutiSelect.appendChild(option);
        }
    },
    createUploader:function(){
        var parent = this;
        this.uploader = new qq.FineUploader({
            // Pass the HTML element here
            element: document.getElementById('busConfigurePath'),
            autoUpload: true,
            multiple: true,
            validation:{
                allowedExtensions:['cfg']
            },
            request: {
                endpoint: "user_uploadBusConfigure.xhtml?processName="+os.mainProcess.name
            },
            callbacks: {
                onComplete: function(id, fileName, responseJSON){
                    if(responseJSON.success){
                        var fileName = responseJSON.body;
                        dojo.xhrGet(
                            {
                            url:"user_loadBusContext.xhtml?model=temp&contextName="+fileName+"&processName="+os.mainProcess.name,
                            handleAs:"text",
                            load:function(data){
                                var value = data.split("*");
                                dojo.byId("busConfigureContent").innerText = value[0];
                                parent.serverDataFlow = value[1];
                            },
                            error:function(e){
                                alert(e.description);
                            }
                        });
                    }
                }
            },
            text: {
                uploadButton: '浏览'
            },
            debug: true
        });
        //禁止同时上传多个文件
        dojo.aspect.before(this.uploader,"_onInputChange",function(){
            parent.uploader.clearStoredFiles();
        });
        dojo.aspect.after(this.uploader,"_onInputChange",function(input){
            dijit.byId("busConfigureName").set("value",parent.uploader._parseFileName(input));
        },true);
    },
    configuring:function(){
        //总线配置代码
        var busConfigureDlg = dijit.byId("busConfigureDlg");
        busConfigureDlg.show();
        var parent = this;
        var createMultiSelect = function () {
            if(dijit.byId('busConfigureMutiSelect')) {
                parent._getBusVersion();
            }else{
                var busConfigureMutiSelect = dojo.byId('busConfigureMutiSelect');
                var myMultiSelect = new dijit.form.MultiSelect({ name: 'busConfigureMutiSelect',style:"width:205px;height:300px;float:left;" }, busConfigureMutiSelect);
                myMultiSelect.startup();
                parent._getBusVersion();
                myMultiSelect.setDisabled(true);
                var busConfigureModel0 = dijit.byId("busConfigureModel0");
                var busConfigureModel1 = dijit.byId("busConfigureModel1");
                dojo.connect(myMultiSelect,"onClick",parent,parent.selectOption);
                dojo.connect(busConfigureModel0,"onClick",parent,parent.changeModel);
                dojo.connect(busConfigureModel1,"onClick",parent,parent.changeModel);
                parent.createUploader();
            }
        };
        dojo.connect(busConfigureDlg, "onDownloadEnd", createMultiSelect);
        //总线配置代码
    },
    changeModel:function(event){
        switch(parseInt(event.target.value)){
            case 0:
                dijit.byId("busConfigureName").setDisabled(false);
                dijit.byId("busConfigureMutiSelect").setDisabled(true);
                this.uploader._button._element.show();
                dojo.byId("busConfigureContent").innerText = "";
                this.configureModel = 0;
                break;
            case 1:
                dijit.byId("busConfigureName").setDisabled(true);
                dijit.byId("busConfigureMutiSelect").setDisabled(false);
                this.uploader._button._element.hide();
                this._getBusConfigureContext((dijit.byId('busConfigureMutiSelect')).getSelected()[0].innerHTML);
                this.configureModel = 1;
                break;
        }
    },
    selectOption:function(event){
        if(event.currentTarget != event.target){
            var busConfigureVersion = (dijit.byId('busConfigureMutiSelect')).getSelected()[0].innerHTML;
            this._getBusConfigureContext(busConfigureVersion);
        }
    },
    deleteBus:function(){
        if(confirm("删除总线将会使已配置的数据交联失效，是否继续删除？")){
            this._deleteBusConnect();
            this.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);
            this.dataFlow = [];
            this.isConfigure = false;
            menuManager.busMenu.removeChild(0);
            menuManager.busMenu.removeChild(0);
            menuManager.initialLoadBusMenu();
            process.validate();
        }
    },
    _deleteBusConnect:function(){
        function select(comp){
            if(comp[1].busConnect){
                comp[1].busConnect.removeAllData();
                return true;
            }else{
                return false;
            }
        }
        reg._reg.filter(select);
    },
    _getBusConfigureContext:function(fileName){
        var parent = this;
        dojo.xhrGet({
            url: "user_loadBusContext.xhtml?model=template&templateName=original&contextName="+fileName,
            handleAs: "text",
            load: function (data) {
                var value = data.split("*");
                dojo.byId("busConfigureContent").innerText = value[0];
                parent.serverDataFlow = data;
            },
            error: function (e) {
                if (confirm("总线数据加载失败，是否重试？"))
                    bus.selectOption();
            }
        });
    },
    busVersionAbolish:function(){
        var busConfigureDlg = dijit.byId("busConfigureDlg");
        busConfigureDlg.hide();
        process.validate();
    },
    busVersionApply:function(){
        var busConfigureDlg = dijit.byId("busConfigureDlg");
        switch (this.configureModel){
            case 0:
                /*var form = dijit.byId("busConfigureUpload");
                form.validate();*/
                /*this.uploader.uploadStoredFiles();*/
                this._updateBusFlow();
                break;
            case 1:
                this._updateBusFlow();
                break;
        }
        if(this.dataFlow.length == 0){
            if(confirm("总线配为空！是否放弃配置？")){
                busConfigureDlg.hide();
                process.validate();
                return;
            }else{
                return;
            }
        }
        this.isConfigure = true;
        this.sendNetMsg(NetMsgUtil.prototype.msgChange,["dataFlow",this.dataFlow]);
        menuManager.busMenu.removeChild(0);
        menuManager.initialBusMenu();
        busConfigureDlg.hide();
        process.validate();
    },
    _updateBusFlow:function(){
        var dataFlows = this.serverDataFlow.split("*");
        for(var j = 1;j<dataFlows.length;j++){
            var values = dataFlows[j].split("#");
            var busName = values[0];
            for(var i = 1;i < values.length;i++){
                var value = values[i].split("&");
                this._addDataItem(busName,value[0],value[1]);
            }
        }
    },
    getDataItemByID:function(name,id){
        for(var i = 0;i < this.dataFlow.length;i++){
            if(this.dataFlow[i].name == name){
                for(var j = 0;j<this.dataFlow[i].data.length;j++){
                    if(this.dataFlow[i].data[j].id == id){
                        return this.dataFlow[i].data[j]
                    }
                }
            }
        }
        return null;
    },
    getDataItemTypeByID:function(name,id){
        var item = this.getDataItemByID(name,id);
        if(item){
            return item.type;
        }else{
            return null;
        }
    },
    getAllDataItemTypeByID:function(id){
        for(var i = 0;i < this.dataFlow.length;i++){
            for(var j = 0;j<this.dataFlow[i].data.length;j++){
                if(this.dataFlow[i].data[j].id == id){
                    return this.dataFlow[i].data[j].type;
                }
            }
        }
        return null;
    },
    dataEditorSelectOption:function(event){
        switch(parseInt(this.dataEditorStatus)){
            case 0:

                break;
            case 1:
                if(event.currentTarget != event.target){

                }else{
                    this.dataEditorClearSelect();
                }
                break;
        }

    },
    checkUniqueness:function(dataID){
        for(var i = 0;i < this.dataFlow.length;i++){
            var dataItem = this.dataFlow[i];
            for(var j = 0;j < dataItem.data.length;j++){
                if(dataItem.data[j].id == dataID){
                    return false;
                }
            }
        }
        return true;
    },
    dataEditorAction:function(){
        switch(parseInt(this.dataEditorStatus)){
            case 0:
                var busEditorDataID = dijit.byId('busEditorDataID');
                var busEditorDataType = dijit.byId('busEditorDataType');
                if(busEditorDataID.isValid() && busEditorDataType.isValid()){
                    var dataID = busEditorDataID.get("value");
                    var dataType = busEditorDataType.get("value");
                    if(this.checkUniqueness(dataID)){
                        this._addDataItem(this.currentBusName,dataID,dataType);
                        this.updateBusDataEditorDlg();
                    }else{
                        alert("数据ID名与本层或其他层数据ID重复");
                    }
                }else{
                    var error = "请";
                    if(!busEditorDataID.isValid()){
                        error = error + "填充数据ID"
                    }
                    if(!busEditorDataType.isValid()){
                        error = error + "指定数据类型"
                    }
                    error = error + "!";
                    alert(error);
                }
                break;
            case 1:
                var busEditorData = (dijit.byId("busEditorData")).get("value");
                for(var i = 0;i < busEditorData.length;i++){
                    var canDelete = true;
                    var children = process.children;
                    for(var j = 0;j < children.length;j++){
                        var child = children[j];
                        if(child instanceof Component){
                            if(child.isBusDataLinked(busEditorData[i])){
                                canDelete = false;
                                break;
                            }
                        }
                    }
                    if(!canDelete){
                        alert("无法删除已连入总线的数据项");
                        continue;
                    }
                    if(this._removeDataItem(this.currentBusName,busEditorData[i])){

                    }else{
                        alert("无法删除数据项");
                    }
                }
                this.updateBusDataEditorDlg();
                this.dataEditorClearSelect();
                break;
        }
    },
    dataEditorClearSelect:function(){
        var busEditorData = dojo.byId('busEditorData');
        for(var j = 0;j < busEditorData.childNodes.length;j++){
            busEditorData.childNodes[j].selected = false;
        }
    },
    dataEditorStatusChange:function(event){
        var button = dijit.byId("busEditorOperate");
        var busEditorDataID = dijit.byId('busEditorDataID');
        var busEditorDataType = dijit.byId('busEditorDataType');
        switch(parseInt(event.target.value)){
            case 0:
                this.dataEditorStatus = 0;
                button.setLabel("增加");
                busEditorDataID.setDisabled(false);
                busEditorDataType.setDisabled(false);
                break;
            case 1:
                this.dataEditorStatus = 1;
                button.setLabel("删除");
                busEditorDataID.setDisabled(true);
                busEditorDataType.setDisabled(true);
                break;
        }
    },
    updateBusDataEditorDlg:function(){
        var busEditorData = dojo.byId('busEditorData');
        var length = busEditorData.childNodes.length;
        for(var i = 0;i < length;i++){
            busEditorData.removeChild(busEditorData.childNodes[0]);
        }
        var busNameIndex = -1;
        var parentComponent = process.parentComponent;
        if(parentComponent){
            for(var j = 0;j < bus.dataFlow.length;j++){
                if(bus.dataFlow[j].name == parentComponent.type) {
                    busNameIndex = j;
                    break;
                }
            }
        }else{
            busNameIndex = 0;
        }
        if(busNameIndex == -1){

        }else{
            for(var j = 0;j < bus.dataFlow[busNameIndex].data.length;j++,i++){
                var option = window.document.createElement('option');
                option.innerHTML = bus.dataFlow[busNameIndex].data[j].id;
                option.value = bus.dataFlow[busNameIndex].data[j].id;
                var children = process.children;
                for(var i = 0;i < children.length;i++){
                    var child = children[i];
                    if(child instanceof Component){
                        if(child.isBusDataLinked(option.value)){
                            dojo.addClass(option,"cannotDelete");
                        }
                    }
                }
                if(j == 0) {
                    //option.selected = true;
                }
                busEditorData.appendChild(option);
            }
        }
    },
    busEditor:function(){
        var busDataEditorDlg = dijit.byId("busDataEditorDlg");
        busDataEditorDlg.show();
        var parentComponent = process.parentComponent;
        this.currentBusName = "";
        if(parentComponent){
            this.currentBusName = parentComponent.type;
        }else{
            this.currentBusName = "MAIN"
        }
        var createMultiSelect = function () {
            if(dijit.byId('busEditorData')) {
                this.dataEditorOperateStatus0 = dijit.byId("dataEditorOperateStatus0");
                this.dataEditorOperateStatus1 = dijit.byId("dataEditorOperateStatus1");
                this.busEditorDataMultiSelect = dijit.byId('busEditorData');
                this._connectDataEditorEvent();
                this.updateBusDataEditorDlg();
            }else{
                var busEditorDataSelect = dojo.byId('busEditorData');
                this.dataEditorOperateStatus0 = dijit.byId("dataEditorOperateStatus0");
                this.dataEditorOperateStatus1 = dijit.byId("dataEditorOperateStatus1");
                this.busEditorDataMultiSelect = new dijit.form.MultiSelect({ name: 'busEditorData',style:"width:150px;height:200px;float:left;" }, busEditorDataSelect);
                this.busEditorDataMultiSelect.startup();
                this._connectDataEditorEvent();
                this.updateBusDataEditorDlg();
            }
        };
        this.dialogHandle = dojo.connect(busDataEditorDlg, "onDownloadEnd",this,createMultiSelect);
    },
    _connectDataEditorEvent:function(){
        var busEditorOperate = dijit.byId("busEditorOperate");
        var busEditorApply = dijit.byId("busEditorApply");
        this.dataEditorOperateHandle = dojo.connect(busEditorOperate,"onClick",this,this.dataEditorAction);
        this.dataEditorApplyHandle = dojo.connect(busEditorApply,"onClick",this,this.dataEditorApply);
        this.dataEditorOperateStatus0Handle = dojo.connect(this.dataEditorOperateStatus0,"onClick",this,this.dataEditorStatusChange);
        this.dataEditorOperateStatus1Handle = dojo.connect(this.dataEditorOperateStatus1,"onClick",this,this.dataEditorStatusChange);
        this.busEditorDataMultiSelectHandle = dojo.connect(this.busEditorDataMultiSelect,"onClick",this,this.dataEditorSelectOption);
        this.dataEditorStatus = 0;
    },
    dataEditorApply:function(){
        var busDataEditorDlg = dijit.byId("busDataEditorDlg");
        busDataEditorDlg.hide();
        this._disconnectDataEditorEvent();
        this.sendNetMsg(NetMsgUtil.prototype.msgChange,["dataFlowItem",this.getDataItemName(this.currentBusName)]);
    },
    getDataItemName:function(busName){
        for(var i = 0;i < this.dataFlow.length;i++){
            if(this.dataFlow[i].name == busName){
                return this.dataFlow[i];
            }
        }
        return null;
    },
    setDataItemName:function(dataFlowItem){
        for(var i = 0;i < this.dataFlow.length;i++){
            if(this.dataFlow[i].name == dataFlowItem.name){
                this.dataFlow[i].data = [];
            }
        }
        for(var i = 0;i < dataFlowItem.data.length;i++){
            this._addDataItem(dataFlowItem.name,dataFlowItem.data[i].id,dataFlowItem.data[i].type);
        }
    },
    _disconnectDataEditorEvent:function(){
        dojo.disconnect(this.dataEditorOperateHandle);
        dojo.disconnect(this.dataEditorApplyHandle);
        dojo.disconnect(this.dataEditorOperateStatus0Handle);
        dojo.disconnect(this.dataEditorOperateStatus1Handle);
        dojo.disconnect(this.busEditorDataMultiSelectHandle);
        dojo.disconnect(this.dialogHandle);
    },
    _addDataItem:function(name,id,type){
        for(var i = 0;i < this.dataFlow.length;i++){
            if(this.dataFlow[i].name == name){
                this.dataFlow[i].data.push({id:id,type:type});
                return true;
            }
        }
        this.dataFlow.push(
            {
                name:name,
                data: [
                    {id:id,type:type}
                ]
            }
        );
        return false;
    },
    _removeDataItem:function(name,id){
        for(var i = 0;i < this.dataFlow.length;i++){
            if(this.dataFlow[i].name == name){
                for(var j = 0;j < this.dataFlow[i].data.length;j++){
                    if(this.dataFlow[i].data[j].id == id){
                        this.dataFlow[i].data.splice(j,1);
                        return true;
                    }
                }
            }
        }
        return false;
    },
    sendNetMsg:function(operate,additiveAttribute){
        switch (operate){
            case NetMsgUtil.prototype.msgNew:

                break;
            case NetMsgUtil.prototype.msgChange:
                var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,additiveAttribute);
                msg.msgSend();
                break;
            case NetMsgUtil.prototype.msgDelete:
                var msg = new NetMsg(NetMsgUtil.prototype.msgDelete,this,null);
                msg.msgSend();
                break;
        }
    }
});