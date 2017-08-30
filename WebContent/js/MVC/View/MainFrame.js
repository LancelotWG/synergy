/**
 * @author LancelotWG
 * 用于页面的初始化的框架类
 */
dojo.declare("MainFrame",dojo.Stateful,{
    loginTime:ControlUtil.prototype.logoutTime,
    currentLoginTime:0,
    OS:null,
    OSPlaceholder:null,
    status:ControlUtil.statusBlank,
    user:null,
    users:null,
    constructor: function(){
        Rico.loadModule('DragAndDrop');
        Rico.loadModule('Corner');
        Rico.loadModule('Effect');
        //去掉工作流上传页面发送参数的空格问题
        String.prototype.trim = function (){
            return this.replace(/^([\s]+)|([\s]+)$/gm, "");
        };
        this.users = new Hash();
    },
    initial:function(){
        this._showCurrentTime();
        this._createPersonnelList();
        this._actionConnect();
        var additiveAttribute = ["1", userName];
        var msg = new NetMsg(9,null,additiveAttribute);
        msg.msgSend();
    },
    _actionConnect:function(){
        var userRoleLevel = dijit.byId("userRoleLevel");
        dojo.connect(userRoleLevel,"onChange",this,this._changePersonnelMode);
        var addPersonnelButton = dijit.byId("addPersonnelButton");
        dojo.connect(addPersonnelButton,"onClick",this,this._addPersonnelAction);
        var removeProjectPersonnelButton = dijit.byId("removeProjectPersonnelButton");
        dojo.connect(removeProjectPersonnelButton,"onClick",this,this._removeProjectPersonnel);
        var removeCompetentMemberButton = dijit.byId("removeCompetentMemberButton");
        dojo.connect(removeCompetentMemberButton,"onClick",this,this._removeCompetentMember);
        var removeSoftwareDesignerButton = dijit.byId("removeSoftwareDesignerButton");
        dojo.connect(removeSoftwareDesignerButton,"onClick",this,this._removeSoftwareDesigner);
    },
    onCreate: function(){
        user.loadComponent();
        menuManager = new MenuManager();
        this._initialProject();
        isDirty = true;
    },
    /* createProcessTree:function(){
        processTree = new ProcessTree();
        process.generateTreeNode(false);
        processTree.onCreate();
        var treeContextMenu = new dijit.Menu();
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
        });

    },*/
    _initialProject:function(){
        this.OSPlaceholder = new Placeholder({
            parent: this,
            refNode: $("maincontent"),
            pos: "last",
            type: "OSPlaceholder"
        });
        this.OSPlaceholder.dropZone = new CustomDropzone(this.OSPlaceholder);
        dndManager.registerDropZone(this.OSPlaceholder.dropZone);
        /*editorProcessMenu = new dijit.Menu();
        var freshenMenu = new dijit.MenuItem({
            label:"刷新",
            iconClass:"dijitIconUndo",
            onClick:function(){
                //刷新操作
                mainFrame.OSPlaceholder.node.style.display = "block";
                editorProcessMenu.addChild(freshenMenu);
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
        editorProcessMenu.addChild(freshenMenu);
        editorProcessMenu.bindDomNode(dojo.byId("maincontent"));*/
        menuManager.createMenu(ControlUtil.prototype.createOS);
        var newX = YD.getX(this.OSPlaceholder.refNode) - this.OSPlaceholder.refNode.scrollLeft;
        var newY = YD.getY(this.OSPlaceholder.refNode) - this.OSPlaceholder.refNode.scrollTop;
        YD.setXY(this.OSPlaceholder.node,[newX,newY]);
        newX = YD.getX(this.OSPlaceholder.refNode) - this.OSPlaceholder.refNode.scrollLeft;
        newY = YD.getY(this.OSPlaceholder.refNode) - this.OSPlaceholder.refNode.scrollTop;
        var height = this.OSPlaceholder.refNode.offsetHeight;
        var width = this.OSPlaceholder.refNode.scrollWidth;
        var x = newX + width/2 - this.OSPlaceholder.defaultSize[0]/2;
        var y = newY + height/8 - this.OSPlaceholder.defaultSize[1]/2;
        YD.setXY(this.OSPlaceholder.node,[x,y]);
        this.OSPlaceholder.node.style.display = "none";
    },
    createProject:function(){
        /*editorProcessMenu.removeChild(0);*/
        $("maincontent").removeChild(this.OSPlaceholder.node);
        dndManager.deregisterDropZone(this.OSPlaceholder.dropZone);
        menuManager.createMenu(ControlUtil.prototype.configureOS);
        //editorProcessMenu = new dijit.Menu();
        /*var osFreshenMenu = new dijit.MenuItem({
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
                editorProcessMenu.removeChild(0);
                editorProcessMenu.removeChild(0);
                os.configuring();
                os.initialProject();
                //OS配置操作
            }
        });
        editorProcessMenu.addChild(osFreshenMenu);
        editorProcessMenu.addChild(osConfigureMenu);
        editorProcessMenu.bindDomNode(dojo.byId("maincontent"));*/
    },
    clearCurrentProject:function(){
        //全局组件
        if(os == null){
            var xhrArgs1 = {
                url: "user_removeNotOnProjectPersonnel.xhtml" + "?projectName=null" ,
                handleAs: "text",
                load: function(){

                },
                error: function(error){
                    alert("Write tempProcessFile failed!\n" + error.description);
                }
            };
            //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
            dojo.xhrPost(xhrArgs1);
        }else{
            var xhrArgs2 = {
                url: "user_removeNotOnProjectPersonnel.xhtml" + "?projectName=" + projectName,
                handleAs: "text",
                load: function(){

                },
                error: function(error){
                    alert("Write tempProcessFile failed!\n" + error.description);
                }
            };
            //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
            dojo.xhrPost(xhrArgs2);
        }
        process = null;
        if(processTree instanceof ProcessTree){
            processTree.treeStore.revert();
            if(processTree.tree != null){
                processTree.tree.destroy();
            }
        }
        processTree = null;
        if(timeConfigureGrid instanceof TimeConfigureGrid) {
            timeConfigureGrid.grid.destroy();
            //timeConfigureGrid.clearStore();
            //timeConfigureGrid.freshenGrid();
        }
        if(mainHandle != null){
            dojo.disconnect(mainHandle);
        }
        if(treeHandle != null){
            dojo.disconnect(treeHandle);
        }
        editorElement = null;
        //用户
        user = new UserDataController(userName);
        //全局注册表
        reg.clearRegistry();
        //其他控制变量
        keyArgs = [];
        ignoreKeyEvent = null;
        //共享用户组(名称不变意义更新为工程组。)
        shareUserGroup = null;
        //文件保存标记
        isDirty = false;
        //调试标识符
        isDebug = true;
        //流程保护，禁止删除
        canDelete = true;
        //treeTooltip显示控制参数
        singleTreeTooltip = true;
        //配置时间刷新间隔
        timeConfigureGridFreshen = false;
        //正在配置的组件
        configuringComponent = null;
        //drop类别显示标识，0：普通组件 1：传输控制 2：总线交联 3：OS组件
        dropType = 0;
        //正在移动的组件
        draggingComponent = null;
        //总线
        bus = null;
        //OS组件
        os = null;
        //默认主面板组件
        configObj = null;
        isAllComponentConfigured = false;
        //工程文件名
        projectName = "process";
        //工程的创建着
        projectCreator = "";
        //代码编辑器
        codeEditor = null;
        nameIndexMap = new Hash();
        globalId = new Hash();
        menuManager = new MenuManager();
        this._initialProject();
        var mainHTML =  dojo.byId("maincontent");
        mainHTML.innerHTML = "<div ><span id = 'location' ></span></div><div id = 'lockedFlag' style='display:none;width: 100%;height: 16px;'> <div style='float:left;margin-right: 3px;'> <img alt='logo' src='" + contextPath + "/resource/image/icons/lock.png' style='height:16px;width: 13px'/> </div> <div style='float:left;margin-top: 1px;'> <span id = 'keyHolder'> </span> </div> </div>";
        var grid_areaHTML =  dojo.byId("grid_area");
        grid_areaHTML.innerHTML = "<div id='timeconfigure_grid' ></div>";
        var outlineHTML =  dojo.byId("outline");
        outlineHTML.innerHTML = "";
        var ContentPane = dijit.byId("compContainer");
        var palettes = ContentPane.getChildren();
        for(var i = 0;i<palettes.length;i++){
            ContentPane.removeChild(palettes[i]);
        }
    },
    createNewProject:function(){
        //提示是否保存现有工程，销毁现有工程，创建新工程
    },
        /*createInitialProcess:function(){

        process = new Sequence.Process({
            type:"Process",
            refNode: $("maincontent"),
            pos: "last",
            isMainProcess:true
        });
        bus = new Bus({
            type: "bus",
            refNode:process.node,
            pos: "after"
        });
        dojo.byId("location").innerHTML = "<b>"+ process.name + "</b>";//层级
        /!*process.hideBorder();*!/
        process.validate();
        reg.registry(process);
        //var mainFrame = this;
        var editorComponentMenu = new dijit.Menu();
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

        editorProcessMenu = new dijit.Menu();
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
        editorProcessMenu.addChild(busConfigureMenu);
        //editorProcessMenu.addChild(layoutPopupMenu);
        editorProcessMenu.bindDomNode(dojo.byId("maincontent"));
        var editorElement;//选中元素
        process.connects.push(dojo.connect(dojo.byId("maincontent"),"mouseup",function(e){
            var clickedElement = e.target;
            //如果当前正在拖拽，就返回，否则会提前清除Selection，导致_deactivateRegisteredDropZones方法出现BUG
            if(dndManager.dragging) return;
            if(isClickedWhiteSpace(clickedElement)) {
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
                        editorElement.style.backgroundColor = editorElement.backgroundColor;
                    }
                    if(comp){
                        editorElement = comp.componentNode;//选中元素
                        editorElement.style.backgroundColor = "#3399FF";
                    }else{
                        comp = getBusConnectByDomNode(clickedElement);
                        if(comp){
                            /!*if(isControlFlow(editorElement)){
                                editorElement.style.backgroundColor = editorElement.backgroundColor;
                            }*!/
                            editorElement = comp.busConnect.node;
                            editorElement.style.backgroundColor = "#3399FF";
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
                case 1:
                    if(isControlFlow(editorElement)){
                        editorElement.style.backgroundColor = editorElement.backgroundColor;
                    }
                    if(comp){
                       /!* if(isControlFlow(editorElement)){
                            editorElement.style.backgroundColor = editorElement.backgroundColor;
                        }*!/
                        editorElement = comp.componentNode;//选中元素
                        editorElement.style.backgroundColor = "#3399FF";
                    }else{
                        comp = getBusConnectByDomNode(clickedElement);
                        if(comp){
                            /!*if(isControlFlow(editorElement)){
                                editorElement.style.backgroundColor = editorElement.backgroundColor;
                            }*!/
                            editorElement = comp.busConnect.node;
                            editorElement.style.backgroundColor = "#3399FF";
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
            }
        }));*/
        /*process.connects.push(dojo.connect(dojo.byId("maincontent"),"ondblclick",function(e){
            var dlg = dijit.byId("propsDialog");
            dlg.show();
            var obj = getComponentByDomNode(e.srcElement,true);
            if(!obj) obj = process;
            if(obj instanceof Sequence.Process) dlg.set("title","流程属性");
            else   dlg.set("title","组件属性");
            dlg.connectedComp = obj;
            obj.propsDlgContent = createContents(obj);
            fillPropsPanel(obj);
        }));
    },*/
     /* initialTimeConfigureGrid:function(){
        timeConfigureGrid = new TimeConfigureGrid();
        timeConfigureGrid.onCreate();
    },*/
    _showCurrentTime:function(){
        /*var tempProcessFileUrl, home;
        var startStyle, objectModelId, pendingUser, creator, workflowId, openInNewTab, workflowUrl;
        var timer;
        //url资源
        home = window.location.href;
        //url截取函数
        if (window.location.search.length > 0) {
            var pieces = window.location.href.split("?");
            home = pieces[0];
            var args = dojo.queryToObject(pieces[1]);
            startStyle = args.startStyle;
            if (startStyle == "new") {
                objectModelId = args.objectModelId;
                pendingUser = args.pendingUser;
                creator = args.creator;
                dojo.byId("loggingUser").innerHTML = creator;
                if (creator) dojo.byId("loggingUser").innerHTML = creator;
            } else if (startStyle == "edit") {
                workflowId = args.workflowId;
                workflowUrl = args.workflowUrl;
            }
            openInNewTab = args.openInNewTab;
            if (openInNewTab == "false") {
                dijit.byId("header")._splitterWidget._toggle();
                dijit.byId("footer")._splitterWidget._toggle();
            }
            if (startStyle == "edit") openRemoteProcess();
        }*/
        var timer;
        //底部登录时间显示窗
        dojo.style(dojo.byId("footer_tip"), "display", "block");
         var parentThis = this;
        if(os == null){
            projectName = "null"
        }
        var xhrHeartBeat = {
            url: "user_heartBeat.xhtml",
            handleAs: "text",
            content: {},
            load: function(data){
                var values = data.split("&");
                for(var i = 0; i < values.length; i++){
                    var val = values[i].split("#");
                    var name = val[0];
                    var online = val[1];
                    parentThis.usersOnline(name, online);
                }
                console.log("heartBeat");
            },
            error: function(error){
                console.log(error.description);
                alert("无法连接服务器，请检查网络连接！");
                window.location.href = "user/user_logout.xhtml";
            }
        };
        var heatBeatTime = 0;
        //底部时间刷新定时器
        timer = setInterval(function () {
            var date = new Date();
            dojo.byId("currentTime").innerHTML = date.toLocaleString();
            parentThis.currentLoginTime += 1;
            heatBeatTime += 1;
            if (parentThis.currentLoginTime >= parentThis.loginTime){
                window.location.href = "user/user_logout.xhtml";
            }
            if(heatBeatTime >= 8){
                heatBeatTime = 0;
                dojo.xhrPost(xhrHeartBeat);
            }
            if(timeConfigureGridFreshen){
                process.validate();
                timeConfigureGridFreshen = false;
            }
            return;
        }, 1000);
        /*window.unload = function () {
            clearInterval(timer);
            if(netController.connect){
                var xhrArgs = {
                    url: "user_logout.xhtml",
                    handleAs: "text",
                    content: {},
                    load: function(data){

                    },
                    error: function(error){
                        alert("Write tempProcessFile failed!\n"+error.description);
                    }
                };
                dojo.xhrPost(xhrArgs);
            }
        };*/
        /*window.onbeforeunload = function(){
            if(netController.connect){
                var xhrArgs = {
                    url: "user_logout.xhtml",
                    handleAs: "text",
                    content: {},
                    load: function(data){

                    },
                    error: function(error){
                        alert("Write tempProcessFile failed!\n"+error.description);
                    }
                };
                dojo.xhrPost(xhrArgs);
            }
        };*/
        /*dojo.addOnWindowUnload(window,function(){
            if(netController.connect){
                var xhrArgs = {
                    url: "user_logout.xhtml",
                    handleAs: "text",
                    content: {},
                    load: function(data){

                    },
                    error: function(error){
                        alert("Write tempProcessFile failed!\n"+error.description);
                    }
                };
                dojo.xhrPost(xhrArgs);
            }
        });*/
        /*dojo.addOnUnload(function(){
            /!*if(netController.connect){*!/
            if(isDirty){
                if(confirm("是否保存当前流程？")){
                    SaveXMLFile();
                }
            }
            var xhrArgs = {
                url: "user_logout.xhtml",
                handleAs: "text",
                content: {},
                load: function(data){

                },
                error: function(error){
                    alert("Write tempProcessFile failed!\n"+error.description);
                }
            };
            dojo.xhrPost(xhrArgs);
            /!*}*!/
        });*/
    },
    _changePersonnelMode:function(){
        var userRoleLevel = dijit.byId("userRoleLevel");
        var competentMemberType = dijit.byId("competentMemberType");
        var mode = userRoleLevel.getValue();
        if(mode == "0"){
            //控件激活
            competentMemberType.setDisabled(false);
        }else if(mode == "1"){
            competentMemberType.setDisabled(true);
        }
    },
    _checkPersonnelUnique:function(assembly, name){
        for(var i = 0;i < assembly.childNodes.length;i++){
            var checkName = assembly.childNodes[i].innerHTML;
            if(checkName == name){
                return false;
            }
        }
        return true;
    },
    _createPersonnelList:function(){
        this._createUserList();
        this._createProjectPersonnelList();
        this._createCompetentMemberList();
        this._createSoftwareDesignerList();
        this._createCurrentRoleMark();
        //this.updatePersonnelList();
    },
    _addProjectPersonnel:function(userName,online){
        var projectPersonnelList = dojo.byId('projectPersonnelList');
        if(!this._checkPersonnelUnique(projectPersonnelList, userName)){
            return ;
        }
        var option = window.document.createElement('option');
        option.innerHTML = userName;
        option.value = userName;
        if(online == "1"){
            dojo.addClass(option,"online");
        }else{
            dojo.addClass(option,"notOnline");
        }
        option.selected = false;
        projectPersonnelList.appendChild(option);
    },
    _addPersonnelAction:function(){
        var userRoleLevel = dijit.byId("userRoleLevel");
        var competentMemberType = dijit.byId("competentMemberType");
        var userList = dojo.byId('userList');
        var mode = userRoleLevel.getValue();
        var name = userList.getValue();
        if(name.length == 0){
            alert("无有效用户被选中！");
            return;
        }else if(name.length == 1){
            name = name[0];
        }else{
            alert("请不要一次选中多个用户！");
            return;
        }
        if(mode == "0"){
            if(user.role[0] == "0"){
                alert("对不起您无添加构建主管的权限！");
                return;
            }
            var competentType = competentMemberType.getValue();
            if(this.users.get(name) == "1"){
                this._addCompetentMember(name + "(" + competentType + ")", "1", true);
            }else{
                this._addCompetentMember(name + "(" + competentType + ")", "0", true);
            }
        }else if(mode == "1"){
            if(user.role[1] == "null"){
                alert("对不起您无添加软件设计人员的权限！");
                return;
            }
            if(this.users.get(name) == "1"){
                this._addSoftwareDesigner(name, "1", true);
            }else{
                this._addSoftwareDesigner(name, "0", true);
            }
        }
    },
    _addCompetentMember:function(username,online,ajax){
        var competentMemberList = dojo.byId('competentMemberList');
        if(!this._checkPersonnelUnique(competentMemberList, username)){
            alert("用户" + username + "已存在，请勿重复添加！");
            return ;
        }
        var option = window.document.createElement('option');
        option.innerHTML = username;
        option.value = username;
        if(online == "1"){
            dojo.addClass(option,"online");
        }else{
            dojo.addClass(option,"notOnline");
        }
        option.selected = false;
        var names = option.innerHTML.split("(");
        var role_b = names[1];
        role_b = role_b.split(")")[0];
        if(role_b == "RM"){
            if(user.role_bExist.RM == 1){
                alert("注意，余度构件已分配管理人员！");
                return ;
            }else{
                user.role_bExist.RM = 1;
            }
        }else if(role_b == "IO"){
            if(user.role_bExist.IO == 1){
                alert("注意，IO构件已分配管理人员！");
                return ;
            }else{
                user.role_bExist.IO = 1;
            }
        }else if(role_b == "CL"){
            if(user.role_bExist.CL == 1){
                alert("注意，控制律构件已分配管理人员！");
                return ;
            }else{
                user.role_bExist.CL = 1;
            }
        }
        competentMemberList.appendChild(option);
        this._addProjectPersonnel(names[0],online);
        if(names[0] == userName){
            if(user.role[1] == "null"){
                user.role[1] = role_b;
            }else if(user.role[1] != "null"){
                user.role[1] += ("^" + role_b);
            }
            user.updateCurrentUserRoleMark();
        }
        if(!ajax){
            return;
        }
        //与服务器通信增加构件主管(一个构件只能有一个构建主管)
        var xhrArgs = {
            url: "user_addArtifactDesigner.xhtml" + "?projectName=" + projectName + "&userName=" + names[0] + "&role_b=" + role_b,
            handleAs: "text",
            load: function(){
                //发送一个用户权限更改webSocket消息
                var additiveAttribute = ["b","1|" + role_b ,names[0]];
                var msg = new NetMsg(8,null,additiveAttribute);
                msg.msgSend();
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        dojo.xhrPost(xhrArgs);
    },
    _addSoftwareDesigner:function(username,online,ajax){
        var softwareDesignerList = dojo.byId('softwareDesignerList');
        if(!this._checkPersonnelUnique(softwareDesignerList, username)){
            alert("用户" + username + "已存在，请勿重复添加！");
            return ;
        }
        var option = window.document.createElement('option');
        option.innerHTML = username;
        option.value = username;
        if(online == "1"){
            dojo.addClass(option,"online");
        }else{
            dojo.addClass(option,"notOnline");
        }
        option.selected = false;
        softwareDesignerList.appendChild(option);
        this._addProjectPersonnel(username,online);
        if(username == userName){
            user.role[2] = "1";
            user.updateCurrentUserRoleMark();
        }
        if(!ajax){
            return;
        }
        //与服务器通信增加软件设计人员
        var xhrArgs = {
            url: "user_addSoftwareDesigner.xhtml" + "?projectName=" + projectName + "&userName=" + username,
            handleAs: "text",
            load: function(){
                //发送一个用户权限更改webSocket消息
                var additiveAttribute = ["c", "1" , username];
                var msg = new NetMsg(8,null,additiveAttribute);
                msg.msgSend();
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        dojo.xhrPost(xhrArgs);
    },
    _isRemoveProjectPersonnel:function(userName){
        var competentMemberList = dojo.byId('competentMemberList');
        var softwareDesignerList = dojo.byId('softwareDesignerList');
        var isExist = false;
        for(var i = 0;i < competentMemberList.childNodes.length;i++){
            var names = competentMemberList.childNodes[i].innerHTML.split("(");
            if(names[0] == userName){
                isExist = true;
                break;
            }
        }
        for(var i = 0;i < softwareDesignerList.childNodes.length;i++){
            if(softwareDesignerList.childNodes[i].innerHTML == userName){
                isExist = true;
                break;
            }
        }
        return isExist;
    },
    _removeProjectPersonnel:function(notAjax, removeUser){
        var projectPersonnelList = dojo.byId('projectPersonnelList');
        var username = projectPersonnelList.getValue();
        if(typeof(removeUser) == "string" && notAjax == true){
            username = removeUser;
        }
        if(notAjax != true){
            if(username.length == 0){
                alert("无有效用户被选中！");
                return;
            }else if(username.length == 1){
                username = username[0];
            }else{
                alert("请不要一次选中多个用户！");
                return;
            }
        }
        var competentMemberList = dojo.byId('competentMemberList');
        var softwareDesignerList = dojo.byId('softwareDesignerList');
        if(user.role[0] == "0" && user.role[1] != "null"  && notAjax != true){
            alert("对不起，您必须同时有软件系统主管以及软件构件主管权限才能进行此操作！");
            return;
        }
        for(var i = 0;i < projectPersonnelList.childNodes.length;i++){
            var option1 = projectPersonnelList.childNodes[i];
            if(option1.innerHTML == username){
                if(this.users.get(username) == "1"){
                    alert("用户" + username + "当前在线，无法将其从工程中移除！");
                    return;
                }
                projectPersonnelList.removeChild(option1);
            }
        }
        for(var i = 0;i < competentMemberList.childNodes.length;i++){
            var option2 = competentMemberList.childNodes[i];
            var names = option2.innerHTML.split("(");
            if(names[0] == username){
                competentMemberList.removeChild(option2);
                i--;
                var role_bE = names[1].split(")")[0];
                if(role_bE == "RM"){
                    user.role_bExist.RM = 0;
                }else if(role_bE == "IO"){
                    user.role_bExist.IO = 0;
                }else if(role_bE == "CL"){
                    user.role_bExist.CL = 0;
                }
            }
        }
        for(var i = 0;i < softwareDesignerList.childNodes.length;i++){
            var option3 = softwareDesignerList.childNodes[i];
            if(option3.innerHTML == username){
                softwareDesignerList.removeChild(option3);
            }
        }
        if(username == userName){
            user.role[1] = "null";
        }
        if(username == userName){
            user.role[2] = "0";
            user.updateCurrentUserRoleMark();
        }
        //与服务器通信移除工程人员
        if(notAjax == true){
            return;
        }
        //与服务器通信移除构建主管
        var xhrArgs = {
            url: "user_removeProjectPersonnel.xhtml" + "?projectName=" + projectName + "&userName=" + userName,
            handleAs: "text",
            load: function(){
                //发送一个用户权限更改webSocket消息
                var additiveAttribute = ["x", "0" , userName];
                var msg = new NetMsg(8,null,additiveAttribute);
                msg.msgSend();
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        dojo.xhrPost(xhrArgs);
    },
    _removeCompetentMember:function(notAjax, removeUser){
        var competentMemberList = dojo.byId('competentMemberList');
        var userNames = competentMemberList.getValue();
        if(user.role[0] == "0" && notAjax != true){
            alert("对不起您无移除构建主管的权限！");
            return;
        }
        if(notAjax != true){
            if(userNames.length == 0){
                alert("无有效用户被选中！");
                return;
            }else if(userNames.length == 1){
                userNames = userNames[0];
            }else{
                alert("请不要一次选中多个用户！");
                return;
            }
        }
        if(typeof(removeUser) == "string" && notAjax == true){
            userNames = removeUser;
        }
        var username = userNames.split("(")[0];
        var projectPersonnelList = dojo.byId('projectPersonnelList');
        for(var i = 0;i < competentMemberList.childNodes.length;i++){
            var option = competentMemberList.childNodes[i];
            var names = option.innerHTML.split("(");
            if(option.innerHTML == userNames){
                if(this.users.get(names[0]) == "1"){
                    alert("用户" + names[0] + "当前在线，无法将其从工程中移除！");
                    return;
                }
                var role_bE = names[1].split(")")[0];
                if(role_bE == "RM"){
                    user.role_bExist.RM = 0;
                }else if(role_bE == "IO"){
                    user.role_bExist.IO = 0;
                }else if(role_bE == "CL"){
                    user.role_bExist.CL = 0;
                }
                competentMemberList.removeChild(option);
            }
        }
        if(!this._isRemoveProjectPersonnel(username)){
            for(var i = 0;i < projectPersonnelList.childNodes.length;i++){
                var option1 = projectPersonnelList.childNodes[i];
                if(option1.innerHTML == username){
                    projectPersonnelList.removeChild(option1);
                }
            }
        }
        var role_b = userNames.split("(")[1];
        role_b = role_b.split(")")[0];
        if(names[0] == username){
            if(user.role[1] != "null"){
                var temp = "";
                var competents = user.role[1].split("^");
                for(var i = 0; i < competents.length; i++){
                    if(competents[i] != role_b){
                        temp += (competents[i] + "^");
                    }
                }
                temp = temp.substring(0, temp.length - 1);
                user.role[1] = temp;
            }
            user.updateCurrentUserRoleMark();
        }
        if(notAjax == true){
            return;
        }
        //与服务器通信移除构建主管
        var xhrArgs = {
            url: "user_removeArtifactDesigner.xhtml" + "?projectName=" + projectName + "&userName=" + username + "&role_b=" + role_b,
            handleAs: "text",
            load: function(){
                //发送一个用户权限更改webSocket消息
                var additiveAttribute = ["b", "0|" + role_b  , username];
                var msg = new NetMsg(8,null,additiveAttribute);
                msg.msgSend();
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        dojo.xhrPost(xhrArgs);
    },
    _removeSoftwareDesigner:function(notAjax, removeUser){
        var softwareDesignerList = dojo.byId('softwareDesignerList');
        var username = softwareDesignerList.getValue();
        if(user.role[1] == "null"  && notAjax != true){
            alert("对不起您无移除软件设计人员的权限！");
            return;
        }
        if(typeof(removeUser) == "string" && notAjax == true){
            username = removeUser;
        }
        if(notAjax != true){
            if(username.length == 0){
                alert("无有效用户被选中！");
                return;
            }else if(username.length == 1){
                username = username[0];
            }else{
                alert("请不要一次选中多个用户！");
                return;
            }
        }
        var projectPersonnelList = dojo.byId('projectPersonnelList');
        for(var i = 0;i < softwareDesignerList.childNodes.length;i++){
            var option = softwareDesignerList.childNodes[i];
            if(option.innerHTML == username){
                if(this.users.get(username) == "1"){
                    alert("用户" + username + "当前在线，无法将其从工程中移除！");
                    return;
                }
                softwareDesignerList.removeChild(option);
            }
        }
        if(!this._isRemoveProjectPersonnel(username)){
            for(var i = 0;i < projectPersonnelList.childNodes.length;i++){
                var option1 = projectPersonnelList.childNodes[i];
                if(option1.innerHTML == username){
                    projectPersonnelList.removeChild(option1);
                }
            }
        }
        if(username == userName){
            user.role[2] = "0";
            user.updateCurrentUserRoleMark();
        }
        if(notAjax == true){
            return;
        }
        //与服务器通信移除软件设计人员
        var xhrArgs = {
            url: "user_removeSoftwareDesigner.xhtml" + "?projectName=" + projectName + "&userName=" + username,
            handleAs: "text",
            load: function(){
                //发送一个用户权限更改webSocket消息
                var additiveAttribute = ["c", "0" , username];
                var msg = new NetMsg(8,null,additiveAttribute);
                msg.msgSend();
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        dojo.xhrPost(xhrArgs);
    },
    usersOnline:function(userName,online){
        this.users.unset(userName);
        this.users.set(userName,online);
        var userList = dojo.byId('userList');
        var projectPersonnelList = dojo.byId('projectPersonnelList');
        var competentMemberList = dojo.byId('competentMemberList');
        var softwareDesignerList = dojo.byId('softwareDesignerList');
        if(online == "1"){
            for(var i = 0;i < userList.childNodes.length;i++){
                var option = userList.childNodes[i];
                if(option.innerHTML == userName){
                    if(dojo.hasClass(option,"notOnline")){
                        dojo.removeClass(option,"notOnline");
                        dojo.addClass(option,"online");
                    }else{
                        dojo.addClass(option,"online");
                    }
                }
            }
            for(var i = 0;i < projectPersonnelList.childNodes.length;i++){
                var option = projectPersonnelList.childNodes[i];
                if(option.innerHTML == userName){
                    if(dojo.hasClass(option,"notOnline")){
                        dojo.removeClass(option,"notOnline");
                        dojo.addClass(option,"online");
                    }else{
                        dojo.addClass(option,"online");
                    }
                }
            }
            for(var i = 0;i < competentMemberList.childNodes.length;i++){
                var option = competentMemberList.childNodes[i];
                var names = option.innerHTML.split("(");
                if(names[0] == userName){
                    if(dojo.hasClass(option,"notOnline")){
                        dojo.removeClass(option,"notOnline");
                        dojo.addClass(option,"online");
                    }else{
                        dojo.addClass(option,"online");
                    }
                }
            }
            for(var i = 0;i < softwareDesignerList.childNodes.length;i++){
                var option = softwareDesignerList.childNodes[i];
                if(option.innerHTML == userName){
                    if(dojo.hasClass(option,"notOnline")){
                        dojo.removeClass(option,"notOnline");
                        dojo.addClass(option,"online");
                    }else{
                        dojo.addClass(option,"online");
                    }
                }
            }
        }else{
            for(var i = 0;i < userList.childNodes.length;i++){
                var option = userList.childNodes[i];
                if(option.innerHTML == userName){
                    if(dojo.hasClass(option,"online")){
                        dojo.removeClass(option,"online");
                        dojo.addClass(option,"notOnline");
                    }else{
                        dojo.addClass(option,"notOnline");
                    }
                }
            }
            for(var i = 0;i < projectPersonnelList.childNodes.length;i++){
                var option = projectPersonnelList.childNodes[i];
                if(option.innerHTML == userName){
                    if(dojo.hasClass(option,"online")){
                        dojo.removeClass(option,"online");
                        dojo.addClass(option,"notOnline");
                    }else{
                        dojo.addClass(option,"notOnline");
                    }
                }
            }
            for(var i = 0;i < competentMemberList.childNodes.length;i++){
                var option = competentMemberList.childNodes[i];
                var names = option.innerHTML.split("(");
                if(names[0] == userName){
                    if(dojo.hasClass(option,"online")){
                        dojo.removeClass(option,"online");
                        dojo.addClass(option,"notOnline");
                    }else{
                        dojo.addClass(option,"notOnline");
                    }
                }
            }
            for(var i = 0;i < softwareDesignerList.childNodes.length;i++){
                var option = softwareDesignerList.childNodes[i];
                if(option.innerHTML == userName){
                    if(dojo.hasClass(option,"online")){
                        dojo.removeClass(option,"online");
                        dojo.addClass(option,"notOnline");
                    }else{
                        dojo.addClass(option,"notOnline");
                    }
                }
            }
        }
    },
    updatePersonnelList:function(){
        var parent = this;
        var xhrArgs = {
            url: "user_getUserList.xhtml" + "?projectName=" + projectName,
            handleAs: "text",
            load: function(data){
                var value = data.split("$");
                var users = value[0];
                var usersRole = value[1];
                parent._updateUserListItem(users);
                parent._updateMemberListItem(usersRole);
                user.updateCurrentUserRoleMark();
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        return dojo.xhrPost(xhrArgs);
    },
    _updateUserListItem:function(users){
        var usersName = users.split("&");
        var userList = dojo.byId('userList');
        var length = userList.childNodes.length;
        for(var i = 0;i < length;i++){
            userList.removeChild(userList.childNodes[0]);
        }
        for(i = 0;i < usersName.length;i++){
            var option = window.document.createElement('option');
            var name = usersName[i].split("#")[0];
            var isOnline = usersName[i].split("#")[1];
            this.users.set(name,isOnline);
            option.innerHTML = name;
            option.value = name;
            if(isOnline == "1"){
                dojo.addClass(option,"online");
            }else{
                dojo.addClass(option,"notOnline");
            }
            option.selected = false;
            userList.appendChild(option);
        }
    },
    _updateMemberListItem:function(usersRole){
        var role = usersRole.split("&");
        var projectPersonnelList = dojo.byId('projectPersonnelList');
        var competentMemberList = dojo.byId('competentMemberList');
        var softwareDesignerList = dojo.byId('softwareDesignerList');
        var length = projectPersonnelList.childNodes.length;
        for(var i = 0;i < length;i++){
            projectPersonnelList.removeChild(projectPersonnelList.childNodes[0]);
        }
            length = competentMemberList.childNodes.length;
        for(var i = 0;i < length;i++){
            competentMemberList.removeChild(competentMemberList.childNodes[0]);
        }
            length = softwareDesignerList.childNodes.length;
        for(var i = 0;i < length;i++){
            softwareDesignerList.removeChild(softwareDesignerList.childNodes[0]);
        }
        for(i = 0;i < role.length;i++){
            var option = window.document.createElement('option');
            var name = role[i].split("#")[0];
            var roleLevels = role[i].split("#")[1];
            option.innerHTML = name;
            option.value = name;
            if(this.users.get(name) == "1"){
                dojo.addClass(option,"online");
            }else{
                dojo.addClass(option,"notOnline");
            }
            option.selected = false;
            projectPersonnelList.appendChild(option);

            var roleLevel = roleLevels.split("*");
            if(roleLevel[0] == "1"){

            }
            if(roleLevel[1] != "null"){
                var role_b = roleLevel[1].split("^");
                for(var j = 0; j < role_b.length; j++) {
                    var option2 = window.document.createElement('option');
                    if(this.users.get(name) == "1"){
                        dojo.addClass(option2,"online");
                    }else{
                        dojo.addClass(option2,"notOnline");
                    }
                    if(role_b[j] == "RM"){
                        user.role_bExist.RM = 1;
                    }else if(role_b[j] == "IO"){
                         user.role_bExist.IO = 1;
                    }else if(role_b[j] == "CL"){
                        user.role_bExist.CL = 1;
                    }
                    option2.innerHTML = name + "(" + role_b[j] + ")";
                    option2.value = name + "(" + role_b[j] + ")";
                    competentMemberList.appendChild(option2);
                }
            }
            if(roleLevel[2] == "1"){
                var option2 = window.document.createElement('option');
                option2.innerHTML = name;
                option2.value = name;
                if(this.users.get(name) == "1"){
                    dojo.addClass(option2,"online");
                }else{
                    dojo.addClass(option2,"notOnline");
                }
                option2.selected = false;
                softwareDesignerList.appendChild(option2);
            }
            if(name == user.userName){
                user.role[0] = roleLevel[0];
                user.role[1] = roleLevel[1];
                user.role[2] = roleLevel[2];
            }
        }
    },
    _createUserList:function(){
        var userList = dojo.byId('userList');
        var myMultiSelect = new dijit.form.MultiSelect({
            name: 'userList',
            style: "width:180px;height:150px;float:left;margin:10px;"
        }, userList);
        myMultiSelect.startup();
    },
    _createProjectPersonnelList:function(){
        var projectPersonnelList = dojo.byId('projectPersonnelList');
        var myMultiSelect = new dijit.form.MultiSelect({
            name: 'projectPersonnelList',
            style: "width:180px;height:150px;float:left;margin:10px;"
        }, projectPersonnelList);
        myMultiSelect.startup();
    },
    _createCompetentMemberList:function(){
        var competentMemberList = dojo.byId('competentMemberList');
        var myMultiSelect = new dijit.form.MultiSelect({
            name: 'competentMemberList',
            style: "width:180px;height:150px;float:left;margin:10px;"
        }, competentMemberList);
        myMultiSelect.startup();
    },
    _createSoftwareDesignerList:function(){
        var softwareDesignerList = dojo.byId('softwareDesignerList');
        var myMultiSelect = new dijit.form.MultiSelect({
            name: 'softwareDesignerList',
            style: "width:180px;height:150px;float:left;margin:10px;"
        }, softwareDesignerList);
        myMultiSelect.startup();
    },
    _createCurrentRoleMark:function(){

    },
    sendUserMessage:function(){
        var message = dojo.byId("userMessageInput");
        if(user.role[0] == "0" && user.role[1] == "null" && user.role[2] == "0"){
            alert("对不起您未进入工程中，无法发送有效消息，请打开工程或创建工程。");
        }else{
            var msg = new NetMsg(NetMsgUtil.prototype.msgUserChat,message.getValue(),null);
            msg.msgSend();
            var frame = window.frames["userMessagesBox"];
            frame.document.body.innerHTML += (userName + ": " + message.getValue() + " " + "<i style='color: #0000cc'>" + (new Date()).toLocaleTimeString() + "</i><br>");
            frame.scrollTo(0,frame.document.body.scrollHeight);
            message.setValue("");
        }
    }
});