/**
 * @author LancelotWG
 * 用户数据控制类
 */
dojo.declare("UserDataController",dojo.Stateful,{
    userName:"",
    shareUserGroup:"",
    loadProcessName:"",
    role:["0","null","0"],
    openProjectDlgIndex:0,
    role_bExist:{RM:0,CL:0,IO:0},
    constructor: function(userName){//从服务器获取用户信息
        this.userName = userName;
    },
    loadComponent:function(){//加载json配置文件
        dojo.xhrGet({
            url: "user_componentConfig.xhtml",
            handleAs: "text",
            load: function (data) {
                configObj = dojo.fromJson(dojo.trim(data));
                dojo.forEach(configObj.drawers, function (item) {
                    var root = dojo.create("root");
                    var type = [];
                    dojo.forEach(item.children, function (child) {
                        var div = dojo.create("div", {align: "center", className: "palette"}, root);
                        dojo.create("img", {src:contextPath+ "/resource/image/icons/" + child.imgSrc, alt: child.description}, div);
                        dojo.create("br", {}, div);
                        dojo.create("label", {innerHTML: child.displayName}, div);
                        type.push(child.type);
                    });
                    //var widget = new dijit.TitlePane({title:item.title,content:root.outerHTML,open: item.initOpen,dndType:"TitlePane"});
                    var widget = new dijit.layout.ContentPane({
                        title: item.title,
                        content: root.childNodes,
                        selected: item.initOpen
                    });
                    //widget.startup();
                    dijit.byId("compContainer").addChild(widget);
                    var children = widget.containerNode.childNodes;
                    for (var i = 0; i < children.length ; i++) {
                        dndManager.registerDraggable(new CustomDraggable(children[i], type[i], "palette"));
                        /*newComponent = children[i];*/
                    }
                });
            },
            error: function (e) {
                alert("加载CAX组件失败。\n" + e.description);
            }
        });
    },

    _getInfoFromServer:function(){

    },

    connectGroup:function(){

    },

    openProject:function(){
        if(isDirty){
            if(confirm("是否保存现有工程？")){
                this.saveProject();
            }else{

            }
        }else{

        }
        mainFrame.clearCurrentProject();
        var openProjectDlg = dijit.byId("openProjectDlg");
        openProjectDlg.show();
        var parent = this;
        var createMultiSelect = function(){
            if(dijit.byId('openProjectMutiSelect')){
                if(parent.openProjectDlgIndex == 0){
                    parent._getProjectList();
                }
                parent.openProjectDlgIndex ++;
            }else{
                var openProjectMutiSelect = dojo.byId('openProjectMutiSelect');
                var myMultiSelect = new dijit.form.MultiSelect({ name: 'openProjectMutiSelect',style:"width:180px;height:150px;float:left;margin:10px;" }, openProjectMutiSelect);
                myMultiSelect.startup();
                if(parent.openProjectDlgIndex == 0){
                    parent._getProjectList();
                }
                parent.openProjectDlgIndex ++;
            }
        };
        dojo.connect(openProjectDlg, "onDownloadEnd", createMultiSelect);
    },

    openProjectApply:function(){
        dijit.byId("openProjectDlg").hide();
        projectName = (dijit.byId('openProjectMutiSelect')).getSelected()[0].innerHTML;
        console.log(projectName);
        this.requestUserInfo();
    },

    newProject:function(){
        if(isDirty){
            if(confirm("是否保存现有工程？")){
                this.saveProject();
            }else{

            }
        }else{

        }
        mainFrame.clearCurrentProject();
        var newProjectDlg = dijit.byId("newProjectDlg");
        newProjectDlg.show();

    },

    saveProject:function(){
        switch (mainFrame.status){
            case ControlUtil.prototype.statusBlank:
                this._saveTempFile3("",projectName);
                break;
            case ControlUtil.prototype.statusPrepare:
                this._saveTempFile3("",projectName);
                break;
            case ControlUtil.prototype.statusReady:
                var mainProcess = os.mainProcess;
                var res = generateDomTree(mainProcess);
                this._saveTempFile(res,mainProcess.name);
                break;
        }
    },

    deleteProject:function(){

    },

    _saveTempFile:function(node,projectName){
        var str = node.outerHTML;
        return this._saveTempFile2(str,projectName);
    },

    _saveTempFile2:function(str,projectName){
        var msg = new NetMsg(5,null,"");
        var xhrArgs = {
            url: "user_saveUserProcess.xhtml" + "?processName=" + projectName/*+ (tempProcessFileUrl ? ("?delete="+tempProcessFileUrl) : "")*/,
            handleAs: "text",
            content: {
                content: str.replace(/&nbsp/g,null),
                data: msg.parseData
            },
            load: function(data){
                //如果输出结果为XML，解析太过麻烦，因为dojo提供的xml.parser和DomParser都没有提供一个类似于innerHTML的方法
                //所以采用直接输出为文本，然后按照第一个<的索引将结果字符串截取为2段
                //var saveDlg = dijit.byId("saveDlg");
                //saveDlg.show();
                alert("工程" + projectName + "保存成功！");
                isDirty = false;
                //tempProcessFileUrl = dojo.trim(data);
                /*var index = data.indexOf("<");
                 tempProcessFileUrl = dojo.trim(data.substring(0,index));
                 if(type=="toDefault"){
                 var content = data.substring(index,data.length);
                 //dijit.byId(type).set("value",content);
                 dojo.byId("fileContent").innerText = content;

                 }*/
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        return dojo.xhrPost(xhrArgs);
    },

    _saveTempFile3:function(str,projectName){
        var msg = new NetMsg(5,null,"");
        var xhrArgs = {
            url: "user_saveUserProcess.xhtml" + "?processName=" + projectName,
            handleAs: "text",
            content: {
                content: str.replace(/&nbsp/g,null),
                data: msg.parseData
            },
            load: function(data){
                isDirty = false;
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        return dojo.xhrPost(xhrArgs);
    },

    _updateProjectListMutiSelect:function(data){
        var projectName = data.split("*");
        var openProjectMutiSelect = dojo.byId('openProjectMutiSelect');
        var length = openProjectMutiSelect.childNodes.length;
        for(var i = 0;i < length;i++){
            openProjectMutiSelect.removeChild(openProjectMutiSelect.childNodes[0]);
        }
        for(var i = 1;i < projectName.length;i++){
            var option = window.document.createElement('option');
            option.innerHTML = projectName[i];
            option.value = i - 1;
            if(i == 1){
                option.selected = true;
            }
            openProjectMutiSelect.appendChild(option);
        }
    },

    _getProjectList:function(){
        var parent = this;
        var xhrArgs = {
            url: "user_getProjectList.xhtml",
            handleAs: "text",
            load: function (data) {
                parent._updateProjectListMutiSelect(data);
            },
            error: function (e) {
                if (confirm("工程目录加载失败，是否重试？"))
                    user._getProjectList();
            }
        };
        dojo.xhrPost(xhrArgs);
    },

    _getUserList:function(){
        dojo.xhrGet({
            url: "user_getUserList.xhtml",
            handleAs: "text",
            load: function (data) {

            },
            error: function (e) {
                if (confirm("用户列表加载失败，是否重试？"))
                    user._getUserList();
            }
        });
    },

    loadProcess:function (projectName){
        dojo.xhrGet({
            url: "user_loadProcess.xhtml?processName=" + projectName + "&userName=" + userName,
            handleAs: "text",
            load: function (data) {
                var msg = new NetMsg(6,data,"");
                //刷新用户列表
                mainFrame.updatePersonnelList();
            },
            error: function (e) {
                if (confirm("用户数据加载失败，是否重试？"))
                    user.loadProcess();
            }
        });
    },

    updateCurrentUserRoleMark:function(){
        var currentRoleMark = dojo.byId("currentRoleMark");
        var roleMark = "";
        if(user.role[0] == "1"){
            roleMark = "<div class='role_SystemDesigner' style='margin: 5px; padding: 2px;' ><span>软件系统主管</span></div>"
        }
        if(user.role[1] != "null"){
            var role_bs = (user.role[1]).split("^");
            roleMark += "<div class='role_ComponentMember' style='margin: 5px; padding: 2px;' ><div>软件构件主管</div>" +
                "<div class='role_ComponentMembers' style='margin: 5px; padding: 2px;'>";
            for(var i = 0; i < role_bs.length; i++){
                if(i != role_bs.length-1){
                    roleMark += "<div class='role_ComponentMember' style='width:60%; margin: 5px; padding: 2px;'>" + role_bs[i] + "</div>";
                }else{
                    roleMark += "<div class='role_ComponentMember' style='width:60%; margin: 5px; padding: 2px;'>" + role_bs[i] + "</div>";
                }
            }
            roleMark += "</div></div>";
        }
        if(user.role[2] == "1"){
            roleMark += "<div class='role_SoftwareDesigner' style='margin: 5px; padding: 2px;' ><span>软件设计人员</span></br>";
        }
        currentRoleMark.innerHTML = roleMark;
    },

    requestData:function(username){
        var msg = new NetMsg(4,username,"request");
        msg.msgSend();
        //process.keyHolder.push(userName);
    },

    requestUserInfo:function(){
        var parent = this;
        var xhrArgs2 = {
            url: "user_getUserInfo.xhtml" + "?projectName=" + projectName + "&userName=" + userName,
            handleAs: "text",
            load: function(data){
                var args = data.split("*");
                if(args[0] == "0"){
                    parent.loadProcess(projectName);
                }else{
                    parent.requestData(args[1]);
                }
            },
            error: function(error){
                alert("Write tempProcessFile failed!\n" + error.description);
            }
        };
        //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
        dojo.xhrPost(xhrArgs2);
    }
});