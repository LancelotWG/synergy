/**
 * @author LancelotWG
 * 总线交联
 */
dojo.declare("BusConnect",UnNamedNode,{
    parent:null,
    defaultSize:42,
    src:"",
    inConfigure:false,
    busToModelID:0,
    modelToBusID:0,
    status:0,/*0:normal, 1:add, 2:delete*/
    selectedTemp:null,/*0:from, 1:to*/
    timer:null,
    busDataMultiSelect:null,
    modelDataFromMultiSelect:null,
    modelDataToMultiSelect:null,
    operateStatus0:null,
    operateStatus1:null,
    operateStatus2:null,
    busDataMultiSelectHandle:null,
    modelDataFromMultiSelectHandle:null,
    modelDataToMultiSelectHandle:null,
    operateButtonHandle:null,
    operateStatus0Handle:null,
    operateStatus1Handle:null,
    operateStatus2Handle:null,
    applyButtonHandle:null,
    abolishButtonHandle:null,
    dialogHandle:null,
    dataFlow:null,
    oldDataFlow:null,
    isAllDelete:false,
    busLink:null,
    initDomNode: function(){
        this.dataFlow = {busToModel:[], modelToBus:[]};
        this.oldDataFlow = {busToModel:[], modelToBus:[]};
        this.selectedTemp = [];
        this.node = dojo.create("div",{className:"BusConnect",style:{"width":this.defaultSize+"px","height":this.defaultSize+"px"}},this.refNode,this.pos);
        /*if(Hlayout){*/
        this.isAllDelete = false;
        src = contextPath+"/resource/image/icons/BusConnect.png";
        /*}else{
         src = contextPath+"/resource/image/icons/VArrow.png";
         }*/
        dojo.create("img",{src:src},this.node,"first");
    },/*,
     changeLayout: function(){
     if(Hlayout){
     src = contextPath+"/resource/image/icons/HArrow.png";
     this.node.firstChild.src = src;
     }else{
     src = contextPath+"/resource/image/icons/VArrow.png";
     this.node.firstChild.src = src;
     }
     }*/
    /*,
     getWidth: function(){
     return 18;
     },
     getHeight: function(){
     return 18;
     }	*/
    calculateLinkPoint:function(/*0:Bus,1:Model*/type,option){
        var point = [0,0];
        var parentNode = option.parentNode;
        var parentPoint = YD.getXY(parentNode);
        var myPoint = YD.getXY(option);
        var Height = option.offsetHeight;
        var width = parentNode.offsetWidth;
        if(type){
            point[0] = myPoint[0];
        }else{
            point[0] = myPoint[0] + width;
        }

        point[1] = myPoint[1] + Height/2;
        if(point[1] <= parentPoint[1] + Height/2){
            point[1] = parentPoint[1] + Height/2;
        }
        if(point[1] >= parentPoint[1] + parentNode.offsetHeight - Height/2){
            point[1] = parentPoint[1] + parentNode.offsetHeight - Height/2;
        }
        return point;
    },
    drawBusConnect:function(){
        for(var i = 0;i < this.dataFlow.busToModel.length;i++){
            var data = this.dataFlow.busToModel[i];
            var busIndex = data.index.bus;
            var modelIndex = data.index.model;
            var busOption = dojo.byId('busConnectBusData').childNodes[busIndex];
            var modelOption = dojo.byId('busConnectModelDataFrom').childNodes[modelIndex];
            var bus = this.calculateLinkPoint(0,busOption);
            var model = this.calculateLinkPoint(1,modelOption);
            this.drawLink(bus,model,busOption.selected||modelOption.selected);
        }
        for(var i = 0;i < this.dataFlow.modelToBus.length;i++){
            var data = this.dataFlow.modelToBus[i];
            var busIndex = data.index.bus;
            var modelIndex = data.index.model;
            var busOption = dojo.byId('busConnectBusData').childNodes[busIndex];
            var modelOption = dojo.byId('busConnectModelDataTo').childNodes[modelIndex];
            var model = this.calculateLinkPoint(1,modelOption);
            var bus = this.calculateLinkPoint(0,busOption);
            this.drawLink(model,bus,busOption.selected||modelOption.selected);
        }
    },
    drawLink:function(from,to,select){
        var can = document.getElementById('busConnectLink');
        var parentPoint = YD.getXY(can);
        from[0] -= parentPoint[0];
        from[1] -= parentPoint[1];
        to[0] -= parentPoint[0];
        to[1] -= parentPoint[1];
        var k1 = 1/5;
        var k2 = 1/7;
        var p1 = {x:from[0],y:from[1]};
        var p2 = {x:to[0],y:to[1]};
        var p3 = {x:k1*p1.x + (1-k1)*p2.x,y:k2*p2.y + (1-k2)*p1.y};
        var p4 = {x:k1*p2.x + (1-k1)*p1.x,y:k2*p1.y + (1-k2)*p2.y};
        if(can.getContext){
            var cxt = can.getContext('2d');
            cxt.save();
            if(p1.x < p2.x){
                if(select){
                    cxt.strokeStyle = "rgba(0,0,255,1)";
                    cxt.fillStyle = "rgba(0,0,255,1)";
                    cxt.lineWidth = 3;
                }else{
                    cxt.strokeStyle = "rgba(0,0,200,1)";
                    cxt.fillStyle = "rgba(0,0,200,1)";
                    cxt.lineWidth = 1;
                }
                var rad = Math.atan((p1.y - p3.y)/(p3.x - p1.x)) - Math.PI;
                this.drawArrows(cxt,p2,rad);
            }else{
                if(select){
                    cxt.strokeStyle = "rgba(0,255,0,1)";
                    cxt.fillStyle = "rgba(0,255,0,1)";
                    cxt.lineWidth = 3;
                }else{
                    cxt.strokeStyle = "rgba(0,200,0,1)";
                    cxt.fillStyle = "rgba(0,200,0,1)";
                    cxt.lineWidth = 1;
                }
                var rad = Math.atan((p2.y - p4.y)/(p4.x - p2.x));
                this.drawArrows(cxt,p2,rad);
            }
            cxt.beginPath();
            //绘制3次贝塞尔曲线
            cxt.moveTo(p1.x,p1.y);
            cxt.bezierCurveTo(p3.x,p3.y,p4.x,p4.y,p2.x,p2.y);
            cxt.stroke();
            cxt.restore();
        }
    },
    drawArrows:function(cxt,point,rad){
        var size = [15,4];
        var cosRad = Math.cos(rad);
        var sinRad = Math.sin(rad);
        var p1 = point;
        var center = {x:p1.x + size[0]*cosRad,y:p1.y - size[0]*sinRad};
        var p2 = {x:center.x + size[1]*sinRad,y:center.y + size[1]*cosRad};
        var p3 = {x:center.x - size[1]*sinRad,y:center.y - size[1]*cosRad};
        cxt.beginPath();
        cxt.moveTo(p1.x,p1.y);
        cxt.lineTo(p2.x,p2.y);
        cxt.lineTo(p3.x,p3.y);
        cxt.lineTo(p1.x,p1.y);
        cxt.closePath();
        cxt.fill();
        cxt.stroke();
    },
    clear:function(){
        var can = document.getElementById('busConnectLink');
        var cxt = can.getContext('2d');
        cxt.clearRect(0,0,100,200);
        /*cxt.save();
        cxt.beginPath();
        cxt.fillStyle = "rgba(255,255,255,1)";
        cxt.fillRect(0,0,100,200);
        cxt.closePath();
        cxt.fill();
        cxt.restore();*/
    },
    selectOption:function(event){
        if(event.currentTarget != event.target){
            var busDataSelect = dojo.byId('busConnectBusData');
            var modelDataFromSelect = dojo.byId('busConnectModelDataFrom');
            var modelDataToSelect = dojo.byId('busConnectModelDataTo');
            var button = dijit.byId("busConnectOperate");
            switch(parseInt(this.status)){
                case 0:
                    if(event.currentTarget == busDataSelect){
                        this._clearSelect(false,true,true);
                        var index = event.target.value;
                        for(var i = 0;i < this.dataFlow.busToModel.length;i++){
                            var data = this.dataFlow.busToModel[i];
                            var busIndex = data.index.bus;
                            if(busIndex == index){
                                modelDataFromSelect.childNodes[data.index.model].selected = true;
                            }
                        }
                        for(var i = 0;i < this.dataFlow.modelToBus.length;i++){
                            var data = this.dataFlow.modelToBus[i];
                            var busIndex = data.index.bus;
                            if(busIndex == index){
                                modelDataToSelect.childNodes[data.index.model].selected = true;
                            }
                        }
                    }else{
                        this._clearSelect(true,false,false);
                        var index = event.target.value;
                        if(event.currentTarget == modelDataFromSelect){
                            this._clearSelect(false,false,true);
                            for(var i = 0;i < this.dataFlow.busToModel.length;i++){
                                var data = this.dataFlow.busToModel[i];
                                var modelIndex = data.index.model;
                                if(modelIndex == index){
                                    busDataSelect.childNodes[data.index.bus].selected = true;
                                }
                            }
                        }else{
                            this._clearSelect(false,true,false);
                            for(var i = 0;i < this.dataFlow.modelToBus.length;i++){
                                var data = this.dataFlow.modelToBus[i];
                                var modelIndex = data.index.model;
                                if(modelIndex == index){
                                    busDataSelect.childNodes[data.index.bus].selected = true;
                                }
                            }
                        }
                    }
                    break;
                case 1:
                    var jump = false;
                    if(event.currentTarget == busDataSelect){
                        for(var i = 0;i < this.selectedTemp.length;i++){
                            if(this.selectedTemp[i].parentNode == busDataSelect){
                                this.selectedTemp[i] = event.target;
                                jump = true;
                                for(var j = 0;j < this.selectedTemp.length;j++){
                                    if(this.selectedTemp[j].parentNode == modelDataFromSelect){
                                        this._clearSelect(false,false,true);
                                    }else if(this.selectedTemp[j].parentNode == modelDataToSelect){
                                        this._clearSelect(false,true,false);
                                    }
                                }
                                break;
                            }
                        }
                        if(!jump){
                            this.selectedTemp.push(event.target);
                            for(var j = 0;j < this.selectedTemp.length;j++){
                                if(this.selectedTemp[j].parentNode == modelDataFromSelect){
                                    this._clearSelect(false,false,true);
                                    break;
                                }else if(this.selectedTemp[j].parentNode == modelDataToSelect){
                                    this._clearSelect(false,true,false);
                                    break;
                                }
                            }
                        }
                    }else if(event.currentTarget == modelDataFromSelect){
                        for(var i = 0;i < this.selectedTemp.length;i++){
                            if(this.selectedTemp[i].parentNode == modelDataFromSelect || this.selectedTemp[i].parentNode == modelDataToSelect){
                                this.selectedTemp[i] = event.target;
                                jump = true;
                                this._clearSelect(false,false,true);
                                break;
                            }
                        }
                        if(!jump){
                            this.selectedTemp.push(event.target);
                            this._clearSelect(false,false,true);
                        }
                    }else if(event.currentTarget == modelDataToSelect){
                        for(var i = 0;i < this.selectedTemp.length;i++){
                            if(this.selectedTemp[i].parentNode == modelDataToSelect || this.selectedTemp[i].parentNode == modelDataFromSelect){
                                this.selectedTemp[i] = event.target;
                                jump = true;
                                this._clearSelect(false,true,false);
                                break;
                            }
                        }
                        if(!jump){
                            this.selectedTemp.push(event.target);
                            this._clearSelect(false,true,false);
                        }
                    }
                    if(this.selectedTemp.length == 2){
                        if(this._checkDataType()){
                            button.setDisabled(false);
                        }else{
                            alert("总线与模块数据类型不匹配！");
                        }
                    }else{
                        button.setDisabled(true);
                    }
                    break;
                case 2:
                    var jump = false;
                    if(event.currentTarget == busDataSelect){
                        for(var i = 0;i < this.selectedTemp.length;i++){
                            if(this.selectedTemp[i].parentNode == busDataSelect){
                                this.selectedTemp[i] = event.target;
                                jump = true;
                                for(var j = 0;j < this.selectedTemp.length;j++){
                                    if(this.selectedTemp[j].parentNode == modelDataFromSelect){
                                        this._clearSelect(false,false,true);
                                    }else if(this.selectedTemp[j].parentNode == modelDataToSelect){
                                        this._clearSelect(false,true,false);
                                    }
                                }
                                break;
                            }
                        }
                        if(!jump){
                            this.selectedTemp.push(event.target);
                            for(var j = 0;j < this.selectedTemp.length;j++){
                                if(this.selectedTemp[j].parentNode == modelDataFromSelect){
                                    this._clearSelect(false,false,true);
                                    break;
                                }else if(this.selectedTemp[j].parentNode == modelDataToSelect){
                                    this._clearSelect(false,true,false);
                                    break;
                                }
                            }
                        }
                    }else if(event.currentTarget == modelDataFromSelect){
                        for(var i = 0;i < this.selectedTemp.length;i++){
                            if(this.selectedTemp[i].parentNode == modelDataFromSelect || this.selectedTemp[i].parentNode == modelDataToSelect){
                                this.selectedTemp[i] = event.target;
                                jump = true;
                                this._clearSelect(false,false,true);
                                break;
                            }
                        }
                        if(!jump){
                            this.selectedTemp.push(event.target);
                            this._clearSelect(false,false,true);
                        }
                    }else if(event.currentTarget == modelDataToSelect){
                        for(var i = 0;i < this.selectedTemp.length;i++){
                            if(this.selectedTemp[i].parentNode == modelDataToSelect || this.selectedTemp[i].parentNode == modelDataFromSelect){
                                this.selectedTemp[i] = event.target;
                                jump = true;
                                this._clearSelect(false,true,false);
                                break;
                            }
                        }
                        if(!jump){
                            this.selectedTemp.push(event.target);
                            this._clearSelect(false,true,false);
                        }
                    }
                    if(this.getLinkID() != null){
                        button.setDisabled(false);
                    }else{
                        button.setDisabled(true);
                    }
                    break;

            }
        }else{
            this._clearSelect(true,true,true);
        }
    },

    _checkDataType:function(){
        var type = 0;
        var temp = [];
        var busDataSelect = dojo.byId('busConnectBusData');
        var modelDataFromSelect = dojo.byId('busConnectModelDataFrom');
        var modelDataToSelect = dojo.byId('busConnectModelDataTo');
        if(this.selectedTemp[0].parentNode == modelDataToSelect){
            type = 1;
            temp.push(this.parent.getDataItemTypeByID(1,this.selectedTemp[0].label));
        }
        if(this.selectedTemp[1].parentNode == modelDataToSelect){
            type = 1;
            temp.push(this.parent.getDataItemTypeByID(1,this.selectedTemp[1].label));
        }
        if(this.selectedTemp[0].parentNode == busDataSelect){
            /*var parentComponent = this.parent.parent.parentComponent;
            if(parentComponent){
                var item = bus.getDataItemTypeByID(parentComponent.type,this.selectedTemp[0].label);
                if(item){
                    temp.push(item);
                }else{
                    if(parentComponent.parent == os.mainProcess){
                        temp.push(bus.getDataItemTypeByID("MAIN",this.selectedTemp[0].label));
                    }else{
                        temp.push(bus.getDataItemTypeByID(parentComponent.parent.parentComponent.type,this.selectedTemp[0].label));
                    }
                }
            }else{
                temp.push(bus.getDataItemTypeByID("MAIN",this.selectedTemp[0].label));
            }*/
            temp.push(bus.getAllDataItemTypeByID(this.selectedTemp[0].label));
        }
        if(this.selectedTemp[1].parentNode == busDataSelect){
            /*var parentComponent = this.parent.parent.parentComponent;
            if(parentComponent){
                var item = bus.getDataItemTypeByID(parentComponent.type,this.selectedTemp[1].label);
                if(item){
                    temp.push(item);
                }else{
                    if(parentComponent.parent == os.mainProcess){
                        temp.push(bus.getDataItemTypeByID("MAIN",this.selectedTemp[1].label));
                    }else{
                        temp.push(bus.getDataItemTypeByID(parentComponent.parent.parentComponent.type,this.selectedTemp[1].label));
                    }
                }
            }else{
                temp.push(bus.getDataItemTypeByID("MAIN",this.selectedTemp[1].label));
            }*/
            temp.push(bus.getAllDataItemTypeByID(this.selectedTemp[1].label));
        }
        if(type == 0) {
            if (this.selectedTemp[0].parentNode == modelDataFromSelect) {
                temp.push(this.parent.getDataItemTypeByID(0,this.selectedTemp[0].label));
            }
            if (this.selectedTemp[1].parentNode == modelDataFromSelect) {
                temp.push(this.parent.getDataItemTypeByID(0,this.selectedTemp[1].label));
            }
        }
        if(temp[0] == temp[1]){
            return true;
        }else{
            return false;
        }
    },
    getLinkID:function(){
        var busDataSelect = dojo.byId('busConnectBusData');
        var modelDataFromSelect = dojo.byId('busConnectModelDataFrom');
        var modelDataToSelect = dojo.byId('busConnectModelDataTo');
        var temp = [];
        var type = 0;
        if(this.selectedTemp.length == 2){
            if(this.selectedTemp[0].parentNode == modelDataToSelect){
                type = 1;
                temp.push({data:this.selectedTemp[0].label,index:parseInt(this.selectedTemp[0].value)});
            }
            if(this.selectedTemp[1].parentNode == modelDataToSelect){
                type = 1;
                temp.push({data:this.selectedTemp[1].label,index:parseInt(this.selectedTemp[1].value)});
            }
            if(this.selectedTemp[0].parentNode == busDataSelect){
                temp.push({data:this.selectedTemp[0].label,index:parseInt(this.selectedTemp[0].value)});
            }
            if(this.selectedTemp[1].parentNode == busDataSelect){
                temp.push({data:this.selectedTemp[1].label,index:parseInt(this.selectedTemp[1].value)});
            }
            if(type == 0){
                if(this.selectedTemp[0].parentNode == modelDataFromSelect){
                    temp.push({data:this.selectedTemp[0].label,index:parseInt(this.selectedTemp[0].value)});
                }
                if(this.selectedTemp[1].parentNode == modelDataFromSelect){
                    temp.push({data:this.selectedTemp[1].label,index:parseInt(this.selectedTemp[1].value)});
                }
            }
            if(type == 0){
                for(var i = 0;i < this.dataFlow.busToModel.length;i++){
                    var item =  this.dataFlow.busToModel[i];
                    if(item.index.bus == temp[0].index && item.index.model == temp[1].index){
                        return [0,item.id,i];
                    }
                }
            }else{
                for(var i = 0;i < this.dataFlow.modelToBus.length;i++){
                    var item =  this.dataFlow.modelToBus[i];
                    if(item.index.model == temp[0].index && item.index.bus == temp[1].index){
                        return [1,item.id,i];
                    }
                }
            }
            return null;
        }else{
            return null;
        }
    },

    action:function(){
        var busDataSelect = dojo.byId('busConnectBusData');
        var modelDataFromSelect = dojo.byId('busConnectModelDataFrom');
        var modelDataToSelect = dojo.byId('busConnectModelDataTo');
        var button = dijit.byId("busConnectOperate");
        var temp = [];
        var type = 0;/*0:busToModel, 1:modelToBus*/
        switch(parseInt(this.status)){
            case 0:
                //retain
                break;
            case 1:
                if(this.selectedTemp[0].parentNode == modelDataToSelect){
                    type = 1;
                    temp.push({data:this.selectedTemp[0].label,index:parseInt(this.selectedTemp[0].value)});
                }
                if(this.selectedTemp[1].parentNode == modelDataToSelect){
                    type = 1;
                    temp.push({data:this.selectedTemp[1].label,index:parseInt(this.selectedTemp[1].value)});
                }
                if(this.selectedTemp[0].parentNode == busDataSelect){
                    temp.push({data:this.selectedTemp[0].label,index:parseInt(this.selectedTemp[0].value)});
                }
                if(this.selectedTemp[1].parentNode == busDataSelect){
                    temp.push({data:this.selectedTemp[1].label,index:parseInt(this.selectedTemp[1].value)});
                }
                if(type == 0){
                    if(this.selectedTemp[0].parentNode == modelDataFromSelect){
                        temp.push({data:this.selectedTemp[0].label,index:parseInt(this.selectedTemp[0].value)});
                    }
                    if(this.selectedTemp[1].parentNode == modelDataFromSelect){
                        temp.push({data:this.selectedTemp[1].label,index:parseInt(this.selectedTemp[1].value)});
                    }
                }
                if(this.getLinkID() == null){
                    if(type == 0){
                        this.dataFlow.busToModel.push({id:this.busToModelID,data:{bus:temp[0].data,model:temp[1].data},index:{bus:temp[0].index,model:temp[1].index}});
                        this.busToModelID++;
                    }else{
                        this.dataFlow.modelToBus.push({id:this.modelToBusID,data:{bus:temp[1].data,model:temp[0].data},index:{bus:temp[1].index,model:temp[0].index}});
                        this.modelToBusID++;
                    }
                }else{
                    alert("请勿建立重复的连接！");
                    return;
                }
                this.selectedTemp = [];
                button.setDisabled(true);
                //clearSelect(true,true,true);
                break;
            case 2:
                var deleteLink = this.getLinkID();
                if(deleteLink[0] == 0){
                    this.dataFlow.busToModel.splice(deleteLink[2],1);
                }else{
                    this.dataFlow.modelToBus.splice(deleteLink[2],1);
                }
                this.selectedTemp = [];
                button.setDisabled(true);
                if(this.dataFlow.busToModel.length == 0&&this.dataFlow.modelToBus.length == 0){
                    this.isAllDelete = true;
                }
                break;
        }
    },
    changeStatus:function(event){
        var button = dijit.byId("busConnectOperate");
        switch(parseInt(event.target.value)){
            case 0:
                this.status = 0;
                button.setLabel("操作");
                button.setDisabled(true);
                this.selectedTemp = [];
                this._clearSelect(true,true,true);
                break;
            case 1:
                this.status = 1;
                button.setLabel("增加");
                button.setDisabled(true);
                this.selectedTemp = [];
                this._clearSelect(true,true,true);
                break;
            case 2:
                this.status = 2;
                button.setLabel("删除");
                button.setDisabled(true);
                this.selectedTemp = [];
                this._clearSelect(true,true,true);
                break;
        }

    },
    _clearSelect:function(bus,modelDataFrom,modelDataTo){
        var busDataSelect = dojo.byId('busConnectBusData');
        var modelDataFromSelect = dojo.byId('busConnectModelDataFrom');
        var modelDataToSelect = dojo.byId('busConnectModelDataTo');
        if(bus){
            for(var j = 0;j < busDataSelect.childNodes.length;j++){
                busDataSelect.childNodes[j].selected = false;
            }
        }
        if(modelDataFrom){
            for(var j = 0;j < modelDataFromSelect.childNodes.length;j++){
                modelDataFromSelect.childNodes[j].selected = false;
            }
        }
        if(modelDataTo){
            for(var j = 0;j < modelDataToSelect.childNodes.length;j++){
                modelDataToSelect.childNodes[j].selected = false;
            }
        }
    },
    checkUniqueness:function(temp){

    },
    sendNetMsg:function(operate,additiveAttribute){
        switch (operate){
            case NetMsgUtil.prototype.msgNew:
                var msg = new NetMsg(NetMsgUtil.prototype.msgNew,this,null);
                msg.msgSend();
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
    },
   /* _getParentComponentDataFlow:function(){
        var temp = [];
        if(this.parent.parent.parentComponent == null){
            return temp;
        }
        var busConnect = this.parent.parent.parentComponent.busConnect;

        if(busConnect == null){
            return temp;
        }else{
            busConnect.checkDataFlowEffective();
        }
        var dataFlows = busConnect.dataFlow;
        var busToModel = dataFlows.busToModel;
        var modelToBus = dataFlows.modelToBus;
        for(var i = 0;i<busToModel.length;i++){
            temp.push(busToModel[i].data.bus);
        }
        for(var i = 0;i<modelToBus.length;i++){
            temp.push(modelToBus[i].data.bus);
        }
        return temp;
    },*/
    findDataLink:function(type/*0:Bus数据,1:model数据*/,/*排除自己Bus*/data,pComponent,/*排除自己Component*/cComponent,/*0:busToModel,1:modelToBus*/modelDataType){
        var component = this.parent;
        var parentProcess = component.parent;
        var parentComponent = parentProcess.parentComponent;
        var link = [];
        switch (type){
            case 0:
                var busType = 0;
                parentProcess.setNewParentComponentDataFlow();
                var externalData = parentProcess.getParentComponentDataFlow();
                for(var i = 0;i < externalData.length;i++ ){
                    if(data == externalData[i]){
                        busType = 1;
                        break;
                    }
                }
                switch (busType){
                    case 1:
                        var parentBusConnect = parentComponent.busConnect;
                        if(parentBusConnect){
                            var dataFlow = parentBusConnect.dataFlow;
                            for(var j = 0;j < dataFlow.busToModel.length;j++){
                                if(dataFlow.busToModel[j].data.bus == data){
                                    link.push({modelType:parentComponent.type,modelName:parentComponent.name,dataID:dataFlow.busToModel[j].data.model,direction:"busToModel"});
                                }
                            }
                            for(var j = 0;j < dataFlow.modelToBus.length;j++){
                                if(dataFlow.modelToBus[j].data.bus == data){
                                    link.push({modelType:parentComponent.type,modelName:parentComponent.name,dataID:dataFlow.modelToBus[j].data.model,direction:"modelToBus"});
                                }
                            }
                            var concat = parentBusConnect.findDataLink(0,data,component,parentComponent,null);
                            link = link.concat(concat);
                        }
                    case 0:
                        if(busType == 0){
                            for(var j = 0;j < parentProcess.children.length;j++){
                                if(component == parentProcess.children[j]){
                                    continue;
                                }
                                if(parentProcess.children[j].busConnect){
                                    var concat = parentProcess.children[j].busConnect._findDownDataLink(data);
                                    link = link.concat(concat);
                                }
                            }
                        }
                        var dataFlow = this.dataFlow;
                        for(var j = 0;j < dataFlow.busToModel.length;j++){
                            if(component == cComponent){
                                break;
                            }
                            if(dataFlow.busToModel[j].data.bus == data){
                                link.push({modelType:component.type,modelName:component.name,dataID:dataFlow.busToModel[j].data.model,direction:"busToModel"});
                            }
                        }
                        for(var j = 0;j < dataFlow.modelToBus.length;j++){
                            if(component == cComponent){
                                break;
                            }
                            if(dataFlow.modelToBus[j].data.bus == data){
                                link.push({modelType:component.type,modelName:component.name,dataID:dataFlow.modelToBus[j].data.model,direction:"modelToBus"});
                            }
                        }

                        var subProcess = component.subProcess;
                        if(subProcess){
                            for(var i = 0;i<subProcess.children.length;i++){
                                if(subProcess.children[i] == pComponent){
                                    continue;
                                }
                                if(subProcess.children[i].busConnect){
                                    var concat = subProcess.children[i].busConnect._findDownDataLink(data);
                                    link = link.concat(concat);
                                }

                            }
                        }
                        break;
                }
                return link;
                break;
            case 1:
                var dataFlow = this.dataFlow;
                switch (modelDataType){
                    case 0:
                        for(var j = 0;j < dataFlow.busToModel.length;j++){
                            if(dataFlow.busToModel[j].data.model == data){
                                link.push({modelType:"Bus",modelName:"Bus",dataID:dataFlow.busToModel[j].data.bus,direction:"busToModel"});
                                var concat = this.findDataLink(0,dataFlow.busToModel[j].data.bus,null,null,null);
                                link = link.concat(concat);
                            }
                        }
                        break;
                    case 1:
                        for(var j = 0;j < dataFlow.modelToBus.length;j++){
                            if(dataFlow.modelToBus[j].data.model == data){
                                link.push({modelType:"Bus",modelName:"Bus",dataID:dataFlow.modelToBus[j].data.bus,direction:"modelToBus"});
                                var concat = this.findDataLink(0,dataFlow.modelToBus[j].data.bus,null,null,null);
                                link = link.concat(concat);
                            }
                        }
                        break;
                }
                return link;
                break;
        }
        return link;
    },
    _findDownDataLink:function(data){
        var link = [];
        var component = this.parent;
        var dataFlow = this.dataFlow;
        for(var j = 0;j < dataFlow.busToModel.length;j++){
            if(dataFlow.busToModel[j].data.bus == data){
                link.push({modelType:component.type,modelName:component.name,dataID:dataFlow.busToModel[j].data.model,direction:"busToModel"});
            }
        }
        for(var j = 0;j < dataFlow.modelToBus.length;j++){
            if(dataFlow.modelToBus[j].data.bus == data){
                link.push({modelType:component.type,modelName:component.name,dataID:dataFlow.modelToBus[j].data.model,direction:"modelToBus"});
            }
        }
        var subProcess = component.subProcess;
        if(subProcess){
            for(var i = 0;i<subProcess.children.length;i++){
                if(subProcess.children[i].busConnect){
                    var concat = subProcess.children[i].busConnect._findDownDataLink(data);
                    link = link.concat(concat);
                }
            }
        }
        return link;
    },
    _addToolTip:function(option,dataType,type/*0:Bus数据,1:model数据*/,modelDataType){
        var parent = this;
        /*var onShow = function(){
            parent.busLink.createBusLink();
        };
        var onHide = function(){

        };
        var showTooltip = function(e) {
            var msg = "数据ID：" + option.innerHTML + " | " + "数据类型：" + dataType  + "</br>";
            var link = parent.findDataLink(type,option.innerHTML,null,null,modelDataType);
            var size = parent.busLink.calculateCanvasSize(parent.busLink.myData.children);
            msg += "<div style='width:" + size[0] + "px;height:" + size[1] + "px'><canvas id='busLinkCanvas' ></canvas></div>";
            parent.tooltip = new dijit.Tooltip(msg,e.target);
            dojo.connect(parent.tooltip, "onShow", onShow);
            dojo.connect(parent.tooltip, "onHide", onHide);
        };
        var hideTooltip = function(e) {
            parent.tooltip.destroy();
        };
        dojo.connect(option, "mouseover", showTooltip);
        dojo.connect(option, "mouseout", hideTooltip);*/

        var showTooltip = function(e) {
            var msg = "数据ID：" + option.innerHTML + " | " + "数据类型：" + dataType  + "</br>";
            var link = parent.findDataLink(type,option.innerHTML,null,null,modelDataType);
            if(link.length == 0){
                dijit.showTooltip(msg, e.target);
            }else{
                switch (type){
                    case 0:
                        var busLink = new BusLink(link,option.innerHTML,parent.parent.name);
                        break;
                    case 1:
                        var busName = link.splice(0,1);
                        var busLink = new BusLink(link,busName[0].dataID,parent.parent.name);
                        break;
                }
                var size = busLink.calculateCanvasSize(busLink.myData.children);
                msg += "<center><div style='width:" + size[0] + "px;height:" + size[1] + "px'><canvas id='busLinkCanvas' ></canvas></div></center>";
                dijit.showTooltip(msg, e.target);
                var delayedTimer =  setInterval(function () {
                    busLink.createBusLink();
                    clearInterval(delayedTimer);
                },300);
            }

           /* var delayedTimer =  setInterval(function () {

                clearInterval(delayedTimer);
            }, 400);*/

            /*for(var i = 0;i < link.length;i++){
                msg += link[i].modelType + "*" + link[i].modelName + "*" + link[i].dataID + "*" +link[i].direction + "</br>";
            }*/
        };
        var hideTooltip = function(e) {
            /*var busLink = document.getElementById("busLink");
            var busLinkCanvas = document.getElementById("busLinkCanvas");
            busLink.removeChild(busLinkCanvas);*/
            dijit.hideTooltip(e.target);
            /*var delayedTimer =  setInterval(function () {
             clearInterval(delayedTimer);
            }, 400);*/
        };
        dojo.connect(option, "mouseover", showTooltip);
        dojo.connect(option, "mouseout", hideTooltip);
    },
    updateBusConnectDlg:function(){
        var busDataSelect = dojo.byId('busConnectBusData');
        var modelDataFromSelect = dojo.byId('busConnectModelDataFrom');
        var modelDataToSelect = dojo.byId('busConnectModelDataTo');
        var length = busDataSelect.childNodes.length;
        for(var i = 0;i < length;i++){
            busDataSelect.removeChild(busDataSelect.childNodes[0]);
        }
        var busNameIndex = -1;
        var parentComponent = this.parent.parent.parentComponent;
        var i = 0;
        //var offset = 0;
        if(parentComponent){
            this.parent.parent.setNewParentComponentDataFlow();
            var parentComponentDataFlow = this.parent.parent.getParentComponentDataFlow();
            var parentComponentDataFlowType = this.parent.parent.getParentComponentDataFlowType();
            for(;i < parentComponentDataFlow.length;i++){
                var option = window.document.createElement('option');
                option.innerHTML = parentComponentDataFlow[i];
                option.value = i;
                if(i == 0){
                    option.selected = true;
                }
                this._addToolTip(option,parentComponentDataFlowType[i],0,null);
                busDataSelect.appendChild(option);
            }
            //offset = i;
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
                /*this.changeDataFlowBusIndex(0,option.innerHTML,j + offset);
                 this.changeDataFlowBusIndex(1,option.innerHTML,j + offset);*/
                option.value = i;
                if(i == 0){
                    option.selected = true;
                }
                this._addToolTip(option,bus.dataFlow[busNameIndex].data[j].type,0);
                busDataSelect.appendChild(option);
            }
        }
        length = modelDataFromSelect.childNodes.length;
        for(var i = 0;i < length;i++){
            modelDataFromSelect.removeChild(modelDataFromSelect.childNodes[0]);
        }
        for(var i = 0;i < this.parent.dataFlow.from.length;i++){
            var option = window.document.createElement('option');
            option.innerHTML = this.parent.dataFlow.from[i].id;
            option.value = i;
            if(i == 0){
                option.selected = true;
            }
            this._addToolTip(option,this.parent.dataFlow.from[i].type,1,0);
            modelDataFromSelect.appendChild(option);
        }
        length = modelDataToSelect.childNodes.length;
        for(var i = 0;i < length;i++){
            modelDataToSelect.removeChild(modelDataToSelect.childNodes[0]);
        }
        for(var i = 0;i < this.parent.dataFlow.to.length;i++){
            var option = window.document.createElement('option');
            option.innerHTML = this.parent.dataFlow.to[i].id;
            option.value = i;
            if(i == 0){
                option.selected = true;
            }
            this._addToolTip(option,this.parent.dataFlow.to[i].type,1,1);
            modelDataToSelect.appendChild(option);
        }
    },
    disconnectEvent:function(){
        dojo.disconnect(this.busDataMultiSelectHandle);
        dojo.disconnect(this.modelDataFromMultiSelectHandle);
        dojo.disconnect(this.modelDataToMultiSelectHandle);
        dojo.disconnect(this.operateStatus0Handle);
        dojo.disconnect(this.operateStatus1Handle);
        dojo.disconnect(this.operateStatus2Handle);
        dojo.disconnect(this.operateButtonHandle);
        dojo.disconnect(this.applyButtonHandle);
        dojo.disconnect(this.abolishButtonHandle);
        dojo.disconnect(this.dialogHandle);
        clearInterval(this.timer);
    },
    connectEvent:function(){
        var button = dijit.byId("busConnectOperate");
        var applyButton = dijit.byId("busConnectApply");
        var abolishButton = dijit.byId("busConnectAbolish");
        var parent = this;
        this.busDataMultiSelectHandle = dojo.connect(this.busDataMultiSelect,"onClick",this,this.selectOption);
        this.modelDataFromMultiSelectHandle = dojo.connect(this.modelDataFromMultiSelect,"onClick",this,this.selectOption);
        this.modelDataToMultiSelectHandle = dojo.connect(this.modelDataToMultiSelect,"onClick",this,this.selectOption);
        this.operateStatus0Handle = dojo.connect(this.operateStatus0,"onClick",this,this.changeStatus);
        this.operateStatus1Handle = dojo.connect(this.operateStatus1,"onClick",this,this.changeStatus);
        this.operateStatus2Handle = dojo.connect(this.operateStatus2,"onClick",this,this.changeStatus);
        this.operateButtonHandle = dojo.connect(button,"onClick",this,this.action);
        this.applyButtonHandle = dojo.connect(applyButton,"onClick",this,this.busConnectApply);
        this.abolishButtonHandle = dojo.connect(abolishButton,"onClick",this,this.busConnectAbolish);
        this.timer = setInterval(
            function () {
                parent.clear();
                parent.drawBusConnect();
                return;
            }, 25);
        this.status = 0;
    },
    configuring:function(){
        //总线交联配置代码
        this.busConnectDlg = dijit.byId("busConnectDlg");
        this.busConnectDlg.show();
        var createMultiSelect = function () {
            if(dijit.byId('busConnectBusData')) {
                this.operateStatus0 = dijit.byId("busConnectOperateStatus0");
                this.operateStatus1 = dijit.byId("busConnectOperateStatus1");
                this.operateStatus2 = dijit.byId("busConnectOperateStatus2");
                this.busDataMultiSelect = dijit.byId('busConnectBusData');
                this.modelDataFromMultiSelect = dijit.byId('busConnectModelDataFrom');
                this.modelDataToMultiSelect = dijit.byId('busConnectModelDataTo');
                this.updateBusConnectDlg();
                this.connectEvent();
            }else{
                var busDataSelect = dojo.byId('busConnectBusData');
                var modelDataFromSelect = dojo.byId('busConnectModelDataFrom');
                var modelDataToSelect = dojo.byId('busConnectModelDataTo');
                this.operateStatus0 = dijit.byId("busConnectOperateStatus0");
                this.operateStatus1 = dijit.byId("busConnectOperateStatus1");
                this.operateStatus2 = dijit.byId("busConnectOperateStatus2");
                this.busDataMultiSelect = new dijit.form.MultiSelect({ name: 'busData',style:"width:150px;height:200px;float:left;" }, busDataSelect);
                this.busDataMultiSelect.startup();
                this.modelDataFromMultiSelect = new dijit.form.MultiSelect({ name: 'modelDataFrom',style:"width:150px;height:100px;float:left;" }, modelDataFromSelect);
                this.modelDataFromMultiSelect.startup();
                this.modelDataToMultiSelect = new dijit.form.MultiSelect({ name: 'modelDataTo',style:"width:150px;height:100px;float:left;" }, modelDataToSelect);
                this.modelDataToMultiSelect.startup();
                this.updateBusConnectDlg();
                this.connectEvent();
            }
        };
        this.dialogHandle = dojo.connect(this.busConnectDlg, "onDownloadEnd",this, createMultiSelect);
        //this.checkDataFlowEffective();
        //总线交联配置代码
    },
    isConfigured:function(){
        if(this.dataFlow.busToModel.length || this.dataFlow.modelToBus.length){
            if(this.dataFlow.busToModel.length==this.parent.dataFlow.from.length
                &&this.dataFlow.modelToBus.length==this.parent.dataFlow.to.length){
                this.isConfigure = true;
            }else{
                this.isConfigure = false;
            }
        }else{
            this.isConfigure = false;
        }
        return this.isConfigure;
    },
    /*checkDataFlowEffective:function(){
        this.parent.parent.setNewParentComponentDataFlow();
    },*/
    changeDataFlowEffective:function(){
        var oldParentComponentDataFlow = this.parent.parent.getOldParentComponentDataFlow();
        var parentComponentDataFlow = this.parent.parent.getParentComponentDataFlow();
        /*if(this.isChange){
            return;
        }
        this.isChange = true;*/
        var busNameIndex = -1;
        var parentComponent = this.parent.parent.parentComponent;
        var newIndex = [];
        if(parentComponent) {
            for (var j = 0; j < bus.dataFlow.length; j++) {
                if (bus.dataFlow[j].name == this.parent.parent.parentComponent.type) {
                    busNameIndex = j;
                    break;
                }
            }
        }

        var overOffset = 0;
        if(this.parent.parent.isAllParentComponentDataFlowDelete()){
            overOffset = parentComponentDataFlow.length;
            parentComponentDataFlow = [];
            newIndex.push({oldIndex:oldParentComponentDataFlow.length-1,newIndex:0,offset:oldParentComponentDataFlow.length});
        }else{
            var beyondOffset = 0;
            var firstPush = true;
            for(var i = oldParentComponentDataFlow.length-1;i>-1;i--){
                for(var j = parentComponentDataFlow.length-1;j>-1;j--){
                    if(parentComponentDataFlow[j]==oldParentComponentDataFlow[i]){
                        if(firstPush){
                            firstPush = false;
                            beyondOffset = oldParentComponentDataFlow.length - 1 - i;
                            if(beyondOffset != 0){
                                newIndex.push({oldIndex:i+1,newIndex:j,offset:i - j + beyondOffset});
                            }else{
                                newIndex.push({oldIndex:i,newIndex:j,offset:i - j});
                            }
                        }else{
                            newIndex.push({oldIndex:i,newIndex:j,offset:i - j});
                        }
                    }
                }
            }
            if(newIndex.length == 0){
                newIndex.push({oldIndex:oldParentComponentDataFlow.length-1,newIndex:-1,offset:oldParentComponentDataFlow.length});
            }
            var overDataFlow = parentComponentDataFlow.splice(newIndex[0].newIndex + 1);
            overOffset = overDataFlow.length;
        }
        var length = this.dataFlow.busToModel.length;
        for(var i = 0;i<length;i++){
            var flag = false;
            for(var j = 0;j<parentComponentDataFlow.length;j++){
                if(this.dataFlow.busToModel[i].data.bus == parentComponentDataFlow[j]){
                    flag = true;
                    break;
                }
            }
            if(busNameIndex != -1){
                for(var j = 0;j<bus.dataFlow[busNameIndex].data.length;j++){
                    if(this.dataFlow.busToModel[i].data.bus == bus.dataFlow[busNameIndex].data[j].id){
                        flag = true;
                        break;
                    }
                }
            }

            if(!flag){
                this.removeDataItem(0,this.dataFlow.busToModel[i].id);
                i--;
                length--;
            }
        }
        length = this.dataFlow.modelToBus.length;
        for(var i = 0;i<length;i++){
            var flag = false;
            for(var j = 0;j<parentComponentDataFlow.length;j++){
                if(this.dataFlow.modelToBus[i].data.bus == parentComponentDataFlow[j]){
                    flag = true;
                    break;
                }
            }
            if(busNameIndex != -1){
                for(var j = 0;j<bus.dataFlow[busNameIndex].data.length;j++){
                    if(this.dataFlow.modelToBus[i].data.bus == bus.dataFlow[busNameIndex].data[j].id){
                        flag = true;
                        break;
                    }
                }
            }
            if(!flag){
                this.removeDataItem(1,this.dataFlow.modelToBus[i].id);
                i--;
                length--;
            }
        }
        for(var i = 0;i<this.dataFlow.modelToBus.length;i++){
            var offset = 0;
            var busIndex= this.dataFlow.modelToBus[i].index.bus;
            for(var j = newIndex.length-1;j>-1;j--){
                if(busIndex >= newIndex[j].oldIndex){
                    offset = newIndex[j].offset;
                }
            }
            if(busIndex > newIndex[0].oldIndex){
                this.dataFlow.modelToBus[i].index.bus = this.dataFlow.modelToBus[i].index.bus - offset + overOffset;
            }else{
                this.dataFlow.modelToBus[i].index.bus = this.dataFlow.modelToBus[i].index.bus - offset;
            }
        }
        for(var i = 0;i<this.dataFlow.busToModel.length;i++){
            var offset = 0;
            var busIndex= this.dataFlow.busToModel[i].index.bus;
            for(var j = newIndex.length-1;j>-1;j--){
                if(busIndex >= newIndex[j].oldIndex){
                    offset = newIndex[j].offset;
                }
            }
            if(busIndex > newIndex[0].oldIndex){
                this.dataFlow.busToModel[i].index.bus = this.dataFlow.busToModel[i].index.bus - offset + overOffset;
            }else{
                this.dataFlow.busToModel[i].index.bus = this.dataFlow.busToModel[i].index.bus - offset
            }
        }
        this._dataFlowDeepCopy(0);
    },
    _subProcessApplyChange:function(subProcess){
        if(subProcess){
            subProcess.setNewParentComponentDataFlow();
            for(var i = 0;i<subProcess.children.length;i++){
                var child = subProcess.children[i];
                if(child instanceof Component) {
                    if(child.busConnect){
                        child.busConnect.changeDataFlowEffective();
                    }
                    if (child.subProcess != null){
                        this._subProcessApplyChange(child.subProcess);
                        /*for(var j = 0;j<child.subProcess.children.length;j++){
                            var child1 = child.subProcess.children[j];
                            if(child1 instanceof Component) {
                                if(child1.busConnect){
                                    child1.busConnect.isChange = false;
                                }
                            }
                        }*/
                    }
                }
            }
            subProcess.setParentComponentDataFlow();
            var parentComponent = subProcess.parentComponent;
            if(parentComponent){
                var busConnect = parentComponent.busConnect;
                if(busConnect){
                    busConnect.isAllDelete = false;
                }
            }
        }
    },
    busConnectApply:function(){
        if(this.dataFlow.busToModel.length || this.dataFlow.modelToBus.length){
            if(this.dataFlow.busToModel.length==this.parent.dataFlow.from.length
                &&this.dataFlow.modelToBus.length==this.parent.dataFlow.to.length){
                this.isConfigure = true;
                this.sendNetMsg(NetMsgUtil.prototype.msgChange,["dataFlow",this.oldDataFlow]);
                this._dataFlowDeepCopy(0);
                this.disconnectEvent();
                this.busConnectDlg.hide();
                process.validate();
            }else{
                this.isConfigure = false;
                if(confirm("警告：总线交联数据配置不完整，是否继续配置？")) {

                }else{
                    this.sendNetMsg(NetMsgUtil.prototype.msgChange,["dataFlow",this.oldDataFlow]);
                    this._dataFlowDeepCopy(0);
                    this.disconnectEvent();
                    this.busConnectDlg.hide();
                }
                process.validate();
            }
        }else{
            this.isConfigure = false;
            if(confirm("警告：总线交联配置为空！是否继续配置？")) {

            }else {
                this._dataFlowDeepCopy(0);
                this.disconnectEvent();
                this.busConnectDlg.hide();
            }
            process.validate();
        }
        if(this.parent.subProcess){
            this._subProcessApplyChange(this.parent.subProcess);
        }else{
            this.isAllDelete = false;
        }
    },
    busConnectAbolish:function(){
        this._dataFlowDeepCopy(1);
        this.disconnectEvent();
        this.busConnectDlg.hide();
        process.validate();
    },
    _dataFlowDeepCopy:function(type/*0:old = new, 1:new = old*/){
        switch (type){
            case 0:
                this.oldDataFlow = {busToModel:[], modelToBus:[]};
                for(var i = 0;i < this.dataFlow.busToModel.length;i++){
                    this.oldDataFlow.busToModel.push(
                        {
                            id:this.dataFlow.busToModel[i].id,
                            data:
                            {
                                bus:this.dataFlow.busToModel[i].data.bus,
                                model:this.dataFlow.busToModel[i].data.model
                            },
                            index:
                            {
                                bus:this.dataFlow.busToModel[i].index.bus,
                                model:this.dataFlow.busToModel[i].index.model
                            }
                        }
                    );
                }
                for(var i = 0;i < this.dataFlow.modelToBus.length;i++){
                    this.oldDataFlow.modelToBus.push(
                        {
                            id:this.dataFlow.modelToBus[i].id,
                            data:
                            {
                                bus:this.dataFlow.modelToBus[i].data.bus,
                                model:this.dataFlow.modelToBus[i].data.model
                            },
                            index:
                            {
                                bus:this.dataFlow.modelToBus[i].index.bus,
                                model:this.dataFlow.modelToBus[i].index.model
                            }
                        }
                    );
                }
                break;
            case 1:
                this.dataFlow = {busToModel:[], modelToBus:[]};
                for(var i = 0;i < this.oldDataFlow.busToModel.length;i++){
                    this.dataFlow.busToModel.push(
                        {
                            id:this.oldDataFlow.busToModel[i].id,
                            data:
                            {
                                bus:this.oldDataFlow.busToModel[i].data.bus,
                                model:this.oldDataFlow.busToModel[i].data.model
                            },
                            index:
                            {
                                bus:this.oldDataFlow.busToModel[i].index.bus,
                                model:this.oldDataFlow.busToModel[i].index.model
                            }
                        }
                    );
                }
                for(var i = 0;i < this.oldDataFlow.modelToBus.length;i++){
                    this.dataFlow.modelToBus.push(
                        {
                            id:this.oldDataFlow.modelToBus[i].id,
                            data:
                            {
                                bus:this.oldDataFlow.modelToBus[i].data.bus,
                                model:this.oldDataFlow.modelToBus[i].data.model
                            },
                            index:
                            {
                                bus:this.oldDataFlow.modelToBus[i].index.bus,
                                model:this.oldDataFlow.modelToBus[i].index.model
                            }
                        }
                    );
                }
                break;
        }
    },
    changeDataFlowBusIndex:function(type/*0为busToModel,1为modelToBus*/,busID,newBusIndex){
        switch (type){
            case 0:
                for(var i = 0;i<this.dataFlow.busToModel.length;i++){
                    var dataFlow = this.dataFlow.busToModel[i];
                    if(dataFlow.data.bus == busID){
                        dataFlow.index.bus = newBusIndex;
                    }
                }
                break;
            case 1:
                for(var i = 0;i<this.dataFlow.modelToBus.length;i++){
                    var dataFlow = this.dataFlow.modelToBus[i];
                    if(dataFlow.data.bus == busID){
                        dataFlow.index.bus = newBusIndex;
                    }
                }
                break;
        }
    },
    addDataItem:function(type/*0为busToModel,1为modelToBus*/,bus,model,busIndex,modelIndex){
        switch (type){
            case 0:
                this.dataFlow.busToModel.push({id:this.busToModelID,data:{bus:bus,model:model},index:{bus:busIndex,model:modelIndex}});
                this.busToModelID++;
                break;
            case 1:
                this.dataFlow.modelToBus.push({id:this.modelToBusID,data:{bus:bus,model:model},index:{bus:busIndex,model:modelIndex}});
                this.modelToBusID++;
                break;
        }
    },
    removeDataItem:function(type,id){
        this.isConfigure = false;
        switch (type){
            case 0:
                var temp = this.dataFlow.busToModel;
                for(var i = 0;i<temp.length;i++){
                    if(temp[i].id == id){
                        this.dataFlow.busToModel.splice(i,1);
                        return true;
                    }
                }
                break;
            case 1:
                var temp = this.dataFlow.modelToBus;
                for(var i = 0;i<temp.length;i++){
                    if(temp[i].id == id){
                        this.dataFlow.modelToBus.splice(i,1);
                        return true;
                    }
                }
                break;
        }
        return false;
    },
    removeAllData:function(){
        this.dataFlow = {busToModel:[], modelToBus:[]};
        this.oldDataFlow = {busToModel:[], modelToBus:[]};
        this.isConfigure = false;
    }
});