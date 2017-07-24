/**
 * Usage:new Sequence.Process({type:"Untitled Process",refNode:node});
 */

dojo.declare("Sequence.Process",Sequence,{
	roles:null,
	pvs:null,
	exps:null,
	parentComponent:null,
	locked:false ,
	keyHolder:null,
	//主流程标识
	isMainProcess:false,
	//流程属性
	property:null,
	palette:null,
	parentComponentDataFlow:null,
	newParentComponentDataFlow:null,
	parentComponentDataFlowType:null,
	constructor:function(args){
		this.roles = new Array();
		this.pvs = new Array();
		this.exps = new Array();
		this.keyHolder = new Array();
		this.property = new Array();
		this.parentComponentDataFlow = [];
		this.newParentComponentDataFlow = [];
		this.parentComponentDataFlowType = [];
		//this.sendNetMsg();
		//this.fillProps();
	},
	fillProps:function(){
		this.inherited(arguments);
//		this.props.push({name:"Process Definition Name: ",dojoType:"dijit.form.TextBox"});
//		this.props.push({name:"Process Definition Description: ",dojoType:"dijit.form.TextBox"});
		this.props.push({name:"Start Date: ",dojoType:"dijit.form.DateTextBox"});
		this.props.push({name:"End Date: ",dojoType:"dijit.form.DateTextBox"});
	},
	_getAllCodeList:function(){
		var childList = [];
		for(var i = 0;i<this.children.length;i++){
			var child = this.children[i];
			if(child instanceof Component) {
				if (child.subProcess != null) {
					childList = childList.concat(child.subProcess._getAllCodeList());
				}
				var childCodeGeneration = new CodeGeneration(child);
				childList.push(childCodeGeneration);
				/*if(child.type == "Custom"){
					var childCodeGeneration = new CodeGeneration(child);
					childList.push(childCodeGeneration);
				}else{
					var isRepeat = false;
					for(var j = 0;j < childList.length;j++){
						if(childList[j].type == child.type){
							isRepeat = true;
							break;
						}
					}
					if(!isRepeat){
						var childCodeGeneration = new CodeGeneration(child);
						childList.push(childCodeGeneration);
					}
				}*/
			}
		}
		return childList;
	},
	_getAllStatementCodeList:function(){
		var childList = [];
		for(var i = 0;i<this.children.length;i++){
			var child = this.children[i];
			if(child instanceof Component) {
				if (child.subProcess != null) {
					childList = childList.concat(child.subProcess._getAllStatementCodeList());
				}
				var childCodeGeneration = new CodeGeneration(child);
				childList.push(childCodeGeneration);
				/*if(child.type == "Custom"){
					 var childCodeGeneration = new CodeGeneration(child);
					 childList.push(childCodeGeneration);
				 }else{
					 var isRepeat = false;
					 for(var j = 0;j < childList.length;j++){
						 if(childList[j].type == child.type){
							 isRepeat = true;
							 break;
						 }
					 }
					 if(!isRepeat){
						 var childCodeGeneration = new CodeGeneration(child);
						 childList.push(childCodeGeneration);
					 }
				 }*/
			}
		}
		if(this == os.mainProcess){
			for(var i = 0;i < childList.length;i++){
				var type = childList[i].type;
				if(type == "Custom"){

				}else {
					for (var j = 0; j < childList.length; j++) {
						if (i != j) {
							if (type == childList[j].type) {
								childList.splice(j, 1);
								i--;
								j--;
							}
						}
					}
				}
			}
		}
		return childList;
	},
	codeGeneration:function(){
		var string = "";
		var childStatementList = this._getAllStatementCodeList();
		var childList = this._getAllCodeList();
		for(var i = 0;i<childStatementList.length;i++){
			string += childStatementList[i].getToStructDefinition();
		}
		for(var i = 0;i<childList.length;i++){
			string += childList[i].getStatementStringStream();
		}
		childList.push(new CodeGeneration ({type:"MAIN",
			subProcess:this,
			dataFlow: {from:[],to:[]},
			busConnect:{
				dataFlow:{busToModel:[],modelToBus:[]}
			},
			code:"",
			parent:{parentComponent:null}}
		));
		for(var i = 0;i<childList.length;i++){
			string += childList[i].getDefinitionStringStream();
		}
		console.log(string);
		return string;
	},
	getOldParentComponentDataFlow:function(){
		var temp = [];
		for(var i = 0;i<this.parentComponentDataFlow.length;i++){
			temp.push(this.parentComponentDataFlow[i]);
		}
		return temp;
	},
	getParentComponentDataFlow:function(){
		var temp = [];
		for(var i = 0;i<this.newParentComponentDataFlow.length;i++){
			temp.push(this.newParentComponentDataFlow[i]);
		}
		return temp;
	},
	isAllParentComponentDataFlowDelete:function(){
		if(this.parentComponent == null){
			return false;
		}
		var busConnect = this.parentComponent.busConnect;
		if(busConnect == null){
			return false;
		}else{
			return busConnect.isAllDelete;
		}
	},
	setNewParentComponentDataFlow:function(){
		var temp = [];
		var tempType = [];
		if(this.parentComponent == null){
			return ;
		}
		var busConnect = this.parentComponent.busConnect;
		if(busConnect == null){
			return ;
		}
		var dataFlows = busConnect.dataFlow;
		var busToModel = dataFlows.busToModel;
		var modelToBus = dataFlows.modelToBus;
		for(var i = 0;i<busToModel.length;i++){
			var isUniqueness = true;
			for(var t = 0;t < temp.length;t++){
				if(busToModel[i].data.bus == temp[t]){
					isUniqueness = false;
					break;
				}
			}
			if(isUniqueness){
				temp.push(busToModel[i].data.bus);
				for(var j = 0;j < bus.dataFlow.length;j++) {
					for (var t = 0; t < bus.dataFlow[j].data.length; t++) {
						if(bus.dataFlow[j].data[t].id == busToModel[i].data.bus){
							tempType.push(bus.dataFlow[j].data[t].type);
							break;
						}
					}
				}
			}
		}
		for(var i = 0;i<modelToBus.length;i++){
			var isUniqueness = true;
			for(var t = 0;t < temp.length;t++){
				if(modelToBus[i].data.bus == temp[t]){
					isUniqueness = false;
					break;
				}
			}
			if(isUniqueness) {
				temp.push(modelToBus[i].data.bus);
				for (var j = 0; j < bus.dataFlow.length; j++) {
					for (var t = 0; t < bus.dataFlow[j].data.length; t++) {
						if (bus.dataFlow[j].data[t].id == modelToBus[i].data.bus) {
							tempType.push(bus.dataFlow[j].data[t].type);
							break;
						}
					}
				}
			}
		}
		this.parentComponentDataFlowType = tempType;
		this.newParentComponentDataFlow = temp;
	},
	getParentComponentDataFlowType:function(){
		var temp = [];
		for(var i = 0;i<this.parentComponentDataFlowType.length;i++){
			temp.push(this.parentComponentDataFlowType[i]);
		}
		return temp;
	},
	setParentComponentDataFlow:function(){
		this.parentComponentDataFlow = this.newParentComponentDataFlow;
	},
	addPaletteContentPane:function(data){
		for(var i = 1;i<data.length;i++){
			var modelName = data[i].split("_");
			var name = modelName[0];
			for(var j = 1;j<modelName.length - 1;j++){
				name = name + "_" + modelName[j]
			}
			this.palette.drawers[0].children.push({
				displayName:name,
				imgSrc:name+".png",
				type:name,
				treeIcon:name+".png"
			});
		}
	},
	_clearPaletteContentPane:function(){
		var ContentPane = dijit.byId("compContainer");
		var palettes = ContentPane.getChildren();
		for(var i = 0;i<palettes.length;i++){
			ContentPane.removeChild(palettes[i]);
		}
	},
	createPaletteContentPane:function(){
		this._clearPaletteContentPane();
		if(this.isMainProcess){
			this.palette = configObj;
		}
		dojo.forEach(this.palette.drawers, function (item) {
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
	initDomNode: function(){
		this.children = new Array();
		this.node = dojo.create("div",{
			id:"process",
			className:"Sequence Activity",
			dojoType:"dojox.layout.ScrollPane"			
		},this.refNode,this.pos);
		this.start = new Start({
			parent: this,
			refNode: this.node,
			pos: "first",
			name: "Start"
		});
		/*var arrow = new Arrow({parent:this,refNode:this.start.node,pos:"after"});*/
		var ph = new Placeholder({
			parent: this,
			refNode: this.start.node,
			pos: "after",
			type: "dropAfter"
		});
		ph.dropZone = new CustomDropzone(ph);
		dndManager.registerDropZone(ph.dropZone);
		//dndManager.registerDropZone(new CustomDropzone(ph));
		this.stop = new Start({
			parent: this,
			refNode: ph.node,
			pos: "after",
			name: "Stop"
		});
		this.children.push(this.start);
		/*this.children.push(arrow);*/

		this.children.push(ph);
		this.children.push(this.stop);
		YD.setStyle(this.start.node,"display","none");
		YD.setStyle(this.stop.node,"display","none");
		if(this.isMainProcess){
			this.palette = configObj;
		}else{
			this.palette = {
				drawers:[
					{
						title:"飞控组件",
						initOpen:true,
						children:[
							{
								displayName:"自定义组件",
								imgSrc:"Custom.png",
								type:"Custom",
								treeIcon:"Custom.png"
							}
						]
					},
					{

						title: "传输组件",
						initOpen: false,
						children: [
							{
								displayName: "传输控制",
								imgSrc: "ControlFlow.png",
								type: "ControlFlow"
							},
							{
								displayName: "总线交联",
								imgSrc: "BusConnect.png",
								type: "BusConnect"
							}
						]
					}
				]
			};
		}
		//this.validate();
//		this.nameField = dojo.create("label",{
//		  	  className:"name_lbl",
//			  innerHTML:this.name},this.node,"first");
	},
	sortChildren:function(){
		var first = this.start.node;
		var next = first.nextSibling;
		var i=1;
		while(next!=null){
			var obj = this.getObjectByDom(next);
			if(i!=obj.pos){
				var temp = this.children[i];
				this.children[i] = obj.value;
				this.children[obj.pos] = temp;
			}
			next = next.nextSibling;
			i++;
		}
	},
	displayBorder:function(){
		
	},
	sendNetMsg:function(operate,additiveAttribute){
		/*switch (type){
			case 0:
				if(this.parentComponent != null){
					var msg = new NetMsg(1,this,this.parentComponent.name);
					msg.msgSend();
				}
				break;
			case 1:
				if(this.parentComponent != null){
					var msg = new NetMsg(3,this,this.name);
					msg.msgSend();
				}
				break;
		}*/
		switch (operate){
			case NetMsgUtil.prototype.msgNew:
				var msg = new NetMsg(NetMsgUtil.prototype.msgNew,this,this.parentComponent.name);
				msg.msgSend();
				break;
			case NetMsgUtil.prototype.msgChange:
				/*if(additiveAttribute[0] == "name"){
					var msg = new NetMsg(NetMsgUtil.prototype.msgChange,this,["name",additiveAttribute[1]]);
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
		/*for(var i=0;i<this.children.length;i++) {
			var child = this.children[i];
			if((child instanceof Component)){
				var msg = new NetMsg(1,child);
				msg.msgSend();
			}
		}*/
	},
	addControlFlow:function(removePlaceholder,child){
		this.children.push(child);
		this.sortChildren();
		var index = this.children.indexOf(removePlaceholder,0);
		var removeDrop = this.children[index];
		this.children.splice(index,1);
		//删除Dom元素
		this.node.removeChild(removePlaceholder.node);
		dndManager.deregisterDropZone(removeDrop.dropZone);
	},
	removeControlFlow:function(controlFlow){
		//controlFlow = getComponentByDomNode(controlFlow.previousSibling.childNodes[0], true);
		var ph = new Placeholder({
			parent: this,
			refNode: controlFlow.node,
			pos: "before",
			type: "dropAfter"
		});
		ph.dropZone = new CustomDropzone(ph);
		dndManager.registerDropZone(ph.dropZone);
		//dndManager.registerDropZone(new CustomDropzone(ph));
		this.children.push(ph);
		var index = this.children.indexOf(controlFlow,0);
		controlFlow = this.children[index];
		this.children.splice(index,1);
		this.node.removeChild(controlFlow.node);
		this.validate();
	}
});