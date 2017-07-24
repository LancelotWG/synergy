/**
 * @author LancelotWG
 * OS模块类
 */

dojo.declare("OS",NamedNode,{
    refNode:null,
    isConfigure:false,
    pos:"last",
    defaultSize:[48,48],
    mainProcess:null,
    oldTimeConfigure:[],
    version:"",
    //测试值
    timeConfigure:/*[{time:12.5},{time:25},{time:100}]*/[],
    codeGenerationType:0,/*0:源代码,1:目标代码*/
    notConfiguredComponent:null,
    initDomNode: function(){
        this.node = dojo.create("div",{align:"center",className:"OS",style:"width:"+this.defaultSize[0]+"px;height:"+this.defaultSize[1]+"px;"},this.refNode,this.pos);
        dojo.create("img",{src:contextPath+"/resource/image/icons/OS_48px.png",alt:this.name},this.node,null);
        dojo.addClass(this.node,"notConfigure");
        /*var newX = YD.getX(this.refNode) - this.refNode.scrollLeft;
        var newY = YD.getY(this.refNode) - this.refNode.scrollTop;
        var height = this.refNode.scrollHeight;
        var width = this.refNode.scrollWidth;
        var x = newX + width/2 - this.defaultSize[0]/2;
        var y = newY + height/8 - this.defaultSize[1]/2;
        YD.setXY(this.node,[x,y]);*/
    },
    freshen:function(){
        var newX = YD.getX(this.refNode) - this.refNode.scrollLeft;
        var newY = YD.getY(this.refNode) - this.refNode.scrollTop;
        YD.setXY(this.node,[newX,newY]);
        newX = YD.getX(this.refNode) - this.refNode.scrollLeft;
        newY = YD.getY(this.refNode) - this.refNode.scrollTop;
        var height = this.refNode.scrollHeight;
        var width = this.refNode.scrollWidth;
        var x = newX + width/2 - this.defaultSize[0]/2;
        var y = newY + height/8 - this.defaultSize[1]/2;
        YD.setXY(this.node,[x,y]);
    },
    codeGeneration:function(){
        isAllComponentConfigured = true;
        retrievalSubProcess(os.mainProcess);
        if(isAllComponentConfigured){
            if(os.mainProcess.children.length <= 3 ){
                alert("注意！工程中无可生成源代码的模块，请添加模块后重试。");
            }else{
                var codeGenerationDlg = dijit.byId("codeGenerationDlg");
                codeGenerationDlg.show();
            }
        }else{
            alert("警告！工程中" + this.notConfiguredComponent.name + "模块未完成总线交联配置，请将其配置完成后重试。");
        }
    },
    _downloadCodeResource:function(){
        window.open("user_downloadCodeFile.xhtml?processName=" + os.mainProcess.name + "&fileName=" + os.mainProcess.name + ".c");
    },
    codeGenerationApply:function(){
        switch(parseInt(os.codeGenerationType)){
            case 0:
                var resource = os.mainProcess.codeGeneration();
                var parent = os;
                var xhrArgs = {
                    url: "user_uploadCodeFile.xhtml?processName=" + parent.mainProcess.name,
                    handleAs: "text",
                    content: {
                        resource: resource
                    },
                    load: function(){
                        if(confirm("源文件已生成，是否下载？")){
                            parent._downloadCodeResource();
                        }
                    },
                    error: function(error){
                        alert("源文件生成失败，请稍后重试！");
                    }
                };
                dojo.xhrPost(xhrArgs);
                console.log("源代码");
                break;
            case 1:

                console.log("目标代码");
                break;
        }
        var codeGenerationDlg = dijit.byId("codeGenerationDlg");
        codeGenerationDlg.hide();
    },
    codeGenerationAbolish:function(){
        var codeGenerationDlg = dijit.byId("codeGenerationDlg");
        codeGenerationDlg.hide();
        os.codeGenerationType = 0;
    },
    changeCodeGenerationType:function(event){
        switch(parseInt(event.target.value)){
            case 0:
                os.codeGenerationType = 0;
                break;
            case 1:
                os.codeGenerationType = 1;
                break;
        }
    },
    getWidth: function(){
        return 48;
    },
    getHeight: function(){
        return 48;
    },
    _getOSVersion:function(){
        var parent = this;
        dojo.xhrGet({
            url: "user_loadOSVersion.xhtml?templateName=original",
            handleAs: "text",
            load: function (data) {
                parent._updateOSVersionMutiSelect(data);
            },
            error: function (e) {
                if (confirm("用户数据加载失败，是否重试？"))
                    os._getOSVersion();
            }
        });
    },
    _updateOSVersionMutiSelect:function(data){
        var OSVersions = data.split("*");
        var OSVersionMutiSelect = dojo.byId('OSVersionMutiSelect');
        var length = OSVersionMutiSelect.childNodes.length;
        for(var i = 0;i < length;i++){
            OSVersionMutiSelect.removeChild(OSVersionMutiSelect.childNodes[0]);
        }
        for(var i = 1;i < OSVersions.length;i++){
            var option = window.document.createElement('option');
            option.innerHTML = OSVersions[i];
            option.value = i - 1;
            if(i == 1){
                option.selected = true;
            }
            OSVersionMutiSelect.appendChild(option);
        }
    },
    configuring:function(){
        var OSConfigureDlg = dijit.byId("OSConfigureDlg");
        OSConfigureDlg.show();
        var parent = this;
        var createMultiSelect = function () {
            if(dijit.byId('OSVersionMutiSelect')){
                parent._getOSVersion();
            }else{
                var OSVersionMutiSelect = dojo.byId('OSVersionMutiSelect');
                var myMultiSelect = new dijit.form.MultiSelect({ name: 'OSVersionMutiSelect',style:"width:180px;height:150px;float:left;margin:10px;" }, OSVersionMutiSelect);
                myMultiSelect.startup();
                parent._getOSVersion();
                /*var OSVersionMutiSelect = dojo.byId('OSVersionMutiSelect');
                var n = 0;
                for(var i = 0;i < 10;i++){
                    var option = window.document.createElement('option');
                    option.innerHTML = i;
                    option.value = n++;
                    option.selected = true;
                    OSVersionMutiSelect.appendChild(option);
                }
                var myMultiSelect = new dijit.form.MultiSelect({ name: 'mutil',style:"width:180px;height:150px;float:left;margin:10px;" }, OSVersionMutiSelect);
                myMultiSelect.startup();*/
            }
        };
        dojo.connect(OSConfigureDlg, "onDownloadEnd", createMultiSelect);
    },
    timeConfiguring:function(){
        var OSTimeConfigureDlg = dijit.byId("OSTimeConfigureDlg");
        OSTimeConfigureDlg.show();
        var createMultiSelect = function () {
            if(dijit.byId('timeConfigureMultiSelect')){
                os.updateTimeConfigureDlg(0);
            }else{
                var timeConfigureMultiSelect = dojo.byId('timeConfigureMultiSelect');
                var myMultiSelect = new dijit.form.MultiSelect({
                    name: 'timeConfigureMultiSelect',
                    style: "width:180px;height:150px;float:left;margin:10px;"
                }, timeConfigureMultiSelect);
                myMultiSelect.startup();
                os.updateTimeConfigureDlg(0);
            }
        };
        dojo.connect(OSTimeConfigureDlg, "onDownloadEnd", createMultiSelect);
    },
    OSVersionApply:function(){
        dijit.byId("OSConfigureDlg").hide();
        this.version = (dijit.byId('OSVersionMutiSelect')).getSelected()[0].innerHTML;
        this.timeConfiguring();
    },
    OSVersionAbolish:function(){
        dijit.byId("OSConfigureDlg").hide();
    },
    _initialProject:function(){
        this._initialTimeConfigureGrid();
        this._createProcess();
        this._createProcessTree();
        menuManager.createMenu(ControlUtil.prototype.createProject);
    },
    _createProcess:function(){
        process = new Sequence.Process({
            name:projectName,
            type:"Process",
            refNode: $("maincontent"),
            pos: "last",
            isMainProcess:true
        });
        //process.setName(projectName);
        this.mainProcess = process;
        bus = new Bus({
            type: "bus",
            refNode:$("maincontent"),
            pos: "last"
        });
        dojo.byId("location").innerHTML = "<b>"+ process.name + "</b>";//层级
        /*process.hideBorder();*/
        process.validate();
        reg.registry(process);

        //var mainFrame = this;
        /*var editorComponentMenu = new dijit.Menu();
        returnParent = new dijit.MenuItem({
            label:"返回父级流程",
            iconClass:"dijitIconEditProperty",
            onClick:function(){
                YD.setStyle(process.node,"display","none");
                var check = process.parentComponent.parent.parentComponent;
                //process = process.parentComponent.parent;
                processChange(process.parentComponent.parent);
                if(check == null)
                    editorProcessMenu.removeChild(2);
                YD.setStyle(process.node,"display","block");
                process.validate();

                if(check == null)
                    dojo.byId("location").innerHTML = "<b>"+ process.name + "</b>";//层级
                else{
                    //层级
                    var parentComponent = process.parentComponent;
                    var parentProcess = parentComponent.parent;
                    var location = "<b>"+parentComponent.name+"</b>";
                    parentComponent = parentProcess.parentComponent;
                    while(parentComponent!=null){
                        parentProcess = parentComponent.parent;
                        location = parentComponent.name + ">>" + location;
                        parentComponent = parentProcess.parentComponent;
                    }
                    location = parentProcess.name + ">>" + location;
                    dojo.byId("location").innerHTML = location;
                    //层级
                }
            }
        });
        var componentDeleteMenu = new dijit.MenuItem({
            label:"删除",
            iconClass:"dijitEditorIcon dijitEditorIconDelete",
            onClick:function(){
                var child = editorComponentMenu.connectedObj;
                //流程锁定
                canDelete = true;
                var subProcess = child.subProcess;
                var subProcessLocked = false;
                if(subProcess != null){
                    if(child.subProcess.locked){
                        subProcessLocked = true;
                    }
                    retrievalSubProcess(subProcess);
                }

                if(child.parent.locked || subProcessLocked || !canDelete){
                    return;
                }
                //流程锁定
                var parent = child.parent;
                if(parent.removeChild(child)){
                    delDraggableWhenDelComp(child);
                    child.sendNetMsg(-1);//发送删除消息
                    //parent.removeChild(child);
                    editorComponentMenu.unBindDomNode(editorComponentMenu.connectedObj.node);
                    editorMenuType=true;
                }else{
                    alert("无法删除！请先将组件前后传输控制组件删除后再试。");
                }
                parent.validate();
            }
        });
        var componentEditorMenu = new dijit.MenuItem({
            label:"模型配置",
            iconClass:"dijitIconEditTask",
            onClick:function(){
                if(process.locked){
                    return;
                }
                YD.setStyle(process.node,"display","none");
                var child = editorComponentMenu.connectedObj;
                var check = process.parentComponent;
                var isNew = false;
                var oldProcess = process;
                if(child.subProcess == null){
                    child.subProcess = new Sequence.Process({
                        type:"Process",
                        refNode: $("maincontent"),
                        pos: "last",
                        parentComponent:child
                    });
                    /!*child.subProcess.hideBorder();*!/
                    reg.registry(child.subProcess);
                    isNew = true;
                }
                process = child.subProcess;
                //层级
                var parentComponent = child;
                var parentProcess = parentComponent.parent;
                var location = "<b>"+parentComponent.name+"</b>";
                parentComponent = parentProcess.parentComponent;
                while(parentComponent!=null){
                    parentProcess = parentComponent.parent;
                    location = parentComponent.name + ">>" + location;
                    parentComponent = parentProcess.parentComponent;
                }
                location = parentProcess.name + ">>" + location;
                dojo.byId("location").innerHTML = location;
                //层级
                process.generateTreeNode(false);//树
                YD.setStyle(process.node,"display","block");
                process.validate();
                if(isNew)
                    process.sendNetMsg(0);
                if(check == null)
                    editorProcessMenu.addChild(returnParent);
                process = oldProcess;
                processChange(child.subProcess);
            }
        });
        var componentDataEditorMenu = new dijit.MenuItem({
            label:"数据配置",
            iconClass:"dijitIconEditProperty",
            onClick:function(){
                configuringComponent = editorComponentMenu.connectedObj;
                var setComponentPropertyDlg = dijit.byId("setComponentPropertyDlg");
                //这仅仅只是测试属性
                var property = document.getElementById("componentPropertyForm");
                setComponentPropertyDlg.show();
                if(configuringComponent.property[0]){
                    property.Property1.value = configuringComponent.property[0].data;
                    property.Property2.value = configuringComponent.property[1].data;
                    property.Property3.value = configuringComponent.property[2].data;
                    property.Property4.value = configuringComponent.property[3].data;
                    property.Property5.value = configuringComponent.property[4].data;
                    property.Property6.value = configuringComponent.property[5].data;
                    property.Property7.value = configuringComponent.property[6].data;
                }else{
                    property.Property1.value = "";
                    property.Property2.value = "";
                    property.Property3.value = "";
                    property.Property4.value = "";
                    property.Property5.value = "";
                    property.Property6.value = "";
                    property.Property7.value = "";
                }
                //这仅仅只是测试属性
            }
        });
        var subProcessDeleteMenu = new dijit.MenuItem({
            label:"删除子流程",
            iconClass:"dijitEditorIcon dijitEditorIconCancel",
            onClick:function(){
                var child = editorComponentMenu.connectedObj;
                //流程锁定
                canDelete = true;
                var subProcess = child.subProcess;
                var subProcessLocked = false;
                if(subProcess != null){
                    if(child.subProcess.locked){
                        subProcessLocked = true;
                    }
                    retrievalSubProcess(subProcess);
                }

                if(child.parent.locked || subProcessLocked || !canDelete){
                    return;
                }
                var length = (child.subProcess.children.length - 1)/3 - 1;
                for(var i = 0;i<length;i++){
                    var delChild = child.subProcess.children[3];
                    if(delChild instanceof Component){
                        delDraggableWhenDelComp(delChild);
                        delChild.sendNetMsg(-1);//发送删除消息
                        var parent = delChild.parent;
                        parent.removeChild(delChild);
                    }
                }
                child.subProcess.validate();
                //子流程删除消息
                child.subProcess.sendNetMsg(1);
                child.subProcess = null;
                process.validate();
            }
        });
        editorComponentMenu.addChild(componentEditorMenu);
        editorComponentMenu.addChild(componentDeleteMenu);
        editorComponentMenu.addChild(componentDataEditorMenu);
        editorComponentMenu.addChild(subProcessDeleteMenu);


        var editorBusConnectMenu = new dijit.Menu();

        var busConnectDeleteMenu = new dijit.MenuItem({
            label:"删除",
            iconClass:"dijitEditorIcon dijitEditorIconDelete",
            onClick:function(){
                var  comp = editorBusConnectMenu.connectedObj;
                comp.removeBusConnect();
                process.validate();
                //console.log("BusConnect in click");
            }
        });

        var busConnectDataEditorMenu = new dijit.MenuItem({
            label:"数据配置",
            iconClass:"dijitIconEditProperty",
            onClick:function(){
                if(bus.isConfigure){
                    var  comp = editorBusConnectMenu.connectedObj;
                    comp.busConnect.isConfigure = true;
                    process.validate();
                }else{
                    alert("请先配置总线！")
                }
            }
        });

        editorBusConnectMenu.addChild(busConnectDeleteMenu);
        editorBusConnectMenu.addChild(busConnectDataEditorMenu);

        var editorControlFlowMenu = new dijit.Menu();
        var controlFlowDeleteMenu = new dijit.MenuItem({
            label:"删除",
            iconClass:"dijitEditorIcon dijitEditorIconDelete",
            onClick:function(){
                var  comp = editorControlFlowMenu.connectedObj;
                process.removeControlFlow(comp);
                //comp.removeBusConnect();
                //console.log("BusConnect in click");
            }
        });
        editorControlFlowMenu.addChild(controlFlowDeleteMenu);

        //editorProcessMenu = new dijit.Menu();
        var freshenMenu = new dijit.MenuItem({
            label:"刷新",
            iconClass:"dijitIconUndo",
            onClick:function(){
                process.validate();
            }
        });
        var busConfigureMenu = new dijit.MenuItem({
            label:"总线配置",
            iconClass:"dijitIconConnector",
            onClick:function(){
                bus.isConfigure = true;
                process.validate();
            }
        });

        var layoutPopupMenu = dijit.byId("layoutPopupMenu");
        editorProcessMenu.addChild(freshenMenu);
        editorProcessMenu.addChild(busConfigureMenu);*/
        //editorProcessMenu.addChild(layoutPopupMenu);
        //editorProcessMenu.bindDomNode(dojo.byId("maincontent"));

        mainHandle = dojo.connect(dojo.byId("maincontent"),"mouseup",function(e){
            var clickedElement = e.target;
            var selectElementType;
            //如果当前正在拖拽，就返回，否则会提前清除Selection，导致_deactivateRegisteredDropZones方法出现BUG
            menuManager.busMenu.unBindDomNode(editorElement);
            menuManager.busMenu.connectedObj = null;
            menuManager.componentMenu.unBindDomNode(editorElement);
            menuManager.componentMenu.connectedObj = null;
            menuManager.busConnectMenu.unBindDomNode(editorElement);
            menuManager.busConnectMenu.connectedObj = null;
            menuManager.controlFlowMenu.unBindDomNode(editorElement);
            menuManager.controlFlowMenu.connectedObj = null;
            if(dndManager.dragging) return;
            var comp = getComponentByDomNode(clickedElement, true);
            if(comp){
                selectElementType = ControlUtil.prototype.selectComponent;
            }else{
                comp = getBusConnectByDomNode(clickedElement);
                if(comp){
                    selectElementType = ControlUtil.prototype.selectBusConnect;
                }else{
                    comp = getControlFlowByDomNode(clickedElement);
                    if(comp){
                        selectElementType = ControlUtil.prototype.selectControlFlow;
                    }else{
                        comp = getBusByDomNode(clickedElement);
                        if(comp){
                            selectElementType = ControlUtil.prototype.selectBus;
                        }else{
                            selectElementType = ControlUtil.prototype.selectOther;
                        }
                    }
                }
            }
            switch (e.button){
                case 0:
                    switch (selectElementType){
                        case ControlUtil.prototype.selectOther:
                            if(editorElement){
                                clearSelection(editorElement);
                                editorElement = null
                            }
                            break;
                        case ControlUtil.prototype.selectComponent:
                            if(editorElement != comp.componentNode){
                                clearSelection(editorElement);
                                editorElement = comp.componentNode;//选中组件
                                editorElement.style.backgroundColor = ControlUtil.prototype.selectColor;
                            }
                            break;
                        case ControlUtil.prototype.selectBusConnect:
                            if(editorElement != comp.busConnect.node){
                                clearSelection(editorElement);
                                editorElement = comp.busConnect.node;
                                editorElement.style.backgroundColor = ControlUtil.prototype.selectColor;
                            }
                            break;
                        case ControlUtil.prototype.selectControlFlow:
                            if(editorElement != comp.node){
                                clearSelection(editorElement);
                                editorElement = comp.node;
                                editorElement.style.backgroundColor = ControlUtil.prototype.selectColor;
                            }
                            break;
                        case ControlUtil.prototype.selectBus:
                            if(editorElement != comp.node){
                                clearSelection(editorElement);
                                editorElement = comp.node;
                                bus.select(true);
                            }
                            break;
                    }
                    break;
                case 1:
                    switch (selectElementType){
                        case ControlUtil.prototype.selectOther:
                            if(editorElement){
                                clearSelection(editorElement);
                                editorElement = null
                            }
                            break;
                        case ControlUtil.prototype.selectComponent:
                            if(editorElement != comp.componentNode){
                                clearSelection(editorElement);
                                editorElement = comp.componentNode;//选中组件
                                editorElement.style.backgroundColor = ControlUtil.prototype.selectColor;
                            }
                            break;
                        case ControlUtil.prototype.selectBusConnect:
                            if(editorElement != comp.busConnect.node){
                                clearSelection(editorElement);
                                editorElement = comp.busConnect.node;
                                editorElement.style.backgroundColor = ControlUtil.prototype.selectColor;
                            }
                            break;
                        case ControlUtil.prototype.selectControlFlow:
                            if(editorElement != comp.node){
                                clearSelection(editorElement);
                                editorElement = comp.node;
                                editorElement.style.backgroundColor = ControlUtil.prototype.selectColor;
                            }
                            break;
                        case ControlUtil.prototype.selectBus:
                            if(editorElement != comp.node){
                                clearSelection(editorElement);
                                editorElement = comp.node;
                                bus.select(true);
                            }
                            break;
                    }
                    break;
                case 2:
                    switch (selectElementType){
                        case ControlUtil.prototype.selectOther:
                            clearSelection(editorElement);
                            editorElement = null;
                            break;
                        case ControlUtil.prototype.selectComponent:
                            if(editorElement == comp.componentNode){
                                menuManager.componentMenu.bindDomNode(editorElement);
                                menuManager.componentMenu.connectedObj = comp;
                                if(comp.subProcess != null){
                                    menuManager.componentMenu.getChildren()[4].set("disabled",false);
                                }else{
                                    menuManager.componentMenu.getChildren()[4].set("disabled",true);
                                }
                                if(comp.type == "Custom"){
                                    menuManager.componentMenu.getChildren()[3].set("disabled",false);
                                    menuManager.componentMenu.getChildren()[4].set("disabled",false);
                                }else{
                                    menuManager.componentMenu.getChildren()[3].set("disabled",true);
                                    menuManager.componentMenu.getChildren()[4].set("disabled",true);
                                }
                                var paComp = comp.parent.parentComponent;
                                if(paComp == null){
                                    menuManager.componentMenu.getChildren()[2].set("disabled",false);
                                }else{
                                    menuManager.componentMenu.getChildren()[2].set("disabled",true);
                                }
                            }else{
                                clearSelection(editorElement);
                                editorElement = null;
                            }
                            break;
                        case ControlUtil.prototype.selectBusConnect:
                            if(editorElement == comp.busConnect.node){
                                menuManager.busConnectMenu.bindDomNode(editorElement);
                                menuManager.busConnectMenu.connectedObj = comp;
                            }else{
                                clearSelection(editorElement);
                                editorElement = null;
                            }
                            break;
                        case ControlUtil.prototype.selectControlFlow:
                            if(editorElement == comp.node){
                                menuManager.controlFlowMenu.bindDomNode(editorElement);
                                menuManager.controlFlowMenu.connectedObj = comp;
                            }else{
                                clearSelection(editorElement);
                                editorElement = null;
                            }
                            break;
                        case ControlUtil.prototype.selectBus:
                            if(editorElement == comp.node){
                                menuManager.busMenu.bindDomNode(editorElement);
                                menuManager.busMenu.connectedObj = comp;
                            }else{
                                clearSelection(editorElement);
                                editorElement = null;
                            }
                            break;
                    }
                    break;
                case 3:
                    break;
                case 4:
                    break;
                default:
                    break;
            }
            /*            if(isClickedWhiteSpace(clickedElement)) {
             clearSelection(editorElement);
             }
             var comp = getComponentByDomNode(clickedElement, true);
             editorComponentMenu.unBindDomNode(editorElement);
             editorComponentMenu.connectedObj = null;
             editorBusConnectMenu.unBindDomNode(editorElement);
             editorBusConnectMenu.connectedObj = null;
             editorControlFlowMenu.unBindDomNode(editorElement);
             editorControlFlowMenu.connectedObj = null;
             switch (e.button){
             case 0:
             if(isControlFlow(editorElement)){
             editorElement.style.backgroundColor = util.unSelectTransparentColor;
             }
             if(comp){
             if(!editorMenuType){
             editorElement = comp.componentNode;//选中元素
             //comp.busConnect.node.style.backgroundColor = "#FFFFFF";
             editorElement.style.backgroundColor = util.selectColor;
             }
             }else{
             comp = getBusConnectByDomNode(clickedElement);
             if(comp){
             /!*if(isControlFlow(editorElement)){
             editorElement.style.backgroundColor = editorElement.backgroundColor;
             }*!/
             if(!editorMenuType){
             editorElement = comp.busConnect.node;
             //comp.componentNode.style.backgroundColor = "#c0c0c0";
             editorElement.style.backgroundColor = util.selectColor;
             }
             }else{
             comp = getControlFlowByDomNode(clickedElement);
             if(comp){
             /!*if(isControlFlow(editorElement)){
             editorElement.style.backgroundColor = editorElement.backgroundColor;
             }*!/
             clearSelection(editorElement);
             editorElement = comp;
             //editorElement.backgroundColor = editorElement.style.backgroundColor;
             editorElement.style.backgroundColor = util.selectColor;
             editorMenuType = false;
             }else{
             /!*clearSelection(/!*editorElement*!/);*!/
             }
             }
             }
             break;
             case 1:
             if(isControlFlow(editorElement)){
             editorElement.style.backgroundColor = util.unSelectTransparentColor;
             }
             if(comp){
             /!* if(isControlFlow(editorElement)){
             editorElement.style.backgroundColor = editorElement.backgroundColor;
             }*!/
             if(!editorMenuType){
             editorElement = comp.componentNode;//选中元素
             //comp.busConnect.node.style.backgroundColor = "#FFFFFF";
             editorElement.style.backgroundColor = util.selectColor;
             }
             }else{
             comp = getBusConnectByDomNode(clickedElement);
             if(comp){
             /!*if(isControlFlow(editorElement)){
             editorElement.style.backgroundColor = editorElement.backgroundColor;
             }*!/
             if(!editorMenuType){
             editorElement = comp.busConnect.node;
             //comp.componentNode.style.backgroundColor = "#c0c0c0";
             editorElement.style.backgroundColor = util.selectColor;
             }
             }else{
             comp = getControlFlowByDomNode(clickedElement);
             if(comp){
             /!*if(isControlFlow(editorElement)){
             editorElement.style.backgroundColor = editorElement.backgroundColor;
             }*!/
             clearSelection(editorElement);
             editorElement = comp;
             editorElement.backgroundColor = editorElement.style.backgroundColor;
             editorElement.style.backgroundColor = "#3399FF";
             editorMenuType = false;
             }else{
             /!*clearSelection(/!*editorElement*!/);*!/
             }
             }
             }
             break;
             case 2:
             if(editorMenuType==false) {
             if(comp){
             if(editorElement==comp.componentNode){
             editorComponentMenu.bindDomNode(editorElement);
             editorComponentMenu.connectedObj = comp;
             if(comp.subProcess != null){
             editorComponentMenu.getChildren()[3].set("disabled",false);
             }else{
             editorComponentMenu.getChildren()[3].set("disabled",true);
             }
             }else{
             clearSelection(editorElement);
             }
             }else{
             if(isBusConnect(editorElement)){
             comp = getBusConnectByDomNode(clickedElement);
             if(comp){
             if(editorElement == comp.busConnect.node){
             editorBusConnectMenu.bindDomNode(editorElement);
             editorBusConnectMenu.connectedObj = comp;
             //console.log("BusConnect in click");
             }else{
             clearSelection(editorElement);
             }
             }else{
             clearSelection(editorElement);
             }
             }else if(isControlFlow(editorElement)){
             comp = getControlFlowByDomNode(clickedElement);
             if(editorElement == comp){
             editorControlFlowMenu.bindDomNode(editorElement);
             editorControlFlowMenu.connectedObj = comp;
             //console.log("ControlFlow in click");
             }else{
             clearSelection(editorElement);
             }
             }else{
             clearSelection(editorElement);
             }
             }
             }else {
             editorProcessMenu.bindDomNode(dojo.byId("maincontent"));
             }
             break;
             case 3:

             break;
             case 4:

             break;
             default:

             break;
             }*/
        });
        process.connects.push(mainHandle);
        process.keyHolder.push(userName);
    },
    _createProcessTree:function(){
        processTree = new ProcessTree();
        process.generateTreeNode(false);
        processTree.onCreate();
       /* var treeContextMenu = new dijit.Menu();
        treeContextMenu.addChild(new dijit.MenuItem({
            label:"删除",
            iconClass:"dijitEditorIcon dijitEditorIconDelete",
            onClick:function(){
                var child = treeContextMenu.connectedObj;
                //流程锁定
                canDelete = true;
                var subProcess = child.subProcess;
                var subProcessLocked = false;
                if(subProcess != null){
                    if(child.subProcess.locked){
                        subProcessLocked = true;
                    }
                    retrievalSubProcess(subProcess);
                }

                if(child.parent.locked || subProcessLocked || !canDelete){
                    return;
                }
                //流程锁定
                delDraggableWhenDelComp(child);
                var parent = child.parent;
                child.sendNetMsg(-1);//发送删除消息
                parent.removeChild(child);
                process.validate();
            }
        }));



        treeContextMenu.addChild(new dijit.MenuItem({
            label:"跳转到此流程",
            iconClass:"dijitEditorIcon dijitEditorIconTabIndent",
            onClick:function(){
                var comp = treeContextMenu.connectedObj;
                var flag = true;
                var parentComponent = comp;
                var location = "";
                var parentProcess ;
                while(parentComponent != null){
                    parentProcess = parentComponent.parent;

                    if(parentProcess == process){
                        var flag0 = false;
                        if(process.parentComponent == null){
                            flag0 = true;
                        }
                        YD.setStyle(process.node,"display","none");
                        //process = comp.parent;
                        processChange(comp.parent);
                        YD.setStyle(process.node,"display","block");
                        process.validate();
                        var check = process.parentComponent;
                        //层级
                        if(check == null)
                            dojo.byId("location").innerHTML = "<b>"+ process.name + "</b>";//层级
                        else{
                            //层级
                            parentComponent = process.parentComponent;
                            parentProcess = parentComponent.parent;
                            location = "<b>"+parentComponent.name+"</b>";
                            parentComponent = parentProcess.parentComponent;
                            while(parentComponent!=null){
                                parentProcess = parentComponent.parent;
                                location = parentComponent.name + ">>" + location;
                                parentComponent = parentProcess.parentComponent;
                            }
                            location = parentProcess.name + ">>" + location;
                            dojo.byId("location").innerHTML = location;
                            //层级
                            if(flag0){
                                if(editorProcessMenu.getChildren().length<3)
                                    editorProcessMenu.addChild(returnParent);
                            }
                        }
                        //层级

                        flag = false;
                        break;
                    }
                    parentComponent = parentProcess.parentComponent;
                }
                if(flag){
                    parentProcess = process;
                    parentComponent = process.parentComponent;
                    var checkProcess = comp.parent;
                    while(parentComponent != null){
                        if(parentProcess == checkProcess){
                            flag = true;
                            break;
                        }
                        returnParent.onClick();
                        parentProcess = parentComponent.parent;
                        parentComponent = parentProcess.parentComponent;
                        flag = false;
                    }
                }
                if( !flag && comp.parent.parentComponent != null ){
                    if(editorProcessMenu.getChildren().length<3)
                        editorProcessMenu.addChild(returnParent);
                    YD.setStyle(process.node,"display","none");
                    //process = comp.parent;
                    processChange(comp.parent);
                    YD.setStyle(process.node,"display","block");
                    //层级
                    parentComponent = process.parentComponent;
                    parentProcess = parentComponent.parent;
                    location = "<b>"+parentComponent.name+"</b>";
                    parentComponent = parentProcess.parentComponent;
                    while(parentComponent!=null){
                        parentProcess = parentComponent.parent;
                        location = parentComponent.name + ">>" + location;
                        parentComponent = parentProcess.parentComponent;
                    }
                    location = parentProcess.name + ">>" + location;
                    dojo.byId("location").innerHTML = location;
                    //层级
                    process.validate();
                }
            }
        }));
        treeContextMenu.addChild(new dijit.MenuItem({
            label:"删除子流程",
            iconClass:"dijitEditorIcon dijitEditorIconCancel",
            onClick:function(){
                var child = treeContextMenu.connectedObj;
                //流程锁定
                canDelete = true;
                var subProcess = child.subProcess;
                var subProcessLocked = false;
                if(subProcess != null){
                    if(child.subProcess.locked){
                        subProcessLocked = true;
                    }
                    retrievalSubProcess(subProcess);
                }

                if(child.parent.locked || subProcessLocked || !canDelete){
                    return;
                }
                //流程锁定
                var length = (child.subProcess.children.length - 1)/3 - 1;
                for(var i = 0;i<length;i++){
                    var delChild = child.subProcess.children[3];
                    if(delChild instanceof Component){
                        delDraggableWhenDelComp(delChild);
                        delChild.sendNetMsg(-1);//发送删除消息
                        var parent = delChild.parent;
                        parent.removeChild(delChild);
                    }
                }
                child.subProcess.validate();
                //子流程删除消息
                child.subProcess.sendNetMsg(1);
                child.subProcess = null;
                process.validate();
            }
        }));
        treeContextMenu.bindDomNode(processTree.tree.domNode);
        dojo.connect(treeContextMenu, "_openMyself", processTree.tree, function(e){
            var tn = dijit.getEnclosingWidget(e.target);
            var comp = reg.getComponentByName(tn.label);
            //将当前选中的组件的引用记录下来
            treeContextMenu.connectedObj = comp;
            //如果选中的是Process，禁用删除菜单

            //检查禁用
            if(comp!=null){
                var flag = false;
                var parentComponent = process.parentComponent;
                var parentProcess = process ;
                var checkProcess = comp.subProcess;
                while(parentComponent!=null){
                    if(checkProcess == parentProcess){
                        flag = true;
                        break;
                    }
                    parentProcess = parentComponent.parent;
                    parentComponent = parentProcess.parentComponent;
                }
            }
            //检查禁用

            if(comp instanceof Sequence.Process){
                treeContextMenu.getChildren()[0].set("disabled",true/!*"display","none"*!/);
                treeContextMenu.getChildren()[1].set("disabled",true);
                treeContextMenu.getChildren()[2].set("disabled",true);
            }
            else if(!comp){
                treeContextMenu.getChildren()[0].set("disabled",true);
                treeContextMenu.getChildren()[1].set("disabled",true);
                treeContextMenu.getChildren()[2].set("disabled",true);
            }
            else if(flag){
                treeContextMenu.getChildren()[0].set("disabled",true);
                treeContextMenu.getChildren()[1].set("disabled",false);
                treeContextMenu.getChildren()[2].set("disabled",true);
            }
            else{
                treeContextMenu.getChildren()[0].set("disabled",false);
                treeContextMenu.getChildren()[1].set("disabled",false);
                if(comp.subProcess == null){
                    treeContextMenu.getChildren()[2].set("disabled",true);
                }else{
                    treeContextMenu.getChildren()[2].set("disabled",false);
                }
            }
        });*/
    },
    _initialTimeConfigureGrid:function(){
        //if(!(timeConfigureGrid instanceof TimeConfigureGrid)){
            timeConfigureGrid = new TimeConfigureGrid();
            timeConfigureGrid.onCreate();
        //}
    },
    sendNetMsg:function(operate,additiveAttribute){
        switch (operate){
            case NetMsgUtil.prototype.msgNew:
                var msg = new NetMsg(NetMsgUtil.prototype.msgNew,this,null);
                msg.msgSend();
                break;
            case NetMsgUtil.prototype.msgChange:
                /*if(additiveAttribute[0] == "version"){
                    var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,["version",additiveAttribute[1]]);
                    msg.msgSend();
                }else if(additiveAttribute[0] == "timeConfigure"){
                    var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,["timeConfigure",additiveAttribute[1]]);
                    msg.msgSend();
                }*/
                var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,additiveAttribute);
                msg.msgSend();
                break;
            case NetMsgUtil.prototype.msgDelete:

                break;
        }
    },
    _checkUniqueness:function(value){
        for(var i = 0;i < this.timeConfigure.length;i++){
            if(this.timeConfigure[i].time == value){
                return false;
            }
        }
        return true;
    },
    addTimeConfigureItem:function(value){
        if(this._checkUniqueness(value)){
            this.timeConfigure.push({time:value,model:0});
        }
    },
    removeTimeConfigureItem:function(value){
        for(var i = 0;i<this.timeConfigure.length;i++){
            if(value == this.timeConfigure[i].time){
                this.timeConfigure.splice(i,1);
                return true;
            }
        }
        return false;
    },
    updateTimeConfigureDlg:function(index){
        var timeConfigureMultiSelect = dojo.byId('timeConfigureMultiSelect');
        var length = timeConfigureMultiSelect.childNodes.length;
        for(var i = 0;i < length;i++){
            timeConfigureMultiSelect.removeChild(timeConfigureMultiSelect.childNodes[0]);
        }
        for(i = 0;i < os.timeConfigure.length;i++){
            var option = window.document.createElement('option');
            option.innerHTML = os.timeConfigure[i].time;
            option.value = i;
            if(os.timeConfigure[i].model != 0){
                dojo.addClass(option,"cannotDelete");
            }
            option.selected = false;
            if(i == index){
                option.selected = true;
            }
            timeConfigureMultiSelect.appendChild(option);
        }
    },
    addTimeConfigureItemDlg:function(){
        var index = parseInt(dijit.byId('timeConfigureMultiSelect').get('value'));
        var value = parseFloat(dijit.byId('timeConfigureNew').get('value'));
        if(value){
            var temp = [];
            if(!this._checkUniqueness(value)){
                alert("请勿输入重复值！");
                return false;
            }
            for(var i = 0;i < os.timeConfigure.length;i++){
                temp.push(os.timeConfigure[i]);
                if(i == index){
                    temp.push({time:value,model:0});
                }
            }
            os.timeConfigure = temp;
            if((!index)&&(index!=0)){
                this.addTimeConfigureItem(value);
            }
            this.updateTimeConfigureDlg(index);
        }else{
            alert("请输入有效值！");
        }
    },
    removeTimeConfigureItemDlg:function(){
        var index = parseFloat(dijit.byId('timeConfigureMultiSelect').get('value'));
        if(!isNaN(index)) {
            if (os.timeConfigure[index].model != 0) {
                alert("不可移除此时间片！");
                return;
            }
            os.timeConfigure.splice(index, 1);
            this.updateTimeConfigureDlg(index - 1);
        }
    },
    upTimeConfigureItemDlg:function(){
        var index = parseFloat(dijit.byId('timeConfigureMultiSelect').get('value'));
        if(index){
            var temp = os.timeConfigure[index - 1];
            os.timeConfigure[index - 1] = os.timeConfigure[index];
            os.timeConfigure[index] = temp;
            this.updateTimeConfigureDlg(index - 1);
        }
    },
    downTimeConfigureItemDlg:function(){
        var index = parseFloat(dijit.byId('timeConfigureMultiSelect').get('value'));
        var timeConfigureMultiSelect = dojo.byId('timeConfigureMultiSelect');
        var length = timeConfigureMultiSelect.childNodes.length;
        if(index < length-1){
            var temp = os.timeConfigure[index + 1];
            os.timeConfigure[index + 1] = os.timeConfigure[index];
            os.timeConfigure[index] = temp;
            this.updateTimeConfigureDlg(index + 1);
        }
    },
    timeConfigureChangeApplyDlg:function(){
        if(this.timeConfigure.length == 0){
            alert("操作系统时间片不能为空！");
            return;
        }
        switch (mainFrame.status){
            case ControlUtil.prototype.statusPrepare:
                menuManager.globalMenu.removeChild(0);
                menuManager.globalMenu.removeChild(0);
                dojo.removeClass(this.node,"notConfigure");
                this.isConfigure = true;
                this._initialProject();
                timeConfigureGrid.rebuildGridLayout();
                os.sendNetMsg(NetMsgUtil.prototype.msgChange,["version",this.version]);
                os.sendNetMsg(NetMsgUtil.prototype.msgChange,["timeConfigure",this.oldTimeConfigure]);
                break;
            case ControlUtil.prototype.statusReady:
                timeConfigureGrid.rebuildGridLayout();
                os.sendNetMsg(NetMsgUtil.prototype.msgChange,["timeConfigure",this.oldTimeConfigure]);
                break;
        }
        dijit.byId("OSTimeConfigureDlg").hide();
        this.oldTimeConfigure = [];
        for(var i = 0;i < this.timeConfigure.length;i++){
            this.oldTimeConfigure.push(this.timeConfigure[i]);
        }
    },
    /*timeConfigureChangeClosedDlg:function(){
        if(confirm("确认放弃修改？")){
            this.timeConfigureChangeAbolishDlg();
        }else{

        }
    },*/
    timeConfigureChangeAbolishDlg:function(){
        this.timeConfigure = [];
        for(var i = 0;i < this.oldTimeConfigure.length;i++){
            this.timeConfigure.push(this.oldTimeConfigure[i]);
        }
        switch (mainFrame.status){
            case ControlUtil.prototype.statusPrepare:

                break;
            case ControlUtil.prototype.statusReady:
                timeConfigureGrid.rebuildGridLayout();
                break;
        }
        dijit.byId("OSTimeConfigureDlg").hide();
    },
    addConfigureTimeModel:function(time){
        for(var i = 0;i < this.timeConfigure.length;i++){
            if(this.timeConfigure[i].time == time){
                this.timeConfigure[i].model += 1;
                return;
            }
        }
    },
    removeConfigureTimeModel:function(time){
        for(var i = 0;i < this.timeConfigure.length;i++){
            if(this.timeConfigure[i].time == time){
                this.timeConfigure[i].model -= 1;
                return;
            }
        }
    }
});

