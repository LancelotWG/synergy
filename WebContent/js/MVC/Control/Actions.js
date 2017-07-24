/**
 * @author Administrator
 */
function closeWindow(){
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
}
//test
/*function addi(){
	var index = parseFloat(dijit.byId('muti').get('value'));
	var value = parseFloat(dijit.byId('new').get('value'));
	if(value){
		var temp = [];
		for(var i = 0;i < os.timeConfigure.length;i++){
			temp.push(os.timeConfigure[i]);
			if(i == index){
				temp.push({id:value});
			}
		}
		os.timeConfigure = temp;
		if(!index){
			os.timeConfigure.push({id:value});
		}
		var sel = dojo.byId('muti');
		var length = sel.childNodes.length
		for(var i = 0;i < length;i++){
			sel.removeChild(sel.childNodes[0]);
		}
		for(var i = 0;i < os.timeConfigure.length;i++){
			var option = window.document.createElement('option');
			option.innerHTML = os.timeConfigure[i].id;
			option.value = i;
			option.selected = false;
			sel.appendChild(option);
		}
	}else{
		alert("请输入有效值！");
	}
}*/
/*function removei(){
	var index = parseFloat(dijit.byId('muti').get('value'));
	os.timeConfigure.splice(index,1);
	var sel = dojo.byId('muti');
	var length = sel.childNodes.length
	for(var i = 0;i < length;i++){
		sel.removeChild(sel.childNodes[0]);
	}
	for(var i = 0;i < os.timeConfigure.length;i++ ){
		var option = window.document.createElement('option');
		option.innerHTML = os.timeConfigure[i].id;
		option.value = i;
		option.selected = false;
		sel.appendChild(option);
	}
}*/
/*function upi(){
	var index = parseFloat(dijit.byId('muti').get('value'));
	if(index){
		var temp = os.timeConfigure[index - 1];
		os.timeConfigure[index - 1] = os.timeConfigure[index];
		os.timeConfigure[index] = temp;
		var sel = dojo.byId('muti');
		var length = sel.childNodes.length
		for(var i = 0;i < length;i++){
			sel.removeChild(sel.childNodes[0]);
		}
		for(var i = 0;i < os.timeConfigure.length;i++ ){
			var option = window.document.createElement('option');
			option.innerHTML = os.timeConfigure[i].id;
			option.value = i;
			option.selected = false;
			if(i == index - 1){
				option.selected = true;
			}
			sel.appendChild(option);
		}
	}
}
function downi(){
	var index = parseFloat(dijit.byId('muti').get('value'));
	var sel = dojo.byId('muti');
	var length = sel.childNodes.length;
	if(index != NaN && index < length-1){
		var temp = os.timeConfigure[index + 1];
		os.timeConfigure[index + 1] = os.timeConfigure[index];
		os.timeConfigure[index] = temp;
		for(var i = 0;i < length;i++){
			sel.removeChild(sel.childNodes[0]);
		}
		for(var i = 0;i < os.timeConfigure.length;i++ ){
			var option = window.document.createElement('option');
			option.innerHTML = os.timeConfigure[i].id;
			option.value = i;
			option.selected = false;
			if(i == index + 1){
				option.selected = true;
			}
			sel.appendChild(option);
		}
	}
}*/
/*function oki(){
	timeConfigureGrid.rebuildGridLayout();
	dijit.byId("OSTimeConfigureDlg").hide();
}*/


//test



//权限控制函数
function roleControl(actionLevel/*0:软件系统主管;1:软件构件主管;2:软件设计人员*/, model){
	switch (actionLevel){
		case 0:
			if(user.role[0] == "0"){
				return false;
			}else{
				return true;
			}
			break;
		case 1:
			if(user.role[1] == "null"){
				return false;
			}else{
				var role_bs = user.role[1].split("^");
				for(var i = 0; i < role_bs.length; i++){
					if(role_bs[i] == model){
						return true;
					}
				}
				return false;
			}
			break;
		case 2:
			if(user.role[2] == "0"){
				return false;
			}else{
				return true;
			}
			break;
	}
}


function retrievalSubProcess(subProcess){
	for(var i = 0;i<subProcess.children.length;i++){
		var child = subProcess.children[i];
		if(child instanceof Component) {
			if (child.subProcess != null) {
				if(child.subProcess.locked){
					canDelete = false;
				}
				retrievalSubProcess(child.subProcess);
			}
			if(child.busConnect){
				if(child.busConnect.isConfigured()){

				}else{
					os.notConfiguredComponent = child;
					isAllComponentConfigured = false;
					break;
				}
			}else{
				os.notConfiguredComponent = child;
				isAllComponentConfigured = false;
				break;
			}
		}
	}
}

function processChange(newProcess){
	//process.locked = false;
	//process.keyHolder = new Array();
	//var unlockedMsg = new NetMsg(7,process,"unlocked");
	//unlockedMsg.msgSend();
	process = newProcess;
	console.log("jump to "+process.name);
	//process.keyHolder.push(userName);
	//var requestMsg = new NetMsg(7,process,"request");
	//requestMsg.msgSend();
	process.createPaletteContentPane();
}

/*function SaveXMLFile(){
	/!*var saveDlg = dijit.byId("saveDlg");
	saveDlg.show();
    saveDlg.connect(saveDlg,"onLoad",dojo.hitch(null,loadContentDeferred,"saveFileForm","toDefault"));*!/

	//工程保存载在不同状态时的操作
	switch (mainFrame.status){
		case ControlUtil.prototype.statusBlank:
			saverTempFileAjax3("",projectName);
			break;
		case ControlUtil.prototype.statusPrepare:
			saverTempFileAjax3("",projectName);
			break;
		case ControlUtil.prototype.statusReady:
			var mainProcess = os.mainProcess;
			var res = generateDomTree(mainProcess);
			saveTempFileAjax(res,mainProcess.name);
			break;
	}
}*/

/*function newProcess(){
	var newProjectDlg = dijit.byId("newProjectDlg");
	newProjectDlg.show();
}*/

function onCreateProcess(){
	projectName=dijit.byId("newProjectName").getValue();
	var xhrArgs = {
		url: "user_createNewProject.xhtml" +"?projectName=" + projectName,
		handleAs: "text",
		content: {

		},
		load: function(data){
			if(data == "success"){
				projectCreator = userName;
				mainFrame.onCreate();
				dijit.byId("newProjectDlg").hide();
				user.saveProject();
				//刷新用户列表
				mainFrame.updatePersonnelList();
			}else{
				alert("工程" + projectName + "已存在，请更改工程名！");
			}
		},
		error: function(error){
			alert("Write tempProcessFile failed!\n" + error.description);
		}
	};
	//通过ajax调用
	return dojo.xhrPost(xhrArgs);
}

function openUploadDlg(){
    if(process.name == "Process"){
        alert("请修改流程名");
        process.treeEditor.edit();
        return;
    }
    var uploadDlg = dijit.byId("uploadDlg");
    uploadDlg.show();
}

function loadContentDeferred(id,id2){
    if(dijit.byId(id)){
        var res = generateDomTree(os.mainProcess);
        dijit.byId(id).sourceDom = res;
        /*return saveTempFileAjax(res,id2);*/
		return saveTempFileAjax(res,id2);
    }else{
        if(id=="saveFileForm")
            throw new Error("保存对话框尚未初始化");
        else if(id=="uploadForm")
            throw new Error("上传对话框尚未初始化");
    }
}

/*function saverTempFileAjax3(str,type){
	var msg = new NetMsg(5,null,"");
	var xhrArgs = {
		url: "user_saveUserProcess.xhtml" +"?processName=" + type,
		handleAs: "text",
		content: {
			content: str.replace(/&nbsp/g,null),
			data: msg.parseData
		},
		load: function(data){
			isDirty = false;
		},
		error: function(error){
			alert("Write tempProcessFile failed!\n"+error.description);
		}
	};
	//通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
	return dojo.xhrPost(xhrArgs);
}*/

/**
 * 在服务器上创建一个临时流程文件，用来作为XSLT转换的源文件
 * @param type:用来缓存返回的文件内容的dijit部件的id
 * @param str:临时文件内容字符串
 * @return {*|dojo.Deferred}
 */
/*function saverTempFileAjax2(str,type){
	var msg = new NetMsg(5,null,"");
    var xhrArgs = {
        url: "user_saveUserProcess.xhtml" +"?processName=" + type/!*+ (tempProcessFileUrl ? ("?delete="+tempProcessFileUrl) : "")*!/,
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
			alert("工程" + type + "保存成功！");
			isDirty = false;
			//tempProcessFileUrl = dojo.trim(data);
            /!*var index = data.indexOf("<");
            tempProcessFileUrl = dojo.trim(data.substring(0,index));
            if(type=="toDefault"){
                var content = data.substring(index,data.length);
                //dijit.byId(type).set("value",content);
                dojo.byId("fileContent").innerText = content;

            }*!/
        },
        error: function(error){
            alert("Write tempProcessFile failed!\n"+error.description);
        }
    };
    //通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_processfile为前缀，加一个随机数组成），
    return dojo.xhrPost(xhrArgs);
}*/
/**
 * 作用参考saverTempFileAjax2
 * @param node：流程对象树DOM
 * @param type：同saverTempFileAjax2
 */
/*function saveTempFileAjax(node,type){
	//UTF-8对汉字不太支持
//	var str = '<?xml version="1.0" encoding="GB2312"?>' + node.outerHTML;
    var str = node.outerHTML;
    return saverTempFileAjax2(str,type);
}*/
/**
 * 创建基本属性面板
 * @param title：基本属性Tab的标题
 * @param obj：关联的组件对象
 * @param parentNode：基本属性Tab的父DOM节点
 * @param id：基本属性Tab的id
 */
function createBasicPropsTab(title,obj,parentNode,id){	
		var basicPropsTab = dojo.create("div",{
			dojoType:"dijit.layout.ContentPane",title:title,
			selected:"true",id:id},parentNode,null);

		var table = dojo.create("table",{className:"PropsTable",cellspacing:"20"},basicPropsTab,"first");
		var props = obj.props;
		var trArray = new Array(props.length);
		for (var i=0; i<props.length; i++) {
			var prop = props[i];
			var type = prop.dojoType;
			//创建行与单元格，并填充第一个单元格
			trArray[i] = dojo.create("tr",{},table,null);
			var lbl_td = dojo.create("td",{align:"right"},trArray[i],null);
			var txt_td = dojo.create("td",{align:"left"},trArray[i],null);
			var lbl = dojo.create("label",{"for":"name"},lbl_td,null);
			lbl.style.fontWeight = "bold";
			switch(prop.name){
				case "Use Else Branch: ": 
					lbl.innerHTML = "是否使用Else分支：";
					break;
				case "Is Cooperative: ": 
					lbl.innerHTML = "是否是协同分支：";
					break;
				case "Activity Name: ":
					if(obj instanceof Sequence.Process)
						lbl.innerHTML = "流程名称：";
					else
						lbl.innerHTML = "活动名称：";
					break;
				case "Activity Description: ":
					if(obj instanceof Sequence.Process)
						lbl.innerHTML = "流程描述：";
					else
						lbl.innerHTML = "活动描述：";
					break;
				case "Invoked Application: ":
					lbl.innerHTML = "关联应用：";
					break;
				case "Component Width: ":
					lbl.innerHTML = "组件宽度：";
					break;
				case "Start Date: ":
					lbl.innerHTML = "开始时间：";
					break;
				case "End Date: ":
					lbl.innerHTML = "结束时间：";
					break;
				case "Associated Role: ":
					lbl.innerHTML = "关联角色：";
					break;
				case "Decision Condition: ":
					lbl.innerHTML = "判断条件：";
					break;
				case "Loop Condition":
					lbl.innerHTML = "循环条件：";
					break;
                case "Approve Role":
                    lbl.innerHTML = "审签角色：";
                    break;
				default:
					lbl.innerHTML = prop.name;
			}
			
			//填充第二个单元格
			var obj_id = obj.type + "_";			
			var txt = null;
			if(type=="dijit.form.TextBox"||type=="dijit.form.ValidationTextBox"){
				//取组件的类型加"_"加属性名的最后一个单词加"_"加一个随机数（1-1000）作为id			
				var strs = prop.name.split(":")[0].split(" ");
				obj_id += strs[strs.length-1]
				obj_id = obj_id + "_" + random(1000,1);
			
				txt = dojo.create("input",{
					dojoType:type,trim:true,required:true,
					type:"text",id:obj_id},txt_td,null);
				
				if(prop.name=="Invoked Application: ")
					dojo.attr(txt,"disabled",true);
			}else if(type=="dijit.form.DateTextBox"){
				//取组件的类型加"_"加sdate/edate加"_"加一个随机数（1-1000）作为id	
				var s = prop.name.indexOf("Start")>-1?'sdate':'edate';
				obj_id += s;
				obj_id = obj_id + "_" + random();
				
				txt = dojo.create("input",{
					dojoType:type,
					type:"text",name:obj_id,id:obj_id},txt_td,null);
			}else if(type=="dijit.form.Select"){
				/*if(obj instanceof IfElse){
					txt = dojo.create("select",{dojoType:type,style:{width:"86%"},id:"decisionConditionSelect"},txt_td,null);//86%
					dojo.create("option",{value:"",innerHTML:"&nbsp;"},txt,null);
					var exps = process.exps;
					for(var j=0;j<exps.length;j++){
						dojo.create("option",{value:exps[j].expName,innerText:exps[j].expName},txt,null);
					}
				}else*/ if(obj instanceof Component){
					txt = dojo.create("select",{dojoType:type,style:{width:"72%"},id:"role_Assign"},txt_td,null);//86%
					dojo.create("option",{value:"",innerHTML:"&nbsp;"},txt,null);
					var roles = process.roles;
					for(var j=0;j<roles.length;j++){
						dojo.create("option",{value:roles[j].actualUsers,innerText:roles[j].rolpyName},txt,null);
					}
				}
				/*else if(obj instanceof ForEach){
                    var idOption = {id:toHumpFormat(prop.name)+"Select"};
                    var options =  dojo.mixin(idOption,prop.name=="Approve Role" ? {} : {disabled:true});
                    txt = dojo.create("select",dojo.mixin({dojoType:type,style:{width:"72%"}},options),txt_td,null);//86%
					dojo.create("option",{value:"",innerHTML:"&nbsp;"},txt,null);
                    var options2  =  prop.name=="Approve Role" ? {attr:"roles",label:"rolpyName",value:"actualUsers"} : {attr:"exps",label:"expName",value:"expName"};
					var exps = process[options2.attr];
					for(var j=0;j<exps.length;j++){
						dojo.create("option",{value:exps[j][options2.value],innerText:exps[j][options2.label]},txt,null);
					}
				}*/
			}else if(type=="dijit.form.NumberSpinner"){
				txt = dojo.create("input",{dojoType:type,smallDelta:1,constraints:"{min:60,max:200,places:0}",id:prop.name,name:prop.name},txt_td,null);
			}else if(type=="dijit.form.RadioButton"){
				dojo.create("input",{type:"radio",dojoType:type,name:prop.name+1,id:prop.name+1,value:"yes"},txt_td,null);
				dojo.create("label",{"for":prop.name+1},txt_td,null).innerHTML = "是";
				dojo.create("input",{type:"radio",dojoType:type,name:prop.name+2,id:prop.name+2,value:"no"},txt_td,null);
				dojo.create("label",{"for":prop.name+2},txt_td,null).innerHTML = "否";
			}
			//把id记录下来，当组件被实例化以后进行初始值的填充
			if(txt&&txt.id)
				idsNeedInit.push(txt.id);
		};
}
function setChecked(checked,propName){
	if(checked) dijit.byId(propName+1).setChecked(true);
	else dijit.byId(propName+2).setChecked(true);
}
function createContents(obj){
	var dlg = dijit.byId("propsDialog");
	var root = dojo.create("form",{id:"PropsRoot",dojoType:"dijit.form.Form",enctype:"multipart/form-data"});
	var content = dojo.create("div",{id:"PropsTab",dojoType:"dijit.layout.TabContainer",align:"center"},root,'first');
	if(obj instanceof Sequence.Process){
		//创建基本属性面板
		createBasicPropsTab("流程定义属性",obj,content,"pdProps");
		// Process Variable Panel
		var pvTab = dojo.create("div",{
			dojoType:"dijit.layout.ContentPane",title:"流程变量",
			id:"pvs"},content,null);
        dojo.style(pvTab,"overflow","hidden");
		// Role Panel
		var roleTab = dojo.create("div",{
			dojoType:"dijit.layout.ContentPane",title:"流程角色",
			id:"roles"},content,null);
        dojo.style(roleTab,"overflow","hidden");
		// Expression Panel
		var expTab = dojo.create("div",{
			dojoType:"dijit.layout.ContentPane",title:"表达式",
			id:"expressions"},content,null);
        dojo.style(expTab,"overflow","hidden");
	}/*else if(obj instanceof IfElse){
		createBasicPropsTab("选择结构属性",obj,content,"compProps");
	}else if(obj instanceof ForEach){
        var title = obj instanceof Approval ? "审签活动属性" : "循环结构属性";
		createBasicPropsTab(title,obj,content,"compProps");
	}else if(obj instanceof Parallel){
		//创建基本属性面板
		createBasicPropsTab("分支结构属性",obj,content,"compProps");
	}*/else if(obj instanceof Component){
		//创建基本属性面板
		createBasicPropsTab("仿真活动属性",obj,content,"compProps");
		//创建数据映射面板
		var dataMappingTab = dojo.create("div",{
			dojoType:"dijit.layout.ContentPane",title:"数据映射",
			id:"dataMapping"},content,null);
        dojo.style(dataMappingTab,"overflow","hidden");
        //创建元数据面板
        var metaTab = dojo.create("div",{
            dojoType:"dijit.layout.ContentPane",title:"元数据定义",
            id:"metadata",href:"jsp/getDialogContent.jsp?href=defineMetadata"},content,null);
        //隐藏外层滚动条
        dojo.style(metaTab,"overflow","hidden");

	}
	
	var btnPanel = dojo.create("table",{id:"PropsBtnPanel"},root,'last');
	var btn_tr = dojo.create("tr",null,btnPanel,null);
	var btn_td = dojo.create("td",{align:"center",colspan:"2"},btn_tr,null);
	var ok_btn = dojo.create("button",{type:"button",dojoType:"dijit.form.Button",value:"确定",onclick:"javascript:ok_Clicked2()"},btn_td,null);
//	btn_td.innerHTML += "&nbsp;&nbsp;&nbsp;";
	var cancel_btn = dojo.create("button",{type:"button",dojoType:"dijit.form.Button",value:"取消",onclick:"javascript:cancel_Clicked()"},btn_td,null);
	return root.outerHTML;
}
function showDataMappingDialog(){
//	var pvName = dijit.byId("pvsSelect").getValue();
//	if(!isPvFileValid()){
//		alert("The Associated File field isn't valid!");
//		return;
//	}else if(!pvName){
//		alert("You must select a process variable first!");
//		return;
//	}else{
		var dataMappingCreateDlg = new dijit.Dialog({title:"Process Variable and Data Mapping Dialog",id:"pvadm_dlg",style:"width:600px;height:500px"});
		dataMappingCreateDlg.show();
		var root = dojo.create("div");
		var topPanel = dojo.create("div",null,root,null);
		var contentPanel = dojo.create("div",{dojoType:"dijit.layout.ContentPane"},root,null);
		var textarea = dojo.create("textarea",{dojoType:"dijit.form.Textarea",style:"width:550px;height:350px;",id:"fileContent"},contentPanel,null);
		var fso = new ActiveXObject("Scripting.FileSystemObject");
//		var pvFile = dijit.byId('pvFile').fileInput.value;
		var pvFile = dijit.byId('pvFile').get("value");
		try {
			var file = fso.OpenTextFile(pvFile,1,false);
			textarea.innerText = file.ReadAll();
		} catch (e) {
			alert("File doesn't exist.")
		}
		dataMappingCreateDlg.set("content",root.innerHTML);
//	}
}
function addOrEdit(store,keyValue,maxID,dlgId){
	var newOrEdit;
	if(typeof dlgId == "undefined") newOrEdit = "new";
	else{
		var dlg = dijit.byId(dlgId);
		var item = dlg.defaultValue;
		newOrEdit = (dlg.saveMode=="edit") ? "edit" : "new";
	}	
	if(newOrEdit=="edit"){
		for(key in keyValue){
			var newValue = keyValue[key];
			var oldValue = store.getValues(item,key)[0];
			if(oldValue!=newValue)
				store.setValue(item,key,newValue);
		}
		dlg.saveMode = null;
		dlg.defaultValue = null;
	}else{
		maxID++;
		try {
			store.newItem(dojo.mixin({id:maxID},keyValue));
		} catch (e) {//重名提示
			var message = dojo.filter(dijit.byId(store.linkedGrid).structure[0],function(item){
				if(item.field==store._getIdentifierAttribute()) return true;
			})[0].name;
			maxID--;
			alert(message+"不能重复！");
		}
		return maxID;
	}	
}
function changeBorder(state){
	if(state){
		return;
	}else{
		var input = dijit.byId('pvFile').domNode.lastChild.firstChild;
		if(!input){
			input = dijit.byId('pvFile').domNode.firstChild.nextSibling.firstChild;
		}
		var ss = dijit.byId('pvFile').fileInput;
		dojo.connect(ss,"onchange",function(){
			if(isPvFileValid()){
				dojo.removeClass(input,"err_border");
			}
		});
		dojo.addClass(input,"err_border");
	}	
}
function initBasicTab(obj){
	for(var i=0;i<idsNeedInit.length;i++){
		var id = idsNeedInit[i];
		if(!dijit.byId(id)) continue;
		var value = getValueById(id,obj);
		if(id.indexOf("date")==-1)
			dijit.byId(id).set("value",value);
		else{//日期要进行解析
			value = dojo.date.locale.parse(value,_FormatOptions);
			dijit.byId(id).set("value",value);
		}
	}
	/*if(obj instanceof Parallel)
		setChecked(obj.state.get("isCooperative"),"Is Cooperative: ");	
	if(obj instanceof IfElse){
		setChecked(obj.state.get("useElse"),"Use Else Branch: ");	
	}*/
}
function fillPropsPanel(obj){	
	var content = obj.propsDlgContent; 
	dijit.byId("propsDialog").set("content", content);
	addHandlers(obj);
	initBasicTab(obj);
	var tabs = dijit.byId("PropsTab");
	var names;
	var fields;
	var widths;		
	/*if (obj instanceof Parallel) {
		if (obj.state.get("isCooperative")) {
			var tab = new dijit.layout.ContentPane({title:"协同设置",id:"cooperSettings"});
			tabs.addChild(tab);
			tabs.selectChild(tab);
			names = ['标识号','协同变量名','协同类型','源任务','目标任务','有效性'];
			fields = ['id','name','type','source','target','valid'];
			widths = ['50px','70px','60px','100px','100px','70px'];			
			initTab(tab,obj,"jsp/getDialogContent.jsp?href=addCooperativeVariable","cooperPVDlg","cpv_grid",cpv_store,names,fields,widths);
			tabs.selectChild(dijit.byId("compProps"));
		}		
	}
	else*/ if (obj instanceof Component) {
		var tab = dijit.byId("dataMapping");
		tabs.selectChild(tab);
		names = ['标识号','数据变量名','映射关系','变量方向','关联文件','有效性'];
		fields = ['id','name','map','direction','file','valid'];
		widths = ['10%','15%','20%','15%','30%','10%'];
		initTab(tab,obj,"jsp/getDialogContent.jsp?href=addDataMapping","dataMapDlg","dm_grid",dataMap_store,names,fields,widths);
		tabs.selectChild(dijit.byId("compProps"));
        initMDGrid();
	}else if (obj instanceof Sequence.Process) {
		var tab = dijit.byId("pvs");
		tabs.selectChild(tab);
		names = ['标识号','流程变量名','流程变量类型'];
		fields = ['id','name','type'];
		widths = ['10%','55%','35%'];
		initTab(tab,obj,"jsp/getDialogContent.jsp?href=addProcessVariables","pvDlg","pvs_grid",pvs_store,names,fields,widths);
		tab = dijit.byId("roles");
		tabs.selectChild(tab);
		names = ['标识号','角色名','实际用户'];
		fields = ['id','name','users'];
        widths = ['10%','35%','55%'];
		initTab(tab,obj,"jsp/getDialogContent.jsp?href=addRole","roleDlg","roles_grid",roles_store,names,fields,widths);
		tab = dijit.byId("expressions");
		tabs.selectChild(tab);
		names = ['标识号','表达式名','表达式','有效性'];
		fields = ['id','name','content','valid'];
		widths = ['10%','30%','50%','10%'];
		initTab(tab,obj,"jsp/getDialogContent.jsp?href=addExpression","expDlg","exp_grid",exp_store,names,fields,widths);
		tabs.selectChild(dijit.byId("pdProps"));
	}	
	
}
function addHandlers(obj){
	var radio_id;
	/*if(obj instanceof IfElse){
		radio_id = "Use Else Branch: " + 1;   
	}else if(obj instanceof Parallel){
		radio_id = "Is Cooperative: " + 1;   
	}*/
	var option1 = dijit.byId(radio_id);
	if(option1){//不等到点击OK，当用户在切换单选按钮之后，就更改Parallel对象的isCooperative属性，这样就能动态显示与隐藏“协作设置”tab
		option1.onChange = function(newValue){
			if(radio_id=="Use Else Branch: 1"){
				if(newValue){
					obj.state.set("useElse",true);
				}else{
					obj.state.set("useElse",false);
				}
			}else{
				if(newValue) obj.state.set("isCooperative",true);
				else obj.state.set("isCooperative",false);
			}
		};
	}
}
function getValueById(id,obj){
	if(id.indexOf('Name')>-1){
		return	obj.name;
	}else if(id.indexOf('Description')>-1){
		return	obj.description;
	}else if(id.indexOf('sdate')>-1){
		return	obj.sdate;
	}else if(id.indexOf('edate')>-1){
		return	obj.edate;
	}else if(id.indexOf('Application')>-1){
		return	obj.type;
	}else if(id.indexOf('Width')>-1){
		return getWidth(obj);
	}else if(id=="role_Assign"||id=="approveRoleSelect"){
		return	obj.role.actualUsers;
	}else if(id=="decisionConditionSelect"||id=="loopConditionSelect"){
		return	obj.condition ? obj.condition.name : "";
	}
}
function getItem(store,keyArgs){
	return dojo.filter(store._getItemsArray(),function(item){
		var bl = true;
		for(key in keyArgs)
			bl = bl && item[key][0]==keyArgs[key];
		if(bl) return true;
	});
}
function ok_Clicked2(){
	var dlg = dijit.byId('propsDialog');
	var obj = dlg.connectedComp;
	for(var i=0;i<idsNeedInit.length;i++){
		var id = idsNeedInit[i];
		var value = dijit.byId(id).get("value");
		if(contains(["role_Assign","decisionConditionSelect","loopConditionSelect","approveRoleSelect"],id)){
			var label = dijit.byId(id).getOptions(value).label;
			if(id=="role_Assign"||id=="approveRoleSelect") value = {rolpyName:label,actualUsers:value};
			else{
				var item = getItem(exp_store,{name: value})[0];
                if(item) value = {name:label,content:item.content[0],left_type:item.left_type[0],left:item.left[0],operator:item.operator[0],right_type:item.right_type[0],right:item.right[0]};
			}
		}else if(id.indexOf("date")>-1)
			value = value ? dojo.date.locale.format(value,_FormatOptions) : "";
		if(id.indexOf("Name")>-1)
			obj.setName(value);
		else if(id.indexOf("Description")>-1)
			obj.setDesc(value);
		else if(id.indexOf("sdate")>-1)
			obj.sdate = value;
		else if(id.indexOf("edate")>-1)
			obj.edate = value;
		else if(id.indexOf("Width")>-1)
			dojo.style(obj.node,"width",value);
		else if(id=="role_Assign"||id=="approveRoleSelect")
			obj.role = value;
		else if(id=="decisionConditionSelect"||id=="loopConditionSelect")
			obj.condition = value;
	}	
	cancel_Clicked();
}

function saveStores(obj){
	if(obj instanceof Sequence.Process){
		obj.pvs = [];
		obj.roles = [];
		obj.exps = [];
		var items = pvs_store._getItemsArray();
		dojo.forEach(items,function(item){
			obj.pvs.push({variablpyName:item.name[0],variableType:item.type[0]});
		});
		items = roles_store._getItemsArray();
		dojo.forEach(items,function(item){
			obj.roles.push({rolpyName:item.name[0],actualUsers:item.users[0]});
		});
		items = exp_store._getItemsArray();
		dojo.forEach(items,function(item){
			obj.exps.push({expName:item.name[0],left_type:item.left_type[0],left:item.left[0],operator:item.operator[0],right_type:item.right_type[0],right:item.right[0]});
		});
	}else if(obj instanceof Component){
		obj.dms = [];
		var items = dataMap_store._getItemsArray();
		dojo.forEach(items,function(item){
			//只保存与当前组件相关的DataMap,即owner等于当前组件的name属性的DataMap
			if(item.owner[0]==obj.name)
				obj.dms.push({variablpyName:item.name[0],variableMapping:item.map[0],variableDirection:item.direction[0],variableFile:item.file[0]});
		});
        var arrays = findMDArrays();
        if(arrays.mdArray.length){
            obj.mdArray = [];
            dojo.forEach(arrays.mdArray,function(item){
                obj.mdArray.push(item);
            });
        }
        if(arrays.userMDArray.length){
            obj.userMDArray = [];
            dojo.forEach(arrays.userMDArray,function(item){
                obj.userMDArray.push(item);
            });
        }
	}/*else if(obj instanceof Parallel){
		obj.cpvs = [];
		var items = cpv_store._getItemsArray();
		dojo.forEach(items,function(item){
			if(item.owner[0]==obj.name)
				obj.cpvs.push({variablpyName:item.name[0],cooperType:item.type[0],sourceTask:item.source[0],targetTask:item.target[0]});
		});
	}*/
}
function cancel_Clicked(){
	var dlg = dijit.byId("propsDialog");
	saveStores(dlg.connectedComp);
	dlg.hide();
	idsNeedInit = [];
}

function validate2(){
	var id = dijit.byId("pdProps") ? 'pdProps' : 'compProps';
	var result = validateBasicProps2(id);
	var resultSet = [];
	if(result){
		dojo.forEach(result, function(item, j){
		  	resultSet.push(item);
		});	
	}		
	return resultSet;	
}
function validateBasicProps2(id){
	var inputs = dojo.query("table tr td input",dojo.byId(id)).filter(function(item){
		return item.id!="";
	});
	if(id=="compProps"){
		var role_select = dojo.query("table table tr td input",dojo.byId(id));
		inputs.push(role_select);
	}
	var sdate,edate;
	//检查结果的数组
	var resultSet = new Array();
	for(var i=0;i<inputs.length;i++){
		var input = inputs[i];
		//保存每条属性的检查结果
		var result = null;
		if(input.type == "text"||input.type=="radio"){
			var value = dojo.attr(input,"value");
			if(validateInput(value)){
				if(input.id.indexOf("sdate")>-1) sdate = {str:value,domNode:input};
				if(input.id.indexOf("edate")>-1) edate = {str:value,domNode:input};
				//end date的检查结果先不保存，需要与start date比较后才能确定其是否合法
				if(input.id.indexOf("edate")==-1)
					result = {valid:true,reason:input,tabId:id};
			} 
			else{
				result = {valid: false,reason:input,tabId:id};
			} 
		}
		if(result)
			resultSet.push(result);
	}
	//将日期字符串转换为日期对象，然后比较，如果结束日期早于开始日期，则非法
	if(sdate&&edate){
		var start = dojo.date.locale.parse(sdate.str,{selector:"date"});
		var end = dojo.date.locale.parse(edate.str,{selector:"date"});
		if(end < start)
			resultSet.push({valid: false,reason:edate.domNode,tabId:id});
		else
			resultSet.push({valid: true,reason:edate.domNode,tabId:id});
	}
	
	return resultSet;
}
//验证输入是否合法（暂时只检查是否为空格）
function validateInput(value){
	return value.length>0;
}
function readProcessVariables(){
	var pvs = process.pvs;
	if(pvs.length==0) return ",";
	var options = ",";
	for (var i=0; i<pvs.length; i++) {
		var pv = pvs[i];
		options += pv.key;
		options += ",";
	};
	return options.substring(0,options.length-1);
}
function getAllChildTask(obj){
	var taskNames = [];
	if(obj instanceof ContainerNode){
		if(obj instanceof Sequence){
			dojo.forEach(obj.children,function(item){
				if(isRealChild(item)){
					if(item instanceof Component){
						taskNames.push(item.name); 	
					}else{
						dojo.forEach(getAllChildTask(item),function(it){
							taskNames.push(it);
						});
					}
				}				
			});
		}else{
			for (var i=0; i<obj.children.length; i++) {
				var child = obj.children[i];
				dojo.forEach(getAllChildTask(child),function(item){
					taskNames.push(item);
				});
			};
		}
	}
	return taskNames;
}
function showUsersTreeDialog(){
	var dlg = dijit.byId("usersSelectDlg");
	if(!dlg){
		dlg = new dijit.Dialog({id:"usersSelectDlg",content:
		''
		},dojo.create("div",{},dojo.byId("roleForm"),null));
		dlg.startup();
	}		
	dlg.show();
}
/*
	此方法为初始化TooltipDialog的内容。被connect到对话框的onShow方法上，会被调用两次
	曾出现BUG：无法填充Expression的对话框，原以为是调用两次，第二次冲掉了第一次，后来发现不是。
	BUG原因在于通过dijit.widget的set("value",...)方法填充值时会引发onChange事件，而onChange的Handler
	又不是在set("value",...)之后立即处理的，而是有一个延迟。因为Expression很多Select部件的Option都是动态
	加载并变化的，在set完第一个后立即set第二个是不会起效的，因为第二个Select的内容要等第一个Select的onChange
	事件发生以后才能填充。解决办法是：使用dojo.aspect.after连接一个处理器（函数）连接到Select的onChange事件上
	该处理器会延迟到Select的onChange事件被处理以后才触发
*/
function fillValues(ids,values){
	//如果右操作数类型为直接值，在流程文件中保存的并不是“type_direct”,而是具体的某种直接值，例如string、number等
	var operandType = ["type_pv","type_role","type_duration","type_expression"];
	var tempData;
	for(var i=0;i<ids.length;i++){
		var widget = dijit.byId(ids[i]);
		switch(ids[i]){
			case "left_operand_type":
				widget.set("value",values[i]);
				break;
			case "left_operand":
				dojo.aspect.after(dijit.byId("left_operand_type"),"onChange",dojo.hitch(null,function(value){
					dijit.byId("left_operand").set("value",value);
				},values[i]));
				break;
			case "operatorSelect":
				dojo.aspect.after(dijit.byId("left_operand"),"onChange",dojo.hitch(null,function(value){
					dijit.byId("operatorSelect").set("value",value);
				},values[i]));
				break;
			case "right_operand_type":
				dojo.aspect.after(dijit.byId("left_operand_type"),"onChange",dojo.hitch(null,function(value){
					if(!contains(operandType,value)){
						dijit.byId("right_operand_type").set("value", "type_direct");	
						switch(value){
							case "string":
								tempData = "dijit.form.ValidationTextBox";
								break;
							case "boolean":
								tempData = "dijit.form.RadioButton";
								break;
							case "number":
								tempData = "dijit.form.NumberTextBox";
								break;
							case "date":
								tempData = "dijit.form.DateTextBox";
								break;
							case "file":
								tempData = "dojox.form.FileInputAuto";
								break;
							default:
						}	
					}else
						dijit.byId("right_operand_type").set("value",value);
				},values[i]));
				break;
			case "right_operand":
				var rot = dijit.byId("right_operand_type");
				dojo.aspect.after(rot,"onChange",dojo.hitch(null,function(value){
					if(rot.get("value")=="type_direct"&&tempData){
						dijit.byId("right_operand").set("value",tempData);
						dojo.aspect.after(widget,"onChange",dojo.hitch(null,function(value2){
							dijit.byId("directValueWidget").set("value",value2);
						},value));
					}else
						dijit.byId("right_operand").set("value",value);
				},values[i]));
				break;
			default:
				widget.set("value",values[i]);
		}
		if(i==0) widget.setDisabled(true);
	}
}

function initTab(tab,obj,href,dlgId,gridId,store,names,fields,widths){
	var dialog = dijit.byId(dlgId);
	if(!dialog){
		var operateBtnRow = dojo.create("div",{},tab.domNode,"first");
		var add_div = dojo.create("div",{style:"float:left",align:"right"},operateBtnRow,null);	
		var edit_div = dojo.create("div",{style:"float:left"},operateBtnRow,null);
		var remove_div = dojo.create("div",{style:"float:right",align:"left"},operateBtnRow,null);
		dialog = new dijit.TooltipDialog({
			id:dlgId,
			href:href,
			onOpen:enableIdentityEdit
		});
		
		var dropdownBtn = new dijit.form.DropDownButton({label:"添加",dropDown: dialog,iconClass:"plusIcon"},add_div);	
		dialog.connect(dialog,"onOpen",dojo.hitch(dialog,fillData));
		dojo.aspect.after(dialog,"onClose",dojo.hitch(dialog,function(){this.defaultValue = null;}));
		var editBtn = new dijit.form.Button({
				label:"修改",
				disabled:true,
				iconClass:"dijitEditorIcon dijitEditorIconWikiword",
				linkedDropDown:dropdownBtn,
				onClick:function(){
					var selection = this.linkedGrid.selection.getSelected()[0];
                    //不允许编辑流程变量isApproved和rejectReason以及表达式isApproved==false
                    if(this.linkedDropDown.dropDown.id=="pvDlg"){
                        if(contains(["isApproved","rejectReason"],pvs_store.getValue(selection,"name"))){
                            alert("流程变量isApproved和rejectReason由系统维护，用户不允许编辑或删除！");
                            return;
                        }
                    }
                    if(this.linkedDropDown.dropDown.id=="expDlg"){
                        if(exp_store.getValue(selection,"content")=="isApproved==false"){
                            alert("条件isApproved==false由系统维护，用户不允许编辑或删除！");
                            return;
                        }
                    }
                    this.linkedDropDown.dropDown.defaultValue = selection;
                    this.linkedDropDown.dropDown.saveMode = "edit";
					this.linkedDropDown.toggleDropDown();
				}
			},edit_div);
		var removeBtn = new dijit.form.Button({
				label:"删除",
				disabled:true,
				iconClass:"dijitEditorIcon dijitEditorIconDelete",
				onClick:function(){
                    //不允许删除流程变量isApproved和rejectReason以及表达式isApproved==false
                    if(this.linkedGrid.id=="pvs_grid"){
                        var selection = this.linkedGrid.selection.getSelected();
                        var canDelete = dojo.some(selection,function(item){
                            return !contains(["isApproved","rejectReason"],pvs_store.getValue(item,"name"));
                        });
                        if(!canDelete){
                            alert("您的选择中包含不能被删除的流程变量：isApproved或（和）rejectReason！");
                            return;
                        }
                    }
                    if(this.linkedGrid.id=="exp_grid"){
                        var selection = this.linkedGrid.selection.getSelected();
                        var canDelete = dojo.some(selection,function(item){
                            return !contains(["isApproved==false"],exp_store.getValue(item,"content"));
                        });
                        if(!canDelete){
                            alert("您的选择中包含不能被删除的条件：isApproved==false！");
                            return;
                        }
                    }
					this.linkedGrid.removeSelectedRows();
				}
			},remove_div);
		new CommonGrid({id:gridId,store:store,parentNode:tab.domNode,names:names,fields:fields,widths:widths});
		var grid = dijit.byId(gridId);
		//为grid添加tooltip
		if (contains(["cpv_grid", "exp_grid", "dm_grid"], gridId)) {
			addTooltipForGrid(grid);
		}
		//根据表格中是否有选择确定Remove按钮是否可用
		var btns = {edit:editBtn,remove:removeBtn};
		if(grid){
			grid.connect(grid.selection,"onChanged",dojo.hitch(btns,function(){
				if(grid.selection.getSelectedCount()==1) btns.edit.setDisabled(false);
				else{
					btns.edit.linkedGrid = grid;
					btns.edit.setDisabled(true);	
				} 	
				if(grid.selection.getSelectedCount()>0) btns.remove.setDisabled(false);
				else{
					btns.remove.linkedGrid = grid;
					btns.remove.setDisabled(true);	
				} 	
			}));
		}	
	}		
}
function enableIdentityEdit(){
	var identity;
	switch(this.id){
		case "cooperPVDlg":
			identity = "cooperPVName";
			break;
		case "dataMapDlg":
			identity = "pvsSelect";
			break;
		case "pvDlg":
			identity = "pvNameText";
			break;
		case "roleDlg":
			identity = "rolpyNameText";
			break;
		case "expDlg":
			identity = "expression_name";				
			break;
		default:
	}
	var widget = dijit.byId(identity);
	if(widget.get("disabled"))
		widget.setDisabled(false);
}
function fillData(){
	var v = this.defaultValue;
	switch(this.id){
		case "cooperPVDlg":
			if(v){
				fillValues(["cooperPVName","cooperTypeSelect"],[v.name[0],v.type[0]]);
				dojo.hitch(dijit.byId("propsDialog"),initCooperDeferred,v.source[0].split(","),v.target[0].split(","))();
			}else
				dojo.hitch(dijit.byId("propsDialog"),initCooperDeferred)();
			break;
		case "dataMapDlg":
			if(v){
				fillValues(["pvsSelect","pvFile","dataMappingText"],[v.name[0],v.file[0],v.map[0]]);
				dijit.byId(v.direction[0]+"_radio").set("checked",true);					
			}
			dijit.byId("pvsSelect").options = getPvs();
			break;
		case "pvDlg":
			if(v)
				fillValues(["pvNameText","pvTypeSelect"],[v.name[0],v.type[0]]);
			break;
		case "roleDlg":
			if(v)
				fillValues(["rolpyNameText","actualWorkersText"],[v.name[0],v.users[0]]);
			break;
		case "expDlg":
			if(v)
				fillValues(["expression_name","left_operand_type","left_operand","operatorSelect","right_operand_type","right_operand"],[v.name[0],v.left_type[0],v.left[0],v.operator[0],v.right_type[0],v.right[0]]);
			else
				dijit.byId("expression_name").set("value","表达式-"+exp_maxID);				
			break;
		default:
	}
}
function initCooperDeferred(sn,tn){
	var tasks = getAllChildTask(this.connectedComp);
	var exclude = (sn&&tn) ? sn.concat(tn) : [];	
	var filt = dojo.filter(tasks,function(item){
		if(!contains(exclude,item)) return true;
	});	
	dnd_source.selectAll();
	dnd_source.deleteSelectedNodes();
	dnd_source.insertNodes(false,filt);	
	if(sn&&tn){
		dnd_target1.selectAll();
		dnd_target1.deleteSelectedNodes();
		dnd_target2.selectAll();
		dnd_target2.deleteSelectedNodes();
		dnd_target1.insertNodes(false,sn);
		dnd_target2.insertNodes(false,tn);
	}
	dijit.byId("cooperPVName").options = getPvs();
}
function initDataMapDeferred(){
	dijit.byId("pvsSelect").options = getPvs();
}
function initExpressionDeferred(){
	dijit.byId("expression_name").set("value","表达式-"+exp_maxID);
}
function getPvs(){
	var pvsOptions = [{label:"&nbsp;",value:""}];	
	for (var i=0; i<process.pvs.length; i++) {
		var pv = process.pvs[i];
		pvsOptions.push({
			label: pv.variablpyName,
			value: pv.variablpyName
		});
	};	
	return pvsOptions;
}

function OnSaveCooperPV(){
	var selectWidget = dijit.byId("cooperPVName");
	if (!selectWidget.isValid()) {//如果没有选择流程变量，阻止提交，并显示Tooltip
		dijit.showTooltip(selectWidget._missingMsg, selectWidget.domNode, selectWidget.tooltipPosition, !selectWidget.isLeftToRight());
		return;
	}	
	var pvName = selectWidget.get("value");
	var stNode = dojo.byId("dnd_target1");
	var ttNode = dojo.byId("dnd_target2");
	var cooperType = dijit.byId("cooperTypeSelect").get("value");
	//如果Soure Task没填，则提出错误
	if (stNode.children.length == 0) {
		dojo.addClass(stNode, "err_border");
		return;
	}
	//如果Soure Task只有一条，而CooperType要求是n，那么也提示错误
	else 
		if ((cooperType == "n:1" || cooperType == "n:n") && stNode.children.length == 1) {
			dojo.addClass(stNode, "err_border");
			return;
		}
		//如果Soure Task有n条，而CooperType要求是1，那么也提示错误
		else 
			if ((cooperType == "1:1" || cooperType == "1:n") && stNode.children.length > 1) {
				dojo.addClass(stNode, "err_border");
				return;
			}
	
	//如果Soure Task没填，则提出错误
	if (ttNode.children.length == 0) {
		dojo.addClass(ttNode, "err_border");
		return;
	}
	//如果Soure Task只有一条，而CooperType要求是n，那么也提示错误
	else 
		if ((cooperType == "1:n" || cooperType == "n:n") && ttNode.children.length == 1) {
			dojo.addClass(ttNode, "err_border");
			return;		
		}
		//如果Soure Task有n条，而CooperType要求是1，那么也提示错误
		else 
			if ((cooperType == "1:1" || cooperType == "n:1") && ttNode.children.length > 1) {
				dojo.addClass(ttNode, "err_border");
				return;
			}
	var sTasks = [];
	var tTasks = [];
	for (var i=0; i<stNode.children.length; i++) {
		var child = stNode.children[i];
		sTasks.push(child.innerText);
	};
	for (var i=0; i<ttNode.children.length; i++) {
		var child = ttNode.children[i];
		tTasks.push(child.innerText);
	};	
	var owner = dijit.byId("propsDialog").connectedComp.name;
	var returnId = addOrEdit(cpv_store,{name:pvName,type:cooperType,source:sTasks.join(","),target:tTasks.join(","),owner:owner,valid:"有效"},cpv_maxID,"cooperPVDlg");
	if(returnId) cpv_maxID = returnId;
	//refresh the grid
	dijit.byId('cpv_grid').setStore(cpv_store,{owner:owner});
	
	dijit.byId("cooperPVForm").reset();
}
function deleteTempFiles(filpyName){
   var options = {};
    if(filpyName) options["delete"] = filpyName;
    //打开页面时，先清理所有临时文件，以免服务器上临时文件过多，在离开页面的onbeforeunload事件中无法清理，因为清理工作如果异步Ajax方式，页面会先刷新导致JSP调用无效
    dojo.xhrPost({
        url:"jsp/deleteTempProcessFile.jsp",
        handleAs:"text",
        content:options,
        load: function(data){
            tempProcessFileUrl = null;
        },
        error: function(error){
            alert(error.description);
        }
    });
}



//LWG function only to test
function addTimeConfigure(component){
	//timeConfigureGrid.beginUpdate();
	timeConfigureStore.newItem({name:component.type,configureTime:"10.0"});
	//timeConfigureStore.save();
	//timeConfigureGrid.startup();
	timeConfigureGrid.setStore(timeConfigureStore);
}