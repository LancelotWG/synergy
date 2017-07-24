/**
 * Created by Lancelot.W.Guoelf on 16/10/23.
 */
dojo.declare("CodeGeneration",dojo.Stateful, {
    codeComponent:null,
    functionName:"",
    returnStructName:"",
    returnStructUsingName:"",
    returnSturct:null,
    toStruct:null,
    statementStringStream:"",
    stringStream:"",
    callStringStream:"",
    type:null,
    constructor: function(component/*Component*//*,inputParameter,outputParameter,dataMember,subFunction*/){
        this.type = component.type;
        this.codeComponent = component;
        this.functionName = component.name;
        this.returnStructUsingName = "return" + component.name;
        if(this.codeComponent.type == "Custom"){
            this.returnStructName = "Return" + component.name;
        }else{
            this.returnStructName = "Return" + component.type;
        }
        this.returnSturct = this.getToStruct();
        this.toStruct = [];
    },
    getToStructDefinition:function(){
        var struct = "struct " + this.returnStructName + "{\n";
        for(var i = 0;i < this.codeComponent.dataFlow.to.length;i++){
            struct = struct + this.codeComponent.dataFlow.to[i].type + " " + this.codeComponent.dataFlow.to[i].id + ";\n";
            this.toStruct.push(this.returnStructUsingName + "." +this.codeComponent.dataFlow.to[i].id );
        }
        struct += "};\n";
        return struct;
    },
    getToStruct:function(){
        var struct  = this.returnStructName + " " + this.returnStructUsingName + " = " + this.returnStructName + "()";
        return struct;
    },
    getStatementStringStream:function(){
        var string = this.returnStructName + " " + this.functionName + "(";
        for(var i = 0 ;i<this.codeComponent.dataFlow.from.length;i++){
            string += this.codeComponent.dataFlow.from[i].type + " " + this.codeComponent.dataFlow.from[i].id;
            if(i < this.codeComponent.dataFlow.from.length - 1){
                string += " , ";
            }
        }
        string += ");\n";
        return string;
    },
    getDefinitionStringStream:function(){
        var string = this.codeComponent.code;
        if(this.codeComponent.code != ""){
            return string;
        }
        var busNameIndex = -1;
        for(var j = 0;j < bus.dataFlow.length;j++){
            if(bus.dataFlow[j].name == this.codeComponent.type) {
                busNameIndex = j;
                break;
            }
        }
        //函数名
        if(busNameIndex == 0) {
            string += "void main(";
        }else{
            string += this.returnStructName + " " + this.functionName + "(";
        }
        //传入参数
        for(var i = 0 ;i<this.codeComponent.dataFlow.from.length;i++){
            string += this.codeComponent.dataFlow.from[i].type + " " + this.codeComponent.dataFlow.from[i].id;
            if(i < this.codeComponent.dataFlow.from.length - 1){
                string += " , ";
            }
        }
        string += "){\n";
        //函数局部变量（Bus）
        if(busNameIndex == -1){

        }else {
            for (var i = 0; i < bus.dataFlow[busNameIndex].data.length; i++) {
                string += bus.dataFlow[busNameIndex].data[i].type + " " + bus.dataFlow[busNameIndex].data[i].id + ";\n";
                //Bus数据初始化

                //Bus数据初始化
            }
        }
        //函数返回值结构体
        if(busNameIndex != 0){
            string += this.returnSturct + ";\n";
        }
        //子函数调用
        var sbuProcess = this.codeComponent.subProcess;
        if(sbuProcess){
            var children = sbuProcess.children;
            var parentBusConnect = this.codeComponent.busConnect;
            for(var i = 0;i<children.length;i++){
                var child = children[i];
                if (isComponent(child)){
                    var callParameter = [];
                    var returnParameter = [];
                    var busConnect = child.busConnect;
                    //子函数传入参数
                    for(var j = 0;j<busConnect.dataFlow.busToModel.length;j++){
                        var busToModel = busConnect.dataFlow.busToModel[j];
                        var connectParentBus = false;
                        //父函数传入参数匹配
                        for(var t = 0;t<parentBusConnect.dataFlow.busToModel.length;t++){
                            var parentBusToModel = parentBusConnect.dataFlow.busToModel[t];
                            if(busToModel.data.bus == parentBusToModel.data.bus){
                                callParameter.push(parentBusToModel.data.model);
                                connectParentBus = true;
                                break;
                            }
                        }
                        //父函数返回参数匹配
                        for(var t = 0;t<parentBusConnect.dataFlow.modelToBus.length;t++){
                            var parentModelToBus = parentBusConnect.dataFlow.modelToBus[t];
                            if(busToModel.data.bus == parentModelToBus.data.bus){
                                callParameter.push(this.returnStructUsingName + "." + parentModelToBus.data.model);
                                connectParentBus = true;
                                break;
                            }
                        }
                        //函数局部变量（Bus）匹配
                        if(!connectParentBus){
                            for(var t = 0;t<bus.dataFlow[busNameIndex].data.length;t++){
                                if(busToModel.data.bus == bus.dataFlow[busNameIndex].data[t].id){
                                    callParameter.push(busToModel.data.bus);
                                }
                            }
                        }
                    }
                    //子函数返回参数
                    for(var j = 0;j<busConnect.dataFlow.modelToBus.length;j++){
                        var modelToBus = busConnect.dataFlow.modelToBus[j];
                        var connectParentBus = false;
                        //父函数返回参数匹配
                        for(var t = 0;t<parentBusConnect.dataFlow.modelToBus.length;t++){
                            var parentModelToBus = parentBusConnect.dataFlow.modelToBus[t];
                            if(modelToBus.data.bus == parentModelToBus.data.bus){
                                returnParameter.push(this.returnStructUsingName + "." + parentModelToBus.data.model);
                                connectParentBus = true;
                                break;
                            }
                        }
                        //父函数传入参数匹配
                        for(var t = 0;t<parentBusConnect.dataFlow.busToModel.length;t++){
                            var parentBusToModel = parentBusConnect.dataFlow.busToModel[t];
                            if(modelToBus.data.bus == parentBusToModel.data.bus){
                                returnParameter.push(parentBusToModel.data.model);
                                connectParentBus = true;
                                break;
                            }
                        }
                        //函数局部变量（Bus）匹配
                        if(!connectParentBus){
                            for(var t = 0;t<bus.dataFlow[busNameIndex].data.length;t++){
                                if(modelToBus.data.bus == bus.dataFlow[busNameIndex].data[t].id){
                                    returnParameter.push(modelToBus.data.bus);
                                }
                            }
                        }
                    }
                    //子函数调用
                    string += this.getCallStringStream(child,callParameter,returnParameter);
                }
            }
        }
        //函数返回
        if(busNameIndex != 0){
            string += "return " + this.returnStructUsingName + ";\n}\n";
        }else{
            string += "return " + ";\n}\n";
        }
        return string;
    },
    getCallStringStream:function(component,callParameter/*数组*/,returnParameter/*数组*//*实际参数*/){
        var codeGeneration = new CodeGeneration(component);
        codeGeneration.getToStructDefinition();
        var string = codeGeneration.returnStructName + " " + codeGeneration.returnStructUsingName + " = " + codeGeneration.functionName + "(";
        for(var i = 0 ;i<callParameter.length;i++){
            string += callParameter[i];
            if(i < callParameter.length - 1){
                string += " , ";
            }
        }
        string += ");\n";
        for(var i = 0 ;i<returnParameter.length;i++){
            string += returnParameter[i] + " = " + codeGeneration.toStruct[i] + ";\n";
        }
        return string;
    }
});