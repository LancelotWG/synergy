/**
 * Created by Lancelot.W.Guoelf on 16/10/18.
 */
dojo.require("dojo.Stateful");
dojo.declare("BusLink",dojo.Stateful,{
    data:null/*[
        {
            dataID:"WZ_SigFailFlag",
            direction:"modelToBus",
            modelName:"ANA",
            modelType:"ANA"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"modelToBus",
            modelName:"RM",
            modelType:"RM"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"busToModel",
            modelName:"FINT",
            modelType:"FINT"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"busToModel",
            modelName:"FRCV",
            modelType:"FRCV"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"modelToBus",
            modelName:"FRCV",
            modelType:"FRCV"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"modelToBus",
            modelName:"ANA_RCF",
            modelType:"ANA_RCF"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"busToModel",
            modelName:"ANA_INIT",
            modelType:"ANA_INIT"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"modelToBus",
            modelName:"ANA_INIT",
            modelType:"ANA_INIT"
        },
        {
            dataID:"WZ_SigFailFlag",
            direction:"busToModel",
            modelName:"ANA_VOTE",
            modelType:"ANA_VOTE"
        }
    ]*/,
    busName:""/*"WZ_SigFailFlag_BUS"*/,
    mainName:""/*"ANA_VOTE"*/,
    myData:null/*{
            fromData:null,
        toData:null,
        name:"Process",
        type:"Process",
        children:[
            {
                fromData:null,
                toData:"WZ_SigFailFlag",
                name:"RM",
                type:"RM",
                children:[
                    {
                        fromData:null,
                        toData:"WZ_SigFailFlag",
                        name:"ANA",
                        type:"ANA",
                        children:[
                            {
                                fromData:null,
                                toData:"WZ_SigFailFlag",
                                name:"ANA_RCF",
                                type:"ANA_RCF",
                                children:[

                                ]
                            },
                            {
                                fromData:"WZ_SigFailFlag",
                                toData:"WZ_SigFailFlag",
                                name:"ANA_INIT",
                                type:"ANA_INIT",
                                children:[

                                ]
                            },
                            {
                                fromData:"WZ_SigFailFlag",
                                toData:null,
                                name:"ANA_VOTE",
                                type:"ANA_VOTE",
                                children:[

                                ]
                            }
                        ]
                    },
                    {
                        fromData:"WZ_SigFailFlag",
                        toData:null,
                        name:"FINT",
                        type:"FINT",
                        children:[

                        ]
                    },
                    {
                        fromData:"WZ_SigFailFlag",
                        toData:"WZ_SigFailFlag",
                        name:"FRCV",
                        type:"FRCV",
                        children:[

                        ]
                    }
                ]
            }
        ]
    }*/,
    constructor: function(data,busName,mainName){
        this.data = data;
        this.busName = busName;
        this.mainName = mainName;
        this.myData = {
            fromData:null,
            toData:null,
            name:"Process",
            type:"Process",
            children:[]
        };
        this.transform(this.data);
    },
    createBusLink:function(){
        var myPosition = {x:0,y:0};
        var size = this.calculateCanvasSize(this.myData.children);
        var canvas = document.getElementById("busLinkCanvas");
        if(canvas){

        }else{
            return;
        }
        var context = canvas.getContext("2d");
        canvas.width = size[0];
        canvas.height = size[1];
        this.cell(context,myPosition,this.myData.type,this.myData.name,this.myData.fromData,this.myData.toData,this.myData.children);
    },
    transform:function(data){
        if(data.length == 0){
            return;
        }
        var compList = [];
        for(var i = 0;i < data.length;i++){
            var comp = reg.getComponentByName(data[i].modelName);
            if(data[i].direction == "busToModel"){
                comp.itemData.fromData = data[i].dataID;
            }else if(data[i].direction == "modelToBus"){
                comp.itemData.toData = data[i].dataID;
            }
            comp.itemData.name = data[i].modelName;
            comp.itemData.type = data[i].modelType;
            var isPush = false;
            for(var j = 0;j < compList.length;j++){
                if(compList[j] == comp){
                    isPush = true;
                    break;
                }
            }
            if(!isPush){
                compList.push(comp);
            }
        }
        var maxList = [];
        for(var i = 0;i < compList.length;i++){
            var comp = compList[i];
            var parentComp = comp.parent.parentComponent;
            maxList[i] = 0;
            if(parentComp) {
                for (var j = 0; j < compList.length; j++) {
                    var parent = compList[j];
                    if (parentComp == parent) {
                        parent.itemData.children.push(comp.itemData);
                        maxList[i] = 1;
                    }
                }
            }
        }
        var maxIndex = [];
        for(var i = 0;i < maxList.length;i++){
            if(maxList[i] == 0){
                maxIndex.push(i);
            }
        }
        for(var i = 0;i < maxIndex.length;i++){
            var maxComp = compList[maxIndex[i]];
            var parentComponent = maxComp.parent.parentComponent;
            if(parentComponent){
                parentComponent.itemData.name = parentComponent.name;
                parentComponent.itemData.type = parentComponent.type;
                parentComponent.itemData.children.push(maxComp.itemData);
                this.myData = parentComponent.itemData;
                if(i == maxIndex.length - 1){
                    parentComponent.itemData =
                    {
                        fromData:null,
                        toData:null,
                        name:parentComponent.name,
                        type:parentComponent.type,
                        children:[]
                    };
                }
            }else{
                if(i == 0){
                    this.myData.name = os.mainProcess.name;
                }
                this.myData.children.push(maxComp.itemData);
            }
        }
        for(var i = 0;i < compList.length;i++){
            compList[i].itemData =
            {
                fromData:null,
                toData:null,
                name:compList[i].name,
                type:compList[i].type,
                children:[]
            }
        }
    },
    calculateCanvasSize:function (data){
        var standardSize = [100,60];
        var originalInterval = 25;
        var height = 60;
        var width = 100;
        var interval = 25;
        var marginTop = 20;
        var marginSide = 45;
        var separate = 30;
        var titleBusTop = 18;
        var busMarginTop = 30;
        var bigHeight = 60;
        var lastWidth = 0;
        for(var i = 0;i<data.length;i++){
            var size = this.calculateCanvasSize(data[i].children);
            lastWidth = lastWidth + size[0];
            if(i == 0){
                width = width + marginSide;
            }
            if(size[1] >= bigHeight){
                bigHeight = size[1];
                interval = busMarginTop + bigHeight + marginTop + 12 + titleBusTop;
            }
            width = width + size[0] + separate;
            if(i == data.length - 1){
                width = width + marginSide - separate - standardSize[0];
                height = height + interval - originalInterval;
            }

        }
        return [width,height];
    },
    cell: function(context,position,type,name,fromData,toData,children,isMain) {
        var standardSize = [100,60];
        var originalInterval = 25;
        var height = 60;
        var width = 100;
        var interval = 25;
        var imgMargin = 2;
        var titleRight = 20;
        var titleTop = 15;
        var title = 20;
        var marginTop = 20;
        var marginSide = 45;
        var separate = 30;
        var titleBusTop = 18;
        var fromLink = 20;
        var toLink = 5;
        var busMarginTop = 30;
        var fontHeight = 12;
        context.save();
        var img=new Image();
        img.onload=function(){
            context.drawImage(img,position.x + imgMargin,position.y + imgMargin);
        };
        img.src = contextPath+"/resource/image/icons/treeicons/"+ type + ".png";
        var bigHeight = 60;
        var lastWidth = 0;
        var tempArrows = [];
        var tempArrow = [];
        for(var i = 0;i<children.length;i++){
            var subPosition = {x:position.x + marginSide + i*separate + lastWidth,y: position.y + title + marginTop};
            var size = this.cell(context,subPosition,children[i].type,children[i].name,children[i].fromData,
                children[i].toData,children[i].children,children[i].name == this.mainName);
            lastWidth = lastWidth + size[0];
            if(i == 0){
                width = width + marginSide;
            }
            if(size[1] >= bigHeight){
                bigHeight = size[1];
                interval = busMarginTop + bigHeight + marginTop + 12 + titleBusTop;
            }
            tempArrow = tempArrow.concat(size[2]);
            width = width + size[0] + separate;
            if(i == children.length - 1){
                width = width + marginSide - separate - standardSize[0];
                height = height + interval - originalInterval;
                var busPosition = {x:position.x,y:position.y + title + marginTop + bigHeight + busMarginTop};
                this.drawBus(context,busPosition,width);
                for (var j = 0; j < tempArrow.length; j++) {
                    switch (tempArrow[j].type) {
                        case 0:
                            this.drawArrows(context,0,{x:tempArrow[j].point.x - fromLink,y:busPosition.y - 6},tempArrow[j].point);
                            break;
                        case 1:
                            this.drawArrows(context,1,tempArrow[j].point,{x:tempArrow[j].point.x + toLink,y:busPosition.y - 6});
                            break;
                    }
                }
            }

        }
        context.font="12px Arial";
        context.fillText(name,position.x + titleRight,position.y + titleTop,width - titleRight);
        if(fromData){
            context.fillText(fromData,position.x,position.y + interval + title,width - 5);
            tempArrows.push({type:0,point:{x:position.x,y:position.y + interval + title - 5}});
        }
        if(toData){
            context.textAlign="right";
            context.fillText(toData,position.x + width,position.y + interval + title + fontHeight,width - 5);
            tempArrows.push({type:1,point:{x:position.x + width,y:position.y + interval + title + 10}});
        }

        if(isMain){
            context.strokeStyle = ColorUtil.prototype.colorRed;
            context.lineWidth = 1;
        }else{
            context.strokeStyle = ColorUtil.prototype.colorBlack;
            context.lineWidth = 1;
        }
        context.strokeRect(position.x,position.y,width,height);
        context.restore();
        return [width,height,tempArrows];
    },
     drawArrows:function(context,type/*0:busToModel,1:modelToBus*/,from,to){
        context.save();
        var size = [15,3];
        var cosRad;
        var sinRad;
        switch (type) {
            case 0:
                context.fillStyle = ColorUtil.prototype.colorBlue;
                context.strokeStyle = ColorUtil.prototype.colorBlue;
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(from.x,from.y);
                context.lineTo(from.x,to.y);
                context.lineTo(to.x,to.y);
                context.stroke();
                cosRad = -1;
                sinRad = 0;
                break;
            case 1:
                context.fillStyle = ColorUtil.prototype.colorGreen;
                context.strokeStyle = ColorUtil.prototype.colorGreen;
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(from.x,from.y);
                context.lineTo(to.x,from.y);
                context.lineTo(to.x,to.y);
                context.stroke();
                cosRad = 0;
                sinRad = 1;
                break;
        }
        var p1 = to;
        var center = {x:p1.x + size[0]*cosRad,y:p1.y - size[0]*sinRad};
        var p2 = {x:center.x + size[1]*sinRad,y:center.y + size[1]*cosRad};
        var p3 = {x:center.x - size[1]*sinRad,y:center.y - size[1]*cosRad};
        context.beginPath();
        context.moveTo(p1.x,p1.y);
        context.lineTo(p2.x,p2.y);
        context.lineTo(p3.x,p3.y);
        context.lineTo(p1.x,p1.y);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    },
     drawBus:function(context,position,length) {
         var size = [20,6,12];/*width,tail,heigth*/
         context.save();
         context.beginPath();
         context.strokeStyle = ColorUtil.prototype.colorSkyBlue;
         context.fillStyle = ColorUtil.prototype.colorSkyBlue;
         context.lineWidth = 1;
         context.moveTo(position.x, position.y);
         context.lineTo(position.x + size[0],position.y - size[2]);
         context.lineTo(position.x + size[0],position.y - size[1]);
         context.lineTo(position.x + length - size[0],position.y - size[1]);
         context.lineTo(position.x + length - size[0],position.y - size[2]);
         context.lineTo(position.x + length,position.y);
         context.lineTo(position.x + length - size[0],position.y + size[2]);
         context.lineTo(position.x + length - size[0],position.y + size[1]);
         context.lineTo(position.x + size[0],position.y + size[1]);
         context.lineTo(position.x + size[0],position.y + size[2]);
         context.lineTo(position.x,position.y);
         context.closePath();
         context.fill();
         context.stroke();
         context.restore();
         //总线文字
         context.save();
         context.fillStyle = ColorUtil.prototype.colorBlack;
         context.font="12px Arial";
         context.textAlign="center";
         context.fillText(this.busName,position.x + length/2,position.y + 4);
         context.restore();
    }
});