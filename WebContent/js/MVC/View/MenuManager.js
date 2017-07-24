/**
 * @author LancelotWG
 * 菜单管理类
 */
dojo.require("dojo.Stateful");
dojo.declare("MenuManager",dojo.Stateful,{
    //全局菜单
    globalMenu:null,
    //总线菜单
    busMenu:null,
    //组件菜单
    componentMenu:null,
    //总线交联菜单
    busConnectMenu:null,
    //传输控制菜单
    controlFlowMenu:null,
    //树菜单
    treeContextMenu:null,
    //返回父流程
    returnParentMenuItem:null,
    //人员权限调整

    constructor: function(){
        this.globalMenu = dijit.Menu();
        this.busMenu = dijit.Menu();
        this.componentMenu = dijit.Menu();
        this.busConnectMenu = dijit.Menu();
        this.controlFlowMenu = dijit.Menu();
        this.treeContextMenu = dijit.Menu();
    },
    createMenu:function(stage){
        switch (stage){
            case ControlUtil.prototype.createOS:
                mainFrame.status = ControlUtil.prototype.statusBlank;
                this._initialGlobalMenuUnOS();
                break;
            case ControlUtil.prototype.configureOS:
                mainFrame.status = ControlUtil.prototype.statusPrepare;
                this._initialGlobalMenuOS();
                break;
            case ControlUtil.prototype.createProject:
                mainFrame.status = ControlUtil.prototype.statusReady;
                this._initialGlobalMenu();
                this.initialLoadBusMenu();
                this._initialComponentMenu();
                this._initialBusConnectMenu();
                this._initialControlFlowMenu();
                this._initialTreeContextMenu();
                break;
        }
    },
    _initialGlobalMenuUnOS:function(){
        var freshenMenu = new dijit.MenuItem({
            label:"刷新",
            iconClass:"dijitIconUndo",
            onClick:function(){
                //刷新操作
                mainFrame.OSPlaceholder.node.style.display = "block";
                var newX = YD.getX(mainFrame.OSPlaceholder.refNode) - mainFrame.OSPlaceholder.refNode.scrollLeft;
                var newY = YD.getY(mainFrame.OSPlaceholder.refNode) - mainFrame.OSPlaceholder.refNode.scrollTop;
                YD.setXY(mainFrame.OSPlaceholder.node,[newX,newY]);
                newX = YD.getX(mainFrame.OSPlaceholder.refNode) - mainFrame.OSPlaceholder.refNode.scrollLeft;
                newY = YD.getY(mainFrame.OSPlaceholder.refNode) - mainFrame.OSPlaceholder.refNode.scrollTop;
                var height = mainFrame.OSPlaceholder.refNode.offsetHeight;
                var width = mainFrame.OSPlaceholder.refNode.scrollWidth;
                var x = newX + width/2 - mainFrame.OSPlaceholder.defaultSize[0]/2;
                var y = newY + height/8 - mainFrame.OSPlaceholder.defaultSize[1]/2;
                YD.setXY(mainFrame.OSPlaceholder.node,[x,y]);
                mainFrame.OSPlaceholder.node.style.display = "none";
                //刷新操作
            }
        });
        this.globalMenu.addChild(freshenMenu);
        this.globalMenu.bindDomNode(dojo.byId("maincontent"));
    },
    _initialGlobalMenuOS:function(){
        this.globalMenu.removeChild(0);
        var freshenMenu = new dijit.MenuItem({
            label:"刷新",
            iconClass:"dijitIconUndo",
            onClick:function(){
                //OS界面刷新操作
                os.freshen();
                //OS界面刷新操作
            }
        });
        var osConfigureMenu = new dijit.MenuItem({
            label:"OS配置",
            iconClass:"dijitIconFunction",
            onClick:function(){
                //OS配置操作
                /*menuManager.globalMenu.removeChild(0);
                menuManager.globalMenu.removeChild(0);*/
                if(roleControl(0, null)) {
                    os.configuring();
                }else{
                    alert("对不起！您无权限配置操作系统。");
                }
                /*os.initialProject();*/
                /*os.sendNetMsg(NetMsgUtil.prototype.msgChange);*/
                //OS配置操作
            }
        });
        this.globalMenu.addChild(freshenMenu);
        this.globalMenu.addChild(osConfigureMenu);
    },
    _initialGlobalMenu:function(){
        var freshenMenu = new dijit.MenuItem({
            label:"刷新",
            iconClass:"dijitIconUndo",
            onClick:function(){
                process.validate();
            }
        });
        var osConfigureTimeMenu = new dijit.MenuItem({
            label:"配置操作系统时间片",
            iconClass:"dijitIconFunction",
            onClick:function(){
                if(roleControl(0, null)){
                    os.timeConfiguring();
                }else{
                    alert("对不起！您无权限配置操作系统时间片。");
                }
            }
        });
        var codeCreateMenu = new dijit.MenuItem({
            label:"代码生成",
            iconClass:"dijitIconFile",
            onClick:function(){
                //代码生成
                os.codeGeneration();
                //代码生成
            }
        });
        this.globalMenu.addChild(freshenMenu);
        this.globalMenu.addChild(osConfigureTimeMenu);
        this.globalMenu.addChild(codeCreateMenu);
    },
    initialLoadBusMenu:function(){
      var busLoadMenu = new dijit.MenuItem({
          label:"导入总线",
          iconClass:"dijitIconConnector",
          onClick:function(){
              if(roleControl(0, null)){
                bus.configuring();
              }else{
                  alert("对不起！您无权限导入总线。");
              }
          }
      });
      this.busMenu.addChild(busLoadMenu);
    },
    initialBusMenu:function(){
        var busDataEditorMenu = new dijit.MenuItem({
            label:"编辑总线",
            iconClass:"dijitIconEditProperty",
            onClick:function(){
                //修改
                if(roleControl(0, null)){
                    bus.busEditor();
                }else{
                    alert("对不起！您无权限编辑总线。");
                }
                //修改
            }
        });
        var busDeleteMenu = new dijit.MenuItem({
            label:"删除总线",
            iconClass:"dijitEditorIcon dijitEditorIconCancel",
            onClick:function(){
                //删除现有总线
                if(roleControl(0, null)) {
                    bus.deleteBus();
                }else{
                    alert("对不起！您无权限删除总线。");
                }
                //删除现有总线
            }
        });
        this.busMenu.addChild(busDataEditorMenu);
        this.busMenu.addChild(busDeleteMenu);
    },
    _initialComponentMenu:function(){
        this.returnParentMenuItem = new dijit.MenuItem({
            label:"返回父级流程",
            iconClass:"dijitIconEditProperty",
            onClick:function(){
                YD.setStyle(process.node,"display","none");
                var check = process.parentComponent.parent.parentComponent;
                //process = process.parentComponent.parent;
                processChange(process.parentComponent.parent);
                if(check == null)
                    menuManager.globalMenu.removeChild(3);
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
                    while(parentComponent != null){
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
                var child = menuManager.componentMenu.connectedObj;
                var component0 = process.parentComponent;
                if(component0 == null){
                    //软件系统主管
                    if(roleControl(0, null)){

                    }else{
                        alert("对不起！您无权限删除该模块。");
                        return ;
                    }
                }else{
                    var component1 = process.parentComponent.parent.parentComponent;
                    if(component1 == null){
                        //软件构件主管
                        if(roleControl(1, component0.type)){

                        }else{
                            alert("对不起！您无权限删除该模块。");
                            return ;
                        }
                    }else{
                        //软件设计人员
                        if(roleControl(2, null)){

                        }else{
                            alert("对不起！您无权限删除该模块。");
                            return ;
                        }
                    }
                }
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
                    child.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);//发送删除消息
                    menuManager.componentMenu.unBindDomNode(menuManager.componentMenu.connectedObj.node);
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
                var child = menuManager.componentMenu.connectedObj;
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
                    /*child.subProcess.hideBorder();*/
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
                    process.sendNetMsg(NetMsgUtil.prototype.msgNew,null);
                if(check == null)
                    menuManager.globalMenu.addChild(menuManager.returnParentMenuItem);
                process = oldProcess;
                processChange(child.subProcess);
            }
        });
        var componentDataEditorMenu = new dijit.MenuItem({
            label:"数据配置",
            iconClass:"dijitIconEditProperty",
            onClick:function(){
                configuringComponent = menuManager.componentMenu.connectedObj;
                var component0 = process.parentComponent;
                if(component0 == null){
                    //软件构件主管
                    if(roleControl(1, configuringComponent.type)){

                    }else{
                        alert("对不起！您无权限配置该模块数据。");
                        return ;
                    }
                }else{
                    alert("该模块数据无需配置！");
                    return ;
                }
                configuringComponent.dataConfigure();
                //
                //var setComponentPropertyDlg = dijit.byId("setComponentPropertyDlg");
                //这仅仅只是测试属性
                /*var property = document.getElementById("componentPropertyForm");
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
                }*/
                //这仅仅只是测试属性
            }
        });
        var subProcessDeleteMenu = new dijit.MenuItem({
            label:"删除子流程",
            iconClass:"dijitEditorIcon dijitEditorIconCancel",
            onClick:function(){
                var child = menuManager.componentMenu.connectedObj;
                //流程锁定
                var component0 = process.parentComponent;
                if(component0 == null){
                    //软件系统主管
                    if(roleControl(0, null)){

                    }else{
                        alert("对不起！您无权限删除该模块子流程。");
                        return ;
                    }
                }else{
                    var component1 = process.parentComponent.parent.parentComponent;
                    if(component1 == null){
                        //软件构件主管
                        if(roleControl(1, component0.type)){

                        }else{
                            alert("对不起！您无权限删除该模块子流程。");
                            return ;
                        }
                    }else{
                        //软件设计人员
                        if(roleControl(2, null)){

                        }else{
                            alert("对不起！您无权限删除该模块子流程。");
                            return ;
                        }
                    }
                }
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
                    alert("无法删除该模块子模块！");
                    return;
                }
                var length = (child.subProcess.children.length - 1)/2 - 1;
                for(var i = 0;i<length;i++){
                    var delChild = child.subProcess.children[2];
                    if(delChild instanceof Component){
                        delDraggableWhenDelComp(delChild);
                        delChild.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);//发送删除消息
                        var parent = delChild.parent;
                        parent.removeChild(delChild);
                    }
                }
                child.subProcess.validate();
                //子流程删除消息
                child.subProcess.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);
                child.subProcess = null;
                process.validate();
            }
        });
        var componentDataDefinitionMenu = new dijit.MenuItem({
            label:"定义模块数据",
            iconClass:"dijitIconDocuments",
            onClick:function(){
                //定义模块数据
                var child = menuManager.componentMenu.connectedObj;
                var component0 = process.parentComponent;
                if(component0 == null){
                    //软件系统主管
                    alert("对不起！您无权限定义自定义模块数据。");
                    return ;
                }else{
                    var component1 = process.parentComponent.parent.parentComponent;
                    if(component1 == null){
                        //软件构件主管
                        if(roleControl(1, component0.type)){

                        }else{
                            alert("对不起！您无权限定义该自定义模块数据。");
                            return ;
                        }
                    }else{
                        //软件设计人员
                        alert("对不起！您无权限定义自定义模块数据。");
                        return ;

                    }
                }
                child.componentDataDefinition();
                //定义模块数据
            }
        });
        var componentCodeEditorMenu = new dijit.MenuItem({
            label:"编辑模块代码",
            iconClass:"dijitIconEdit",
            onClick:function(){
                //编辑模块代码
                var child = menuManager.componentMenu.connectedObj;
                child.componentCodeEditor();
                //编辑模块代码
            }
        });
        this.componentMenu.addChild(componentEditorMenu);
        this.componentMenu.addChild(componentDeleteMenu);
        this.componentMenu.addChild(componentDataEditorMenu);
        this.componentMenu.addChild(componentDataDefinitionMenu);
        this.componentMenu.addChild(componentCodeEditorMenu);
        this.componentMenu.addChild(subProcessDeleteMenu);
    },
    _initialBusConnectMenu:function(){
        var busConnectDeleteMenu = new dijit.MenuItem({
            label:"删除",
            iconClass:"dijitEditorIcon dijitEditorIconDelete",
            onClick:function(){
                var  comp = menuManager.busConnectMenu.connectedObj;
                var component0 = process.parentComponent;
                if(component0 == null){
                    //软件系统主管
                    if(roleControl(0, null)){

                    }else{
                        alert("对不起！您无权限删除该总线交联。");
                        return ;
                    }
                }else{
                    var component1 = process.parentComponent.parent.parentComponent;
                    if(component1 == null){
                        //软件构件主管
                        if(roleControl(1, component0.type)){

                        }else{
                            alert("对不起！您无权限删除该总线交联。");
                            return ;
                        }
                    }else{
                        //软件设计人员
                        if(roleControl(2, null)){

                        }else{
                            alert("对不起！您无权限删除该总线交联。");
                            return ;
                        }
                    }
                }
                comp.busConnect.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);
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
                    var  comp = menuManager.busConnectMenu.connectedObj;
                    var component0 = process.parentComponent;
                    if(component0 == null){
                        //软件系统主管
                        if(roleControl(0, null)){

                        }else{
                            alert("对不起！您无权限配置总线交联数据。");
                            return ;
                        }
                    }else{
                        var component1 = process.parentComponent.parent.parentComponent;
                        if(component1 == null){
                            //软件构件主管
                            if(roleControl(1, component0.type)){

                            }else{
                                alert("对不起！您无权限配置总线交联数据。");
                                return ;
                            }
                        }else{
                            //软件设计人员
                            if(roleControl(2, null)){

                            }else{
                                alert("对不起！您无权限配置总线交联数据。");
                                return ;
                            }
                        }
                    }
                    comp.busConnect.configuring();
                }else{
                    alert("请先导入总线！")
                }
            }
        });
        this.busConnectMenu.addChild(busConnectDeleteMenu);
        this.busConnectMenu.addChild(busConnectDataEditorMenu);
    },
    _initialControlFlowMenu:function(){
        var controlFlowDeleteMenu = new dijit.MenuItem({
            label:"删除",
            iconClass:"dijitEditorIcon dijitEditorIconDelete",
            onClick:function(){
                var  comp = menuManager.controlFlowMenu.connectedObj;
                comp.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);
                process.removeControlFlow(comp);
                //comp.removeBusConnect();
                //console.log("BusConnect in click");
            }
        });
        this.controlFlowMenu.addChild(controlFlowDeleteMenu);
    },
    _initialTreeContextMenu:function(){
        var treeContextDeleteMenu = new dijit.MenuItem({
            label:"删除",
            iconClass:"dijitEditorIcon dijitEditorIconDelete",
            onClick:function(){
                var child = menuManager.treeContextMenu.connectedObj;
                var component0 = child.parent.parentComponent;
                if(component0 == null){
                    //软件系统主管
                    if(roleControl(0, null)){

                    }else{
                        alert("对不起！您无权限删除该模块。");
                        return ;
                    }
                }else{
                    var component1 = component0.parent.parentComponent;
                    if(component1 == null){
                        //软件构件主管
                        if(roleControl(1, component0.type)){

                        }else{
                            alert("对不起！您无权限删除该模块。");
                            return ;
                        }
                    }else{
                        //软件设计人员
                        if(roleControl(2, null)){

                        }else{
                            alert("对不起！您无权限删除该模块。");
                            return ;
                        }
                    }
                }
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
                    child.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);//发送删除消息
                    menuManager.treeContextMenu.unBindDomNode(menuManager.treeContextMenu.connectedObj.node);
                }else{
                    alert("无法删除！请先将组件前后传输控制组件删除后再试。");
                }
                process.validate();
            }
        });
        var textContextJumpMenu = new dijit.MenuItem({
            label:"跳转到此流程",
            iconClass:"dijitEditorIcon dijitEditorIconTabIndent",
            onClick:function(){
                var comp = menuManager.treeContextMenu.connectedObj;
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
                                if(menuManager.globalMenu.getChildren().length<3)
                                    menuManager.globalMenu.addChild(menuManager.returnParentMenuItem);
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
                        menuManager.returnParentMenuItem.onClick();
                        parentProcess = parentComponent.parent;
                        parentComponent = parentProcess.parentComponent;
                        flag = false;
                    }
                }
                if( !flag && comp.parent.parentComponent != null ){
                    if(menuManager.globalMenu.getChildren().length<3)
                        menuManager.globalMenu.addChild(menuManager.returnParentMenuItem);
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
        });
        var treeContextDeleteSubProcessMenu = new dijit.MenuItem({
            label:"删除子流程",
            iconClass:"dijitEditorIcon dijitEditorIconCancel",
            onClick:function(){
                var child = menuManager.treeContextMenu.connectedObj;
                //流程锁定
                var component0 = child.parent.parentComponent;
                if(component0 == null){
                    //软件系统主管
                    if(roleControl(0, null)){

                    }else{
                        alert("对不起！您无权限删除该模块子流程。");
                        return ;
                    }
                }else{
                    var component1 = component0.parent.parentComponent;
                    if(component1 == null){
                        //软件构件主管
                        if(roleControl(1, component0.type)){

                        }else{
                            alert("对不起！您无权限删除该模块子流程。");
                            return ;
                        }
                    }else{
                        //软件设计人员
                        if(roleControl(2, null)){

                        }else{
                            alert("对不起！您无权限删除该模块子流程。");
                            return ;
                        }
                    }
                }
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
                        delChild.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);//发送删除消息
                        var parent = delChild.parent;
                        parent.removeChild(delChild);
                    }
                }
                child.subProcess.validate();
                //子流程删除消息
                child.subProcess.sendNetMsg(NetMsgUtil.prototype.msgDelete,null);
                child.subProcess = null;
                process.validate();
            }
        });
        this.treeContextMenu.addChild(treeContextDeleteMenu);
        this.treeContextMenu.addChild(textContextJumpMenu);
        this.treeContextMenu.addChild(treeContextDeleteSubProcessMenu);
        this.treeContextMenu.bindDomNode(processTree.tree.domNode);
        treeHandle = dojo.connect(this.treeContextMenu, "_openMyself", processTree.tree, function(e){
            var tn = dijit.getEnclosingWidget(e.target);
            var comp = reg.getComponentByName(tn.label);
            //将当前选中的组件的引用记录下来
            menuManager.treeContextMenu.connectedObj = comp;
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
                menuManager.treeContextMenu.getChildren()[0].set("disabled",true/*"display","none"*/);
                menuManager.treeContextMenu.getChildren()[1].set("disabled",true);
                menuManager.treeContextMenu.getChildren()[2].set("disabled",true);
            }
            else if(!comp){
                menuManager.treeContextMenu.getChildren()[0].set("disabled",true);
                menuManager.treeContextMenu.getChildren()[1].set("disabled",true);
                menuManager.treeContextMenu.getChildren()[2].set("disabled",true);
            }
            else if(flag){
                menuManager.treeContextMenu.getChildren()[0].set("disabled",true);
                menuManager.treeContextMenu.getChildren()[1].set("disabled",false);
                menuManager.treeContextMenu.getChildren()[2].set("disabled",true);
            }
            else{
                menuManager.treeContextMenu.getChildren()[0].set("disabled",false);
                menuManager.treeContextMenu.getChildren()[1].set("disabled",false);
                if(comp.subProcess == null){
                    menuManager.treeContextMenu.getChildren()[2].set("disabled",true);
                }else{
                    menuManager.treeContextMenu.getChildren()[2].set("disabled",false);
                }
            }
        });
    }
});