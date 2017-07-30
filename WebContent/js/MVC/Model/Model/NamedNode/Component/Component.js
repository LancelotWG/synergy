/**
 * Usage:new Component({type:"Catia"});
 */

dojo.declare("Component",NamedNode,{
	nameField:null,
	configureTime:"",
	//子模块流程
	subProcess:null,
	//总线交联drop
	busConnectPlaceholder:null,
	//总线交联
	busConnect:null,
	//执行角色
	role:"",
	//组件属性
	property:null,
	componentNode:null,
	dataFlow:null/*{
		from:[
			{id:"TEST_1_MODEL",type:"SINT16"},
			{id:"TEST_2_MODEL",type:"SINT16"},
			{id:"TEST_3_MODEL",type:"SINT16"},
			{id:"TEST_4_MODEL",type:"SINT16"},
			{id:"TEST_5_MODEL",type:"SINT16"},
			{id:"TEST_6_MODEL",type:"SINT16"},
			{id:"TEST_7_MODEL",type:"SINT16"},
			{id:"TEST_8_MODEL",type:"SINT16"},
			{id:"TEST_9_MODEL",type:"SINT16"},
			{id:"TEST_10_MODEL",type:"SINT16"},
			{id:"TEST_11_MODEL",type:"SINT16"},
			{id:"TEST_12_MODEL",type:"SINT16"},
			{id:"TEST_13_MODEL",type:"SINT16"}
		],
		to:[
			{id:"TEST_14_MODEL",type:"SINT16"},
			{id:"TEST_15_MODEL",type:"SINT16"},
			{id:"TEST_16_MODEL",type:"SINT16"},
			{id:"TEST_17_MODEL",type:"SINT16"},
			{id:"TEST_18_MODEL",type:"SINT16"},
			{id:"TEST_19_MODEL",type:"SINT16"},
			{id:"TEST_20_MODEL",type:"SINT16"},
			{id:"TEST_21_MODEL",type:"SINT16"},
			{id:"TEST_22_MODEL",type:"SINT16"},
			{id:"TEST_23_MODEL",type:"SINT16"},
			{id:"TEST_24_MODEL",type:"SINT16"},
			{id:"TEST_25_MODEL",type:"SINT16"},
			{id:"TEST_26_MODEL",type:"SINT16"},
			{id:"TEST_27_MODEL",type:"SINT16"}
		]
	}*/,
	oldDataFlow:null,
	version:"",
	componentVersionApplyButtonHandle:null,
	componentDataDefinitionFromSelectOptionHandle:null,
	componentDataDefinitionToSelectOptionHandle:null,
	componentDataDefinitionButtonHandle:null,
	componentDataDefinitionApplyButtonHandle:null,
	operateStatus0:null,
	operateStatus1:null,
	operateStatus0Handle:null,
	operateStatus1Handle:null,
	dialogHandle:null,
	modelDataFromMultiSelect:null,
	modelDataToMultiSelect:null,
	componentConfigureDlg:null,
	componentDataDefinitionDlg:null,
	componentVersionMutiSelect:null,
	componentCodeEditorDlg:null,
	componentCodeEditorAbolishButtonHandle:null,
	componentCodeEditorApplyButtonHandle:null,
	code:null,
	mainType:null,
	itemData:null,
	status:0,
	outputUploader:null,
	inputUploader:null,
	outputCompleteUploader:null,
	myself:null,
	constructor: function(args){
		//this.fillProps();
		this.dataFlow = {
			from:[],
			to:[]
		};
		this.oldDataFlow = {
			from:[],
			to:[]
		};
		this.code = "";
		this.dms = [];
		/*this.configureTime = null;*/
		this.property = new Array();
		this.itemData={
			fromData:null,
			toData:null,
			name:this.name,
			type:this.type,
			children:[

			]
		};
	},
	fillProps:function(){
		this.inherited(arguments);
		this.props.push({name:"Invoked Application: ",dojoType:"dijit.form.TextBox"});
		this.props.push({name:"Component Width: ",dojoType:"dijit.form.NumberSpinner"});
		this.props.push({name:"Start Date: ",dojoType:"dijit.form.DateTextBox"});
		this.props.push({name:"End Date: ",dojoType:"dijit.form.DateTextBox"});
		this.props.push({name:"Associated Role: ",dojoType:"dijit.form.Select"});
	},
	loadTemplateData:function(operatingMode){
		switch (operatingMode){
			case ControlUtil.prototype.ComponentCreateMode:
				if(this.type == "Custom"){
					this.sendNetMsg(NetMsgUtil.prototype.msgNew,null);
					return;
				}
				if(this.parent == os.mainProcess){
					this._loadComponentVersion();
				}else{
					this.version = this.parent.parentComponent.version;
					this.sendNetMsg(NetMsgUtil.prototype.msgNew,null);
					this._loadDataFlow();
					this._loadSubComponent();
				}
				break;
			case ControlUtil.prototype.ComponentServerCreateMode:
				this.version = this.parent.parentComponent.version;
				this._loadDataFlow();
				this._loadSubComponent();
				break;
			case ControlUtil.prototype.ComponentNetCreateMode:
				if(this.type == "Custom"){
					return;
				}
				if(this.parent == os.mainProcess){
					this._loadDataFlow();
					this._loadSubComponent();
				}else{
					this.version = this.parent.parentComponent.version;
					this._loadDataFlow();
					this._loadSubComponent();
				}
				break;
		}

	},
	_loadSubComponent:function(){
		var parent = this;
		dojo.xhrGet({
			url: "user_loadSubComponent.xhtml?templateName=original&type=" + parent.type + "&version=" + parent.version + "&mainType=" + parent.mainType,
			handleAs: "text",
			load: function (data) {
				parent._createSubComponent(data);
			},
			error: function (e) {
				//if (confirm("用户数据加载失败，是否重试？"))
					//parent._loadSubComponent();
			}
		});
	},
	_createSubComponent:function(data){
		var values = data.split("*");
		var model = values[1].split("#");
		if(model.length<2){
			return;
		}
		this.subProcess = new Sequence.Process({
			type:"Process",
			refNode: $("maincontent"),
			pos: "last",
			parentComponent:this
		});
		process.validate();
		YD.setStyle(this.subProcess.node,"display","none");
		this.subProcess.generateTreeNode(false);//树
		reg.registry(this.subProcess);
		this.subProcess.addPaletteContentPane(model);
		var index = 1;
		for(var i = 1;i<model.length;i++){
			var modelName = model[i].split("_");
			var name = modelName[0];
			for(var j = 1;j<modelName.length - 1;j++){
				name = name + "_" + modelName[j]
			}
			var comp = new Component({type:name,mainType:this.mainType});
			if(comp.nameField) new InplaceEditor({},comp.nameField);
			//圆角
			Rico.Corner.round(comp.node, {corners:"all", color: "transparent"});
			//将创建好的组件也注册为可移动的
			dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name, "activity", comp.id));
			reg.registry(comp);
			var htmlElement = this.subProcess.children[index].node;
			index = index + 2;
			var theGUI = comp.node;

			if (RicoUtil.getElementsComputedStyle(theGUI, "position") == "absolute"){
				theGUI.style.position = "static";
				theGUI.style.top = "";
			}
			//Sequence的addChild方法会判断前一个占位符的类型，所以必须等新创建的节点被加入到Dom中后才能使用它
			dojo.place(theGUI, htmlElement, "after");
			this.subProcess.addChild(comp,ControlUtil.prototype.ComponentServerCreateMode,null);
			comp.generateTreeNode(false);
			this.subProcess.validate();
			if(this.subProcess != process)
				YD.setStyle(this.subProcess.node,"display","none");
			else
				YD.setStyle(this.subProcess.node,"display","block");
		}
	},
	_connectEvent:function(){
		var button = dijit.byId("componentVersionApply");
		this.componentVersionApplyButtonHandle = dojo.connect(button,"onClick",this,this.componentVersionApply);
	},
	_disconnectEvent:function(){
		dojo.disconnect(this.componentVersionApplyButtonHandle);
		dojo.disconnect(this.dialogHandle);
	},
	_loadComponentVersion:function(){
		this.componentConfigureDlg = dijit.byId("componentConfigureDlg");
		this.componentConfigureDlg.show();
		var createMultiSelect = function () {
			if(dijit.byId('componentVersionMutiSelect')) {
				this.componentVersionMutiSelect = dijit.byId('componentVersionMutiSelect');
				this._getComponentVersion();
				this._connectEvent();
			}else{
				var componentVersionSelect = dojo.byId('componentVersionMutiSelect');
				this.componentVersionMutiSelect = new dijit.form.MultiSelect({
					name: 'componentVersionMutiSelect',
					style: "width:180px;height:150px;float:left;margin:10px;"
				}, componentVersionSelect);
				this.componentVersionMutiSelect.startup();
				this._getComponentVersion();
				this._connectEvent();
			}
		};
		this.dialogHandle = dojo.connect(this.componentConfigureDlg, "onDownloadEnd",this, createMultiSelect);
	},
	_getComponentVersion:function(){
		var parent = this;
		dojo.xhrGet({
			url: "user_loadComponentVersion.xhtml?templateName=original&type=" + parent.type,
			handleAs: "text",
			load: function (data) {
				parent._updateComponentConfigureDlg(data);
			},
			error: function (e) {
				if (confirm("用户数据加载失败，是否重试？"))
					parent._getComponentVersion();
			}
		});
	},
	_updateComponentConfigureDlg:function(data){
		var componentVersions = data.split("*");
		var componentVersionSelect = dojo.byId('componentVersionMutiSelect');
		var length = componentVersionSelect.childNodes.length;
		for(var i = 0;i < length;i++){
			componentVersionSelect.removeChild(componentVersionSelect.childNodes[0]);
		}
		for(var i = 1;i < componentVersions.length;i++){
			var option = window.document.createElement('option');
			option.innerHTML = componentVersions[i];
			option.value = i - 1;
			if(i == 1){
				option.selected = true;
			}
			componentVersionSelect.appendChild(option);
		}
	},
	getMainParentType:function(isDrag){
		var parent = null;
		if(isDrag){
			parent = process;
		}else{
			parent = this.parent;
		}
		var component = this;
		while(parent != os.mainProcess){
			component = parent.parentComponent;
			parent = component.parent;
			if(parent == null){
				break;
			}
		}
		if(parent){
			this.mainType = component.type;
		}
	},
	_loadDataFlow:function(){
		//this.getMainParentType(false);
		var parent = this;
		dojo.xhrGet({
			url: "user_loadComponentDataFlow.xhtml?templateName=original&type=" + parent.type + "&version=" + parent.version + "&mainType=" + parent.mainType,
			handleAs: "text",
			load: function (data) {
				parent._addDataFlows(data);
			},
			error: function (e) {
				if (confirm("用户数据加载失败，是否重试？"))
					parent._loadDataFlow();
			}
		});
	},
	_addDataFlows:function(data){
		var values = data.split("*");
		for(var i = 1;i<values.length;i++){
			var dataItems = values[i].split("#");
			if(dataItems[0] == "from"){
				for(var j = 1;j<dataItems.length;j++){
					var item = dataItems[j].split("&");
					this.addDataItem(0,item[0],item[1]);
				}
			}else if(dataItems[0] == "to"){
				for(var j = 1;j<dataItems.length;j++){
					var item = dataItems[j].split("&");
					this.addDataItem(1,item[0],item[1]);
				}
			}
		}
	},
	componentVersionApply:function(){
		dijit.byId("componentConfigureDlg").hide();
		this.version = (dijit.byId('componentVersionMutiSelect')).getSelected()[0].innerHTML;
		this._loadDataFlow();
		this._disconnectEvent();
		this._loadSubComponent();
		this.sendNetMsg(NetMsgUtil.prototype.msgNew,null);
	},
	initDomNode:function(){
		this.node = dojo.create("div",{
			className:"Activity",
			align:"center",
			style:{
				"width":"80px",
				"height":"92px"
			}
		});
		this.componentNode = dojo.create("div",{
		  	  className:"Component",
			  align:"center",
			  style:{
				  "width":"80px",
				  "height":"50px"
			  }
		},this.node,null);

        //如果type不是英文的，就使用Default.png作为其图片，因为中文的图片名无法正常显示
        if(!isEnglishCharacter(this.type)){
            dojo.create("img",{src:contextPath+"/resource/image/icons/"+"Default.png",alt:this.type},this.componentNode,null);
        }
        else{
		    dojo.create("img",{src:contextPath+"/resource/image/icons/"+this.type+".png",alt:this.type},this.componentNode,null);
			if(this.subProcess != null){
				if(this.subProcess.locked){
					src = contextPath+"/resource/image/icons/"+this.type+"_locked"+".png";
					this.componentNode.firstChild.src = src;
				}
			}
		}
		dojo.create("br",null,this.componentNode,null);
		this.nameField = dojo.create("label",{align:"left",innerHTML:this.name,className:"name_lbl"},this.componentNode,null);
		this.busConnectPlaceholder =  new Placeholder({
			parent: this,
			refNode: this.node,
			pos: null,
			type: "busConnectDrop"
		});
		this.busConnectPlaceholder.dropZone = new CustomDropzone(this.busConnectPlaceholder);
		dndManager.registerDropZone(this.busConnectPlaceholder.dropZone);

		//模块提示条
		var comp = this;
		var showTooltip = function(e) {
			var sub = (comp.subProcess==null)?"无":"有";
			var msg = "模块名称："+comp.name+"<br/>"+"时间片："+comp.configureTime+"ms"+"<br/>" +"子模型："+sub;
			if(sub == "有"){
				if(comp.subProcess.keyHolder[0] != null){
					msg += "<br/>" +"编辑者："+comp.subProcess.keyHolder[0];
					if(comp.subProcess.keyHolder[0] != userName){
						msg += "<br/>" + "该流程已被"+ comp.subProcess.keyHolder[0] + "锁定";
					}
				}
			}
			dijit.showTooltip(msg, e.target);

		};
		var hideTooltip = function(e) {
			dijit.hideTooltip(e.target);
		};
		dojo.connect(this.componentNode, "mouseover", showTooltip);
		dojo.connect(this.componentNode, "mouseout", hideTooltip);
		//模块提示条
	},
	setConfigureTime:function(newConfigureTime){
		newConfigureTime = parseFloat(newConfigureTime);
		if(this.configureTime == newConfigureTime) return;
		var oldConfigureTime = this.configureTime;
		os.removeConfigureTimeModel(oldConfigureTime);
		this.configureTime = newConfigureTime;
		os.addConfigureTimeModel(this.configureTime);
	},
	propertyChange:function(evt){
		if(evt.propName=="name"){
			this.name = evt.newValue;
			this.nameField.innerHTML = evt.newValue;
			process.validate();
		}else if(evt.propName=="configureTime"){

		}
	},
	generateTreeNode:function(isMove){
		if(!this.treeNode.id){
			this.treeNode.id = processTree.treeMaxID;
			processTree.treeMaxID++;
		}
		//fetchItemByIdentity此方法无返回值，是通过使用onItem回调函数才能使用返回值.scope必须传递，否则this.treeNode就会出现错误
		if(isMove){
			var children = this.parent.storeItem.children;
			if(!children) children = [];
			children.push(this.storeItem);
			processTree.treeStore.setValues(this.parent.storeItem,"children",children);
			this.parent.addAndSortTreeNode();
		}else{
			//newItem时不指定parentItem，否则newItem会被默认添加到parentItem的children数组的最后
			this.storeItem = processTree.treeStore.newItem(this.treeNode);
			//排序TreeNode
			this.parent.addAndSortTreeNode();
			var treeNode = processTree.tree.getNodesByItem(this.storeItem)[0];
			new InplaceEditor({isNeedSetLoc:false,treeNode:treeNode,width:"*", style:"width: *;"},treeNode.labelNode);

			//模块提示条
			var comp = reg.getComponentByName(treeNode.label);
			var showTooltip = function(e) {
				var sub = (comp.subProcess==null)?"无":"有";
				var msg = "模块名称："+comp.name+"<br/>"+"时间片："+comp.configureTime+"ms"+"<br/>" +"子模型："+sub;
				if(sub == "有"){
					if(comp.subProcess.keyHolder[0] != null){
						msg += "<br/>" +"编辑者："+comp.subProcess.keyHolder[0];
						if(comp.subProcess.keyHolder[0] != userName){
							msg += "<br/>" + "该流程已被"+ comp.subProcess.keyHolder[0] + "锁定";
						}
					}
				}
				if(singleTreeTooltip){
					dijit.showTooltip(msg, e.target);
					singleTreeTooltip = false;
				}
			};
			var hideTooltip = function(e) {
				dijit.hideTooltip(e.target);
				singleTreeTooltip = true;
			};
			dojo.connect(treeNode.domNode, "mouseover", showTooltip);
			dojo.connect(treeNode.domNode, "mouseout", hideTooltip);
			//模块提示条
		}
	},
	checkIcon:function(){
		if(this.subProcess != null){
			if(this.subProcess.locked){
				src = contextPath+"/resource/image/icons/"+this.type+"_child_locked"+".png";
				this.componentNode.firstChild.src = src;
				/*var treeNode = processTree.tree.getNodesByItem(this.storeItem)[0];
				this._updateItemClasses(treeNode.item);*/
				/*treeNode.collapse();
				treeNode.expand();*/
			}else{
				src = contextPath+"/resource/image/icons/"+this.type+"_child"+".png";
				this.componentNode.firstChild.src = src;
				/*var treeNode = processTree.tree.getNodesByItem(this.storeItem)[0];
				this._updateItemClasses(treeNode.item);*/
				/*treeNode.collapse();
				treeNode.expand();*/
			}
		}else{
			src = contextPath+"/resource/image/icons/"+this.type+".png";
			this.componentNode.firstChild.src = src;
		}
		this.isBusConnect();
	},
	sendNetMsg:function(operate,additiveAttribute){
		switch (operate){
			case NetMsgUtil.prototype.msgNew:
				var index = this.parent.children.indexOf(this,0);
				index = index + "";
				console.log(index);
				var msg = new NetMsg(NetMsgUtil.prototype.msgNew,this,index);
				msg.msgSend();
				break;
			case NetMsgUtil.prototype.msgChange:
				/*if(additiveAttribute[0] == "position"){
					var oldIndex = additiveAttribute[1] + "";
					var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,["position",oldIndex]);
					msg.msgSend();
				}else if(additiveAttribute[0] == "name"){
					var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,["name",additiveAttribute[1]]);
					msg.msgSend();
				}else if(additiveAttribute[0] == "timeConfigure"){
					var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,["timeConfigure",additiveAttribute[1]]);
					msg.msgSend();
				}else if(additiveAttribute[0] == "property"){
					var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,["property",additiveAttribute[1]]);
					msg.msgSend();
				}*/
				var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,additiveAttribute);
				msg.msgSend();
				break;
			case NetMsgUtil.prototype.msgDelete:
				var msg = new NetMsg(NetMsgUtil.prototype.msgDelete,this,this.name);
				msg.msgSend();
				break;
		}
	},
	getWidth: function(){
		return this.componentNode.offsetWidth;
	},
	getHeight: function(){
		return this.componentNode.offsetHeight;
	},
	isBusConnect:function(){
		if(this.busConnect){
			if(this.busConnect.isConfigured()){
				dojo.removeClass(this.componentNode.childNodes[0],"notConnect");
			}else{
				dojo.addClass(this.componentNode.childNodes[0],"notConnect");
			}
		}else{
			dojo.addClass(this.componentNode.childNodes[0],"notConnect");
		}
	},
	addBusConnect:function(busConnect){
		this.node.removeChild(this.busConnectPlaceholder.node);
		this.busConnect = busConnect;
		dndManager.deregisterDropZone(this.busConnectPlaceholder.dropZone);
	},
	removeBusConnect:function(){
		this.busConnect.removeAllData();
		this.busConnect._subProcessApplyChange(this.subProcess);
		this.node.removeChild(this.busConnect.node);
		this.busConnect = null;
		this.busConnectPlaceholder =  new Placeholder({
			parent: this,
			refNode: this.node,
			pos: null,
			type: "busConnectDrop"
		});
		this.busConnectPlaceholder.dropZone = new CustomDropzone(this.busConnectPlaceholder);
		dndManager.registerDropZone(this.busConnectPlaceholder.dropZone);
		//dndManager.registerDropZone(new CustomDropzone(this.busConnectPlaceholder));
	},
	getDataItemByID:function(flowType/*0为from,1为to*/,id){
		switch (flowType){
			case 0:
				for(var i = 0;i<this.dataFlow.from.length;i++){
					if(this.dataFlow.from[i].id == id){
						return this.dataFlow.from[i];
					}
				}
				break;
			case 1:
				for(var j = 0;j<this.dataFlow.to.length;j++){
					if(this.dataFlow.to[j].id == id){
						return this.dataFlow.to[j];
					}
				}
				break;
		}
		return null;
	},
	getDataItemTypeByID:function(flowType/*0为from,1为to*/,id){
		var dataItem = this.getDataItemByID(flowType,id);
		var types = (dataItem.type).split("_");
		return types[1];
	},
	_componentCodeUpload:function(){
		var resource = ((codeEditor.getValue()).split("**#**/\n"))[1];
		var parent = this;
		var xhrArgs = {
			url: "user_codeTransmission.xhtml?codeName=" + parent.name + "&type=upload",
			handleAs: "text",
			content: {
				resource: resource
			},
			load: function(){
				if(confirm("源文件保存成功，是否退出编辑")){
					parent.code = resource;
					parent.componentCodeEditorDlg.hide();
					parent._disconnectCodeEditorEvent();
				}
			},
			error: function(error){
				alert("源文件保存失败，请稍后重试！");
			}
		};
		dojo.xhrPost(xhrArgs);
	},
	_componentCodeDownload:function(){
		var codeGeneration = new CodeGeneration(this);
		var tip = "/**#**\n此注释为函数返回结构体提示，请勿删除或修改以免出现不可预知的错误！\n" + codeGeneration.getToStructDefinition() + "**#**/\n";
		this.code = codeGeneration.getDefinitionStringStream();
		codeEditor.setValue(tip + this.code);
		//代码的同步还是使用服务器上的的源文件进行同步为妥
		/*var parent = this;
		dojo.xhrGet({
			url: "user_codeTransmission.xhtml?codeName=" + parent.name + "&type=download",
			handleAs: "text",
			load: function (data) {
				codeEditor.setValue(data);
			},
			error: function (e) {

			}
		});*/
	},
	componentCodeEditor:function(){
		this.componentCodeEditorDlg = dijit.byId("codeEditorDlg");
		this.componentCodeEditorDlg.show();
		var createCodeEditor = function () {
			require("ace/ext/old_ie");
			ace.require("ace/ext/language_tools");
			codeEditor = ace.edit("CompileEditor");
			codeEditor.$blockScrolling = Infinity;
			codeEditor.setFontSize(16);
			codeEditor.session.setMode("ace/mode/c_cpp");
			codeEditor.setOptions({
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true
			});
			codeEditor.setTheme("ace/theme/monokai");
			this._componentCodeDownload();
			this._connectCodeEditorEvent();
		};
		this.dialogHandle = dojo.connect(this.componentCodeEditorDlg, "onDownloadEnd",this, createCodeEditor);
	},
	_connectCodeEditorEvent:function(){
		var componentCodeEditorAbolish = dijit.byId("componentCodeEditorAbolish");
		var componentCodeEditorApply = dijit.byId("componentCodeEditorApply");
		this.componentCodeEditorApplyButtonHandle = dojo.connect(componentCodeEditorAbolish,"onClick",this,this.componentCodeEditorAbolish);
		this.componentCodeEditorAbolishButtonHandle = dojo.connect(componentCodeEditorApply,"onClick",this,this.componentCodeEditorApply);
	},
	_disconnectCodeEditorEvent:function(){
		dojo.disconnect(this.componentCodeEditorApplyButtonHandle);
		dojo.disconnect(this.componentCodeEditorAbolishButtonHandle);
		dojo.disconnect(this.dialogHandle);
	},
	componentCodeEditorApply:function(){
		this._componentCodeUpload();
		var code = codeEditor.getValue();
		console.log(code);
	},
	componentCodeEditorAbolish:function(){
		this.componentCodeEditorDlg.hide();
		this._disconnectCodeEditorEvent();
	},
	_connectDataDefinitionEvent:function(){
		var componentEditorOperate = dijit.byId("componentEditorOperate");
		var componentEditorApply = dijit.byId("componentEditorApply");
		this.componentDataDefinitionApplyButtonHandle = dojo.connect(componentEditorApply,"onClick",this,this.componentEditorApply);
		this.componentDataDefinitionButtonHandle = dojo.connect(componentEditorOperate,"onClick",this,this.action);
		this.operateStatus0Handle = dojo.connect(this.operateStatus0,"onClick",this,this.changeStatus);
		this.operateStatus1Handle = dojo.connect(this.operateStatus1,"onClick",this,this.changeStatus);
		this.componentDataDefinitionFromSelectOptionHandle = dojo.connect(this.modelDataFromMultiSelect,"onClick",this,this.selectOption);
		this.componentDataDefinitionToSelectOptionHandle = dojo.connect(this.modelDataToMultiSelect,"onClick",this,this.selectOption);
		this.status = 0;
	},
	componentEditorApply:function(){
		this.componentDataDefinitionDlg.hide();
		this._disconnectDataDefinitionEvent();
		if(this.code != ""){
			if(confirm("修改组件的输入与输出数据将会使已编辑的组件代码失效，是否应用更改？")){
				this.sendNetMsg(NetMsgUtil.prototype.msgChange,["dataFlow",this.dataFlow]);
				this.code = "";
			}else{
				this.dataFlow = {
					from:[],
					to:[]
				};
				for(var i = 0;i < this.oldDataFlow.from.length;i++){
					this.dataFlow.from.push({id:this.oldDataFlow.from[i].id,type:this.oldDataFlow.from[i].type});
				}
				for(var i = 0;i < this.oldDataFlow.to.length;i++){
					this.dataFlow.to.push({id:this.oldDataFlow.to[i].id,type:this.oldDataFlow.to[i].type});
				}
			}
		}else{
			this.sendNetMsg(NetMsgUtil.prototype.msgChange,["dataFlow",this.dataFlow]);
		}
	},
	_disconnectDataDefinitionEvent:function(){
		dojo.disconnect(this.componentDataDefinitionApplyButtonHandle);
		dojo.disconnect(this.componentDataDefinitionButtonHandle);
		dojo.disconnect(this.componentDataDefinitionFromSelectOptionHandle);
		dojo.disconnect(this.componentDataDefinitionToSelectOptionHandle);
		dojo.disconnect(this.operateStatus0Handle);
		dojo.disconnect(this.operateStatus1Handle);
		dojo.disconnect(this.dialogHandle);
	},
	componentDataDefinition:function(){
		this.componentDataDefinitionDlg = dijit.byId("componentDataDefinitionDlg");
		this.componentDataDefinitionDlg.show();
		this.oldDataFlow = {
			from:[],
			to:[]
		};
		for(var i = 0;i < this.dataFlow.from.length;i++){
			this.oldDataFlow.from.push({id:this.dataFlow.from[i].id,type:this.dataFlow.from[i].type});
		}
		for(var i = 0;i < this.dataFlow.to.length;i++){
			this.oldDataFlow.to.push({id:this.dataFlow.to[i].id,type:this.dataFlow.to[i].type});
		}
		var createMultiSelect = function () {
			if(dijit.byId('componentDataFrom')) {
				this.operateStatus0 = dijit.byId("componentEditorOperateStatus0");
				this.operateStatus1 = dijit.byId("componentEditorOperateStatus1");
				this.modelDataFromMultiSelect = dijit.byId('componentDataFrom');
				this.modelDataToMultiSelect = dijit.byId('componentDataTo');
				this._connectDataDefinitionEvent();
				this.updateComponentDataDefinitionDlg();
			}else{
				var modelDataFromSelect = dojo.byId('componentDataFrom');
				var modelDataToSelect = dojo.byId('componentDataTo');
				this.operateStatus0 = dijit.byId("componentEditorOperateStatus0");
				this.operateStatus1 = dijit.byId("componentEditorOperateStatus1");
				this.modelDataFromMultiSelect = new dijit.form.MultiSelect({ name: 'componentDataFrom',style:"width:150px;height:125px;float:left;" }, modelDataFromSelect);
				this.modelDataFromMultiSelect.startup();
				this.modelDataToMultiSelect = new dijit.form.MultiSelect({ name: 'componentDataTo',style:"width:150px;height:125px;float:left;" }, modelDataToSelect);
				this.modelDataToMultiSelect.startup();
				this._connectDataDefinitionEvent();
				this.updateComponentDataDefinitionDlg();
			}
		};
		this.dialogHandle = dojo.connect(this.componentDataDefinitionDlg, "onDownloadEnd",this, createMultiSelect);
	},
	checkUniqueness: function(dataID,flowType){
		switch (flowType){
			case 0:
				for(var i = 0;i < this.dataFlow.from.length;i++){
					if(this.dataFlow.from[i].id == dataID){
						return false;
					}
				}
				break;
			case 1:
				for(var i = 0;i < this.dataFlow.to.length;i++){
					if(this.dataFlow.to[i].id == dataID){
						return false;
					}
				}
				break;
		}
		return true;
	},
	updateComponentDataDefinitionDlg: function() {
		var modelDataFromSelect = dojo.byId('componentDataFrom');
		var modelDataToSelect = dojo.byId('componentDataTo');
		/*var componentDataType = dojo.byId('componentDataType');
		length = componentDataType.childNodes.length;
		for (var i = 0; i < length; i++) {
			componentDataType.removeChild(componentDataType.childNodes[0]);
		}
		for (var i = 0; i < ControlUtil.prototype.modelDataType.length; i++) {
			var option = window.document.createElement('option');
			option.innerHTML = ControlUtil.prototype.modelDataType[i];
			option.value = ControlUtil.prototype.modelDataType[i];
			if (i == 0) {
				//option.selected = true;
			}
			componentDataType.appendChild(option);
		}*/
		var length = modelDataFromSelect.childNodes.length;
		for (var i = 0; i < length; i++) {
			modelDataFromSelect.removeChild(modelDataFromSelect.childNodes[0]);
		}
		for (var i = 0; i < this.dataFlow.from.length; i++) {
			var option = window.document.createElement('option');
			option.innerHTML = this.dataFlow.from[i].id;
			option.value = this.dataFlow.from[i].id;
			if (this.busConnect) {
				for (var j = 0; j < this.busConnect.dataFlow.busToModel.length; j++) {
					if (this.busConnect.dataFlow.busToModel[j].data.model == this.dataFlow.from[i].id) {
						//option.style = "color:red";
						dojo.addClass(option,"cannotDelete");
					}
				}
			}
			if (i == 0) {
				//option.selected = true;
			}
			modelDataFromSelect.appendChild(option);
		}
		length = modelDataToSelect.childNodes.length;
		for (var i = 0; i < length; i++) {
			modelDataToSelect.removeChild(modelDataToSelect.childNodes[0]);
		}
		for (var i = 0; i < this.dataFlow.to.length; i++) {
			var option = window.document.createElement('option');
			option.innerHTML = this.dataFlow.to[i].id;
			option.value = this.dataFlow.to[i].id;
			if (this.busConnect) {
				for (var j = 0; j < this.busConnect.dataFlow.modelToBus.length; j++) {
					if (this.busConnect.dataFlow.modelToBus[j].data.model == this.dataFlow.to[i].id) {
						//option.style = "color:red";
						dojo.addClass(option,"cannotDelete");
					}
				}
			}
			if (i == 0) {
				//option.selected = true;
			}
			modelDataToSelect.appendChild(option);
		}
	},
	isBusDataLinked:function(busDataID){
		if (this.busConnect) {
			for (var j = 0; j < this.busConnect.dataFlow.busToModel.length; j++) {
				if (this.busConnect.dataFlow.busToModel[j].data.bus == busDataID) {
					return true;
				}
			}
			for (var j = 0; j < this.busConnect.dataFlow.modelToBus.length; j++) {
				if (this.busConnect.dataFlow.modelToBus[j].data.bus == busDataID) {
					return true;
				}
			}
		}
		return false;
	},
	action:function(){
		switch(parseInt(this.status)){
			case 0:
				var componentDataFlowType = dijit.byId('componentDataFlowType');
				var componentDataID = dijit.byId('componentDataID');
				var componentDataType = dijit.byId('componentDataType');
				if(componentDataFlowType.isValid() && componentDataID.isValid() && componentDataType.isValid()){
					var dataID = componentDataID.get("value");
					var dataType = componentDataType.get("value");
					var flowType = parseInt(componentDataFlowType.get("value"));
					if(this.checkUniqueness(dataID,flowType)){
						this.addDataItem(flowType,dataID,dataType);
						this.updateComponentDataDefinitionDlg();
					}else{
						switch (flowType){
							case 0:
								alert("流入数据ID名重复");
								break;
							case 1:
								alert("流出数据ID名重复");
								break;
						}
					}
				}else{
					var error = "请";
					if(!componentDataFlowType.isValid()){
						error = error + "指定数据类别"
					}
					if(!componentDataID.isValid()){
						error = error + "填充数据ID"
					}
					if(!componentDataType.isValid()){
						error = error + "指定数据类型"
					}
					error = error + "!";
					alert(error);
				}
				break;
			case 1:
				var modelDataFrom = (dijit.byId("componentDataFrom")).get("value");
				var modelDataTo = (dijit.byId('componentDataTo')).get("value");
				for(var i = 0;i < modelDataFrom.length;i++){
					if(this.removeDataItem(0,modelDataFrom[i])){

					}else{
						alert("无法删除已连入总线的数据项");
					}
				}
				for(var i = 0;i < modelDataTo.length;i++){
					if(this.removeDataItem(1,modelDataTo[i])){

					}else{
						alert("无法删除已连入总线的数据项");
					}
				}
				this.updateComponentDataDefinitionDlg();
				break;
		}
	},
	clearSelect:function(modelDataFrom,modelDataTo){
		var modelDataFromSelect = dojo.byId('componentDataFrom');
		var modelDataToSelect = dojo.byId('componentDataTo');
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
	changeStatus:function(event){
		var button = dijit.byId("componentEditorOperate");
		var componentDataFlowType = dijit.byId('componentDataFlowType');
		var componentDataID = dijit.byId('componentDataID');
		var componentDataType = dijit.byId('componentDataType');
		switch(parseInt(event.target.value)){
			case 0:
				this.status = 0;
				button.setLabel("增加");
				componentDataFlowType.setDisabled(false);
				componentDataID.setDisabled(false);
				componentDataType.setDisabled(false);
				break;
			case 1:
				this.status = 1;
				button.setLabel("删除");
				componentDataFlowType.setDisabled(true);
				componentDataID.setDisabled(true);
				componentDataType.setDisabled(true);
				this.clearSelect(true,true);
				break;
		}
	},
	selectOption: function(event){
		switch(parseInt(this.status)){
			case 0:

				break;
			case 1:
				if(event.currentTarget != event.target){
					var modelDataFromSelect = dojo.byId('componentDataFrom');
					var modelDataToSelect = dojo.byId('componentDataTo');
					if(event.currentTarget == modelDataFromSelect){
						this.clearSelect(false,true);
					}else if(event.currentTarget == modelDataToSelect){
						this.clearSelect(true,false);
					}
				}else{
					this.clearSelect(true,true);
				}
				break;
		}

	},
	addDataItem:function(flowType/*0为from,1为to*/,id,type){
		switch (flowType){
			case 0:
				this.dataFlow.from.push({id:id,type:type});
				break;
			case 1:
				this.dataFlow.to.push({id:id,type:type});
				break;
		}
	},
	removeDataItem:function(flowType,id){
		switch (flowType){
			case 0:
				var temp = this.dataFlow.from;
				if(this.busConnect){
					for(var i = 0;i < this.busConnect.dataFlow.busToModel.length;i++){
						if(this.busConnect.dataFlow.busToModel[i].data.model == id){
							return false;
						}
					}
				}
				for(var i = 0;i<temp.length;i++){
					if(temp[i].id == id){
						this.dataFlow.from.splice(i,1);
						return true;
					}
				}
				break;
			case 1:
				var temp = this.dataFlow.to;
				if(this.busConnect) {
					for (var i = 0; i < this.busConnect.dataFlow.modelToBus.length; i++) {
						if (this.busConnect.dataFlow.modelToBus[i].data.model == id) {
							return false;
						}
					}
				}
				for(var i = 0;i<temp.length;i++){
					if(temp[i].id == id){
						this.dataFlow.to.splice(i,1);
						return true;
					}
				}
				break;
		}
		return false;
	},
	createUploaders:function(model){
		var parent = this;
		if(model){
			this.outputUploader = new qq.FineUploader({
				// Pass the HTML element here
				element: document.getElementById('dataConfigureOutputPath'),
				autoUpload: false,
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
						}
					}
				},
				text: {
					uploadButton: '浏览'
				},
				debug: true
			});
			//禁止同时上传多个文件
			dojo.aspect.before(this.outputUploader,"_onInputChange",function(){
				parent.outputUploader.clearStoredFiles();
			});
			dojo.aspect.after(this.outputUploader,"_onInputChange",function(input){
				dijit.byId("dataConfigureOutputName").set("value",parent.outputUploader._parseFileName(input));
			},true);
			this.inputUploader = new qq.FineUploader({
				// Pass the HTML element here
				element: document.getElementById('dataConfigureInputPath'),
				autoUpload: false,
				multiple: true,
				validation:{
					allowedExtensions:['cxsd']
				},
				request: {
					endpoint: "user_uploadBusConfigure.xhtml?processName="+os.mainProcess.name
				},
				callbacks: {
					onComplete: function(id, fileName, responseJSON){
						if(responseJSON.success){
						}
					}
				},
				text: {
					uploadButton: '浏览'
				},
				debug: true
			});
			//禁止同时上传多个文件
			dojo.aspect.before(this.inputUploader,"_onInputChange",function(){
				parent.inputUploader.clearStoredFiles();
			});
			dojo.aspect.after(this.inputUploader,"_onInputChange",function(input){
				dijit.byId("dataConfigureInputName").set("value",parent.inputUploader._parseFileName(input));
			},true);
		}else{
			this.outputCompleteUploader = new qq.FineUploader({
				// Pass the HTML element here
				element: document.getElementById('dataConfigureUploadPath'),
				autoUpload: false,
				multiple: true,
				validation:{
					allowedExtensions:['cxsd']
				},
				request: {
					endpoint: "user_uploadBusConfigure.xhtml?processName="+os.mainProcess.name
				},
				callbacks: {
					onComplete: function(id, fileName, responseJSON){
						if(responseJSON.success){
						}
					}
				},
				text: {
					uploadButton: '浏览'
				},
				debug: true
			});
			//禁止同时上传多个文件
			dojo.aspect.before(this.outputCompleteUploader,"_onInputChange",function(){
				parent.outputCompleteUploader.clearStoredFiles();
			});
			dojo.aspect.after(this.outputCompleteUploader,"_onInputChange",function(input){
				dijit.byId("dataConfigureUploadName").set("value",parent.outputCompleteUploader._parseFileName(input));
			},true);
		}
	},
	changeModel:function(event){
		switch(parseInt(event.target.value)){
			case 0:
				dijit.byId("dataConfigureOutputName").setDisabled(false);
				dijit.byId("dataConfigureInputName").setDisabled(false);
				this.outputUploader._button._element.show();
				this.inputUploader._button._element.show();
				break;
			case 1:
				dijit.byId("dataConfigureOutputName").setDisabled(true);
				dijit.byId("dataConfigureInputName").setDisabled(true);
				this.outputUploader._button._element.hide();
				this.inputUploader._button._element.hide();
				break;
		}
	},
	dataConfigure:function(){
		var dataConfigureDlg = dijit.byId("dataConfigureDlg");
		dataConfigureDlg.show();
		var parent = this;
		Component.prototype.myself = this;
		var create = function () {
			var isFirst = true;
			if(isFirst) {
				isFirst = false;
				var dataConfigureModel0 = dijit.byId("dataConfigureModel0");
				var dataConfigureModel1 = dijit.byId("dataConfigureModel1");
				dojo.connect(dataConfigureModel0, "onClick", parent, parent.changeModel);
				dojo.connect(dataConfigureModel1, "onClick", parent, parent.changeModel);
				parent.createUploaders(true);
			}
		};
		dojo.connect(dataConfigureDlg, "onDownloadEnd", create);
	},
	dataConfigureUpload:function(){
		var dataConfigureUploadDlg = dijit.byId("dataConfigureUploadDlg");
		dataConfigureUploadDlg.show();
		var parent = this;
		var create = function () {
			var isFirst = true;
			if(isFirst) {
				isFirst = false;
				parent.createUploaders(false);
			}
		};
		dojo.connect(dataConfigureUploadDlg, "onDownloadEnd", create);
	},
	dataConfigureApply:function(){
		var dataConfigureDlg = dijit.byId("dataConfigureDlg");
		dataConfigureDlg.hide();
		//
		window.open("user_JNLPLaunch.xhtml?componentName=jwstank");
		//
		Component.prototype.myself.dataConfigureUpload();
	},
	dataConfigureAbolish:function(){
		var dataConfigureDlg = dijit.byId("dataConfigureDlg");
		dataConfigureDlg.hide();
	},
	dataConfigureUploadApply:function(){
		//

		//
		var dataConfigureUploadDlg = dijit.byId("dataConfigureUploadDlg");
		dataConfigureUploadDlg.hide();
	},
	dataConfigureViewer:function(){

	}
});
