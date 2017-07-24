/**
 * @author wsj 
 */
function openProcessFile(){
	var openDlg = dijit.byId("openFileDlg");
    openDlg.connect(openDlg,"onLoad",function(){
        createUploader();
    });
	openDlg.show();
}
function openRemoteProcess(){
	 var xhrArgs = {
        url: "jsp/getDialogContent.jsp",
        handleAs: "text",
        content: {
        	tag:"cse",
        	requestResource:true,
        	href:workflowUrl	
        },
        load: function(data){
            var workflowContent = dojo.trim(data);
            var processContent = {content:""};
            var defer = processSwitch(workflowContent,processContent,"fromCSEEditor");
            defer.then(function(){
                return recoverProcessAnsyn(processContent.content);
            }).then(hideProgress);
        },
        error: function(error){
            alert("打开失败!\n"+error.description);
            dijit.byId("uploadDlg").onCancel();
        }
    };
    dojo.xhrPost(xhrArgs);
    dijit.byId("progressDlg").show();
}
function browseProcessFile(){
	if(dijit.byId("localFileSystem").get("checked")){
		var localFileInput = dojo.byId("localFileInput");
		localFileInput.click();
		dijit.byId("unifiedFileInput").set("value",localFileInput.value); 		
	}else{
		alert("功能尚未实现");
	}
}
function fileTypeChanged(newValue){
	switch(newValue){
		case "fromUengine":
			dijit.byId("unifiedFileInput").set("regExp","^.*?\.(XPD|upd)$");
			dijit.byId("unifiedFileInput").set("invalidMessage","您输入的文件不是UEngine流程文件格式(*.XPD,*.upd)");
			break;
		case "fromCSEEditor":
			dijit.byId("unifiedFileInput").set("regExp","^.*?\.workflow$");
			dijit.byId("unifiedFileInput").set("invalidMessage","您输入的文件不是CSE_Editor流程文件格式(*.workflow)");
			break;
		case "fromModelCenter":
			dijit.byId("unifiedFileInput").set("regExp","^.*?\.pxc$");
			dijit.byId("unifiedFileInput").set("invalidMessage","您输入的文件不是ModelCenter流程文件格式(*.pxc)");
			break;
		case "default":
			dijit.byId("unifiedFileInput").set("regExp","^.*?\.xml$");
			dijit.byId("unifiedFileInput").set("invalidMessage","您输入的文件不是默认流程文件格式(*.xml)");			
		default:
	}
}
function runInBackground(){
	dijit.byId("progressDlg").hide();
	dojo.style(dijit.byId("progress_footer").domNode,"display","block");	
}
function cancelOpen(){
	dijit.byId("progressDlg").hide();
}
function getChildText(parent,attrName){
	//如果不包含attrName子节点，就返回null
	if(parent.childrenByName(attrName).length==0) return null;
	//如果包含一个空的子节点（没有#text子节点），也返回null
	if(parent.childrenByName(attrName)[0].childNodes.length==0) return null;
	return parent.childrenByName(attrName)[0].childNodes[0].nodeValue;
}
function recoverProcessAnsyn(content){
    var defer = new dojo.Deferred();
    try{
        recoverProcess(content);
        defer.resolve(true);
    }catch(e){
        defer.reject(new Error("文件打开失败"));
    }
    return defer;
}
/*
	打开文件的流程重构。xmlContent为一个xml格式的流程文件内容字符串
*/
function recoverProcess(xmlContent){
	var root = dojox.xml.DomParser.parse(dojo.trim(xmlContent));
	var processNode = root.getElementsByTagName("Sequence.Process")[0];
	var processName = getChildText(processNode,"name");
	var processDes = getChildText(processNode,"description");
	var processSD = getChildText(processNode,"startDate");
	var processED = getChildText(processNode,"endDate");
	var pvs = processNode.byName("ProcessVariable");
	var roles = processNode.childrenByName("roles")[0].childrenByName("Role");
	var exps = processNode.byName("expression");
	var childrenNode = processNode.childrenByName("children")[0];
	
	process.destroyRecursive();
	clear();
//	createDraggables();
	//销毁树
	processTree.destroyRecursive();
	processTree = null;
	
	//重构流程和流程树
	createInitialProcess();
	process.setName(processName);
	process.setDesc(processDes);
	process.sdate = processSD;
	process.edate = processED;
	//恢复流程变量
	dojo.forEach(pvs,function(pv){
		var pvName = getChildText(pv,"name");
		var pvType = getChildText(pv,"type");
		var returnId = addOrEdit(pvs_store,{name:pvName,type:pvType},pvs_maxID);
		if(returnId) pvs_maxID = returnId;
		process.pvs.push({variableName:pvName,variableType:pvType});
	});
	//恢复角色
	dojo.forEach(roles,function(role){
		var roleName = getChildText(role,"name");
		var roleUsers = getChildText(role,"actualWorker");
		var returnId = addOrEdit(roles_store,{name:roleName,users:roleUsers},roles_maxID);
		if(returnId) roles_maxID = returnId;
		process.roles.push({roleName:roleName,actualUsers:roleUsers});
	});
	//恢复表达式
	dojo.forEach(exps,function(exp){
		var expName = getChildText(exp,"name");
		var expLOT = getChildText(exp,"LeftOperandType");
		var expLO = getChildText(exp,"LeftOperand");
		var expO = getChildText(exp,"Operator");
		var expROT = getChildText(exp,"RightOperandType");
		var expRO = getChildText(exp,"RightOperand");
		var expContent = expLO + expO + expRO;
		var returnId = addOrEdit(exp_store,{
			name:expName,
			content:expContent,
			left_type:expLOT,
			left:expLO,
			operator:expO,
			right_type:expROT,
			right:expRO},exp_maxID);
		if(returnId) exp_maxID = returnId;
		process.exps.push({expName:expName,left_type:expLOT,left:expLO,operator:expO,right_type:expROT,right:expRO});
	});
	createProcessTree();	
	if(childrenNode.childNodes.length>0)
		recoverRecursive(childrenNode);
	process.validate();
}
//清除所有的store内容,重新生成
function clear(){
    reg.clearRegistry();
	nameIndexMap = new Hash();
	idsNeedInit = [];
	
	tree_maxID = 0;
	tree_store = null;
	//要将items清空，否则即使new了store,因为items里仍保存有数据，会发生错误
	tree_data.items = [];
	
	pvs_maxID = 0;
	data.items = [];
	pvs_store = null;
	pvs_store = new dojo.data.ItemFileWriteStore({data:data,jsId:"pvs_store"});
	
	roles_maxID = 0;
	roles_data.items = [];
	roles_store = null;
	roles_store = new dojo.data.ItemFileWriteStore({data:roles_data,jsId:"roles_store"});
	
	exp_maxID = 0;
	exp_data.items = [];
	exp_store = null;
	exp_store = new dojo.data.ItemFileWriteStore({data:exp_data,jsId:"exp_store"});
	
	dataMap_maxID = 0;
	dataMap_data.items = [];
	dataMap_store = null;
	dataMap_store = new dojo.data.ItemFileWriteStore({data:dataMap_data,jsId:"dataMap_store"});
	
	cpv_maxID = 0;
	cpv_data.items = [];
	cpv_store = null;
	cpv_store = new dojo.data.ItemFileWriteStore({data:cpv_data,jsId:"cpv_store"});	
	//清楚draggables和dropZones数组
	dndManager.clearDropZones();
	dndManager.draggables = new Array();
}
function recoverRecursive(childrenNode){
	dojo.forEach(childrenNode.childNodes,function(child){
        recover(child.nodeName,child);
	});
}
function recover(type,node){
	switch(type){
		case "Component":
			recoverComponent(node);
			break;
		case "Parallel":
			recoverParallel(node);
			break;
		case "Sequence":
		case "Sequence.Branch":
			recoverSequence(node);
			break;
		case "IfElse":
			recoverIfElse(node);
			break;
		case "ForEach":
			recoverForEach(node);
			break;
		default:
	}
}
function recoverComponent(node){
	var compName = getChildText(node,"name");
	var compDesc = getChildText(node,"description");
    var compType = getChildText(node,"type");
	//node.parentNode是children节点
	//nodeName不一定等于组件名，不能用nodeName来查找组件,约定每个组件都有name子节点，里面存放了组件的名字
//	var directParent = reg.getComponentByName(node.parentNode.parentNode.nodeName);
	var parentName = getChildText(node.parentNode.parentNode,"name");
	if(!parentName) throw new Error("Direct parent's name is null?");
	var directParent = reg.getComponentByName(parentName);
	if(!directParent) throw new Error("Direct parent is null");
	var comp = new Component({type:compType,description:compDesc});

    if(comp.nameField) new InplaceEditor({},comp.nameField);
	//圆角
	Rico.Corner.round(comp.node, {color: "transparent"});

	//加入注册表	
	reg.registry(comp);
	//directParent一定是Sequence的子类
	directParent.appendChildDom(comp.node);
	directParent.addChild(comp);
	//生成树节点
	comp.generateTreeNode(false);

    comp.setName(compName);
    //将创建好的组件也注册为可移动的
    dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name,"activity"));
	//开始时间与结束时间
	var sdate = getChildText(node,"startDate");
	var edate = getChildText(node,"endDate");
	if(sdate) comp.sdate = sdate;
	if(edate) comp.edate = edate;
	//绑定的角色
	var roleName = getChildText(node.childrenByName("bindingRole")[0],"name");
	var endpoint = getChildText(node.childrenByName("bindingRole")[0],"endpoint");
	if(roleName&&endpoint) comp.role = {roleName:roleName,actualUsers:endpoint};
	//数据映射
	var mappings = node.byName("Mapping");
	//恢复流程变量
	dojo.forEach(mappings,function(mapping){
		var name = getChildText(mapping,"VariableName");
		var direction = getChildText(mapping,"VariableDirection");
		var file = getChildText(mapping,"AssociatedFile");
		var field = getChildText(mapping,"bindingField");
		var returnId = addOrEdit(dataMap_store,{name:name,map:field,direction:direction,file:file,owner:compName},dataMap_maxID);
		if(returnId) dataMap_maxID = returnId;
		comp.dms.push({variableName:name,variableMapping:field,variableDirection:direction,variableFile:file});
	});
}
function recoverParallel(node){
	var name = getChildText(node,"name");
	var desc = getChildText(node,"description");
	var isCooper = getChildText(node,"isCooperative");
	var cooperPVs = node.childrenByName("cooperVariables")[0].childrenByName("cooperVariable");
	var childrenNode = node.childrenByName("children")[0];
	var parentName = getChildText(node.parentNode.parentNode,"name");
	if(!parentName) throw new Error("Direct parent's name is null?");
	var directParent = reg.getComponentByName(parentName);
	if(!directParent) throw new Error("Direct parent is null");
	var comp = new Parallel({type:"Parallel",description:desc,registerBranch:false});

    if(comp.nameField) new InplaceEditor({},comp.nameField);
	//恢复协同变量
	dojo.forEach(cooperPVs,function(cooperPV){
		var vname = getChildText(cooperPV,"variableName");
		var type = getChildText(cooperPV,"cooperType");
		var source = getChildText(cooperPV,"sourceTask");
		var target = getChildText(cooperPV,"targetTask");
		var returnId = addOrEdit(cpv_store,{name:vname,type:type,source:source,target:target,owner:name},cpv_maxID);
		if(returnId) cpv_maxID = returnId;
		comp.cpvs.push({variableName:vname,cooperType:type,sourceTask:source,targetTask:target});
	});
	//新增recoverLevel属性，初始值为0，每还原一个Sequence就自增一次，最后recoverLevel等于Parallel的分支数
	comp.recoverLevel = 0;

	reg.registry(comp);
	directParent.appendChildDom(comp.node);
	directParent.addChild(comp);
	comp.generateTreeNode(false);

    comp.setName(name);
    dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name,"activity"));

	comp.state.isCooperative = isCooper == "true" ? true : false;
	recoverRecursive(childrenNode);
}
function recoverSequence(node){
	var name = getChildText(node,"name");
	var desc = getChildText(node,"description");
	var childrenNode = node.childrenByName("children")[0];
	var parentName = getChildText(node.parentNode.parentNode,"name");
	if(!parentName) throw new Error("Direct parent's name is null?");
	var directParent = reg.getComponentByName(parentName);
	if(!directParent) throw new Error("Direct parent is null");
	if(directParent instanceof Parallel){
		if(directParent.recoverLevel>=2){
			directParent.addBranch();		
		}
		var comp = directParent.children[directParent.recoverLevel];
		if (directParent.recoverLevel >= 2) {
			comp.node.style.display = "block";
			comp.generateTreeNode(false);
		}
		comp.setName(name);
		comp.setDesc(desc);
		reg.registry(comp);
		directParent.recoverLevel++;
	}else if(directParent instanceof ForEach){
		var comp = directParent.children[0];
		comp.setName(name);
		comp.setDesc(desc);
	}else if(directParent instanceof IfElse){
		var comp;
		if(directParent.hasOwnProperty("recoverLevel"))
			comp = directParent.children[directParent.recoverLevel];
		else 
			comp = directParent.children[0];
		comp.setName(name);
		comp.setDesc(desc);
		if(directParent.hasOwnProperty("recoverLevel")) directParent.recoverLevel++;
	}
	if(childrenNode.childNodes.length>0)
		recoverRecursive(childrenNode);
}
function recoverForEach(node){
	var name = getChildText(node,"name");
	var desc = getChildText(node,"description");
	var condition = node.childrenByName("Condition")[0];
	var cond_name = getChildText(condition,"Name");
	var cond_content = getChildText(condition,"Content");
	var cond_LOT = getChildText(condition,"LeftOperandType");
	var cond_LO = getChildText(condition,"LeftOperand");
	var cond_O = getChildText(condition,"Operator");
	var cond_ROT = getChildText(condition,"RightOperandType");
	var cond_RO = getChildText(condition,"RightOperand");
	var childrenNode = node.childrenByName("children")[0];
	var parentName = getChildText(node.parentNode.parentNode,"name");
	if(!parentName) throw new Error("Direct parent's name is null?");
	var directParent = reg.getComponentByName(parentName);
	if(!directParent) throw new Error("Direct parent is null");
	var comp = new ForEach({type:"ForEach",description:desc});

    if(comp.nameField) new InplaceEditor({},comp.nameField);

	reg.registry(comp);
	directParent.appendChildDom(comp.node);
	directParent.addChild(comp);
	comp.generateTreeNode(false);

    comp.setName(name);
    dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name,"activity"));

	comp.condition = {name:cond_name,content:cond_content,left_type:cond_LOT,left:cond_LO,operator:cond_O,right_type:cond_ROT,right:cond_RO};
	if(childrenNode.childNodes.length>0)
		recoverRecursive(childrenNode);
}
function recoverIfElse(node){
	var name = getChildText(node,"name");
	var desc = getChildText(node,"description");
	var useElse = getChildText(node,"UseElseBranch");
	var condition = node.childrenByName("Condition")[0];
	var cond_name = getChildText(condition,"Name");
	var cond_content = getChildText(condition,"Content");
	var cond_LOT = getChildText(condition,"LeftOperandType");
	var cond_LO = getChildText(condition,"LeftOperand");
	var cond_O = getChildText(condition,"Operator");
	var cond_ROT = getChildText(condition,"RightOperandType");
	var cond_RO = getChildText(condition,"RightOperand");
	var childrenNode = node.childrenByName("children")[0];
	var parentName = getChildText(node.parentNode.parentNode,"name");
	if(!parentName) throw new Error("Direct parent's name is null?");
	var directParent = reg.getComponentByName(parentName);
	if(!directParent) throw new Error("Direct parent is null");
	var comp = new IfElse({type:"IfElse",description:desc});

    if(comp.nameField) new InplaceEditor({},comp.nameField);

	reg.registry(comp);
	directParent.appendChildDom(comp.node);
	directParent.addChild(comp);
	comp.generateTreeNode(false);

    comp.setName(name);
    dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name,"activity"));

	if(useElse=="true") comp.recoverLevel=0;
	comp.state.set("useElse",useElse=="true" ? true : false);
	comp.condition = {name:cond_name,content:cond_content,left_type:cond_LOT,left:cond_LO,operator:cond_O,right_type:cond_ROT,right:cond_RO};
	if(childrenNode.childNodes.length>0)
		recoverRecursive(childrenNode);
}
//function getFileContentFromLocal(url){
//    var fso = new ActiveXObject("Scripting.FileSystemObject");
//    var f1 = fso.OpenTextFile(url,1,false,0);
//    return f1.ReadAll();
//}
function submitForm(){
    var filepath = dijit.byId("unifiedFileInput");
    if(filepath.isValid()){
        var form = dijit.byId("openFileForm");
        form.validate();
        var fileSource = dijit.byId("localFileSystem").get("checked") ? "local" : "psm";
        var fileType = dijit.byId("fileType").get("value");
        var needTransfer = fileType=="default" ? false : true;
        setTimeout(function(){
            if(fileSource=="local"){
                getFileContentFromLocal({needTransfer:needTransfer,xsltName:fileType+".xsl"});
            }else{
                alert("功能尚未实现");
            }
        },300);
        dijit.byId("openFileDlg").hide();
        dijit.byId("progressDlg").show();
    }else{
        filepath.focus();
    }
    return false;
}
function createUploader() {
    uploader = new qq.FineUploader({
        // Pass the HTML element here
        element: document.getElementById('fine-uploader'),
        autoUpload: false,
        request: {
            endpoint: 'user_uploadBusConfigure.xhtml'
        },
        callbacks: {
            onComplete: function(id, fileName, responseJSON){
                if(responseJSON.success){
                    var fileName = responseJSON.body;
                    dojo.xhrPost({
                        url:"jsp/getDialogContent.jsp",
                        handleAs:"text",
                        content:{
                            href:"xml/uploads/"+fileName,
                            requestResource:true,
                            deleteAfterRead:true
                        },
                        load:function(data){
                            recoverProcessAnsyn(dojo.trim(data));
                            hideProgress();
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
    dojo.aspect.before(uploader,"_onInputChange",function(){
        uploader.clearStoredFiles();
    });
    dojo.aspect.after(uploader,"_onInputChange",function(input){
        dijit.byId("unifiedFileInput").set("value",uploader._parseFileName(input));
    },true);
}
function getFileContentFromLocal(options){
    uploader._options.request.params = options;
    uploader.uploadStoredFiles();
}
function processSwitch(fileContentStr,variableName,type){
    var defer = saverTempFileAjax2(fileContentStr);
    return defer.then(function(){
        return xsltTransfer(variableName,null,type);
    });
}
function deleteTempFile(){
    return  dojo.xhrGet({
        url:"jsp/deleteTempProcessFile.jsp?delete="+tempProcessFileUrl,
        handleAs:"text",
        load: function(data){
            tempProcessFileUrl = null;
        },
        error: function(error){
            alert(error.description);
        }
    });
}
function hideProgress(){
    setTimeout(function(){
        dijit.byId("progressDlg").hide();
    },500);
}