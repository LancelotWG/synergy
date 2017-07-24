var CustomMethods = {
   _startDrag: function(e) {
      for ( var i = 0 ; i < this.currentDragObjects.length ; i++ )
         this.currentDragObjects[i].startDrag();

      this._makeDraggableObjectVisible(e);
	  //覆盖此方法，当ctrl键被按下时修改移动方式为copy
	  if(e.ctrlKey) this.moveStyle = "copy";
   },
   _cancelDrag: function() {
      for ( var i = 0 ; i < this.currentDragObjects.length ; i++ )
         this.currentDragObjects[i].cancelDrag();
	   //覆盖此方法，当ctrl键被按下时修改移动方式为move
	  this.moveStyle = "move";
   },

   _endDrag: function() {
      for ( var i = 0 ; i < this.currentDragObjects.length ; i++ )
         this.currentDragObjects[i].endDrag();
		 
	   //覆盖此方法，当ctrl键被按下时修改移动方式为move
	  this.moveStyle = "move";
   },
   _updateDropZonesHover: function(e) {
      var n = this.dropZones.length;
      for ( var i = 0 ; i < n ; i++ ) {
         if ( ! this._mousePointInDropZone( e, this.dropZones[i] ) )
            this.dropZones[i].hideHover();
      }

      for ( var i = 0 ; i < n ; i++ ) {
         if ( this._mousePointInDropZone( e, this.dropZones[i] ) ) {
            if ( this.dropZones[i].canAccept(this.currentDragObjects) )
               this.dropZones[i].showHover();
         }
      }
   },  
   _activateRegisteredDropZones: function() {
      var n = this.dropZones.length;
      for ( var i = 0 ; i < n ; i++ ) {
         var dropZone = this.dropZones[i];
         if ( dropZone.canAccept(this.currentDragObjects) )
            dropZone.activate();
      }

      this.activatedDropZones = true;
	   //刷新流程
	   if(process){
		   process.validate();
	   }
	  //计算受影响的Dropzones
   	  this.affectedDropzonesIndexs = caculateAffectedDropzones();
	  if(!this.affectedDropzonesIndexs) return;
	  //将受影响的Dropzones的canDop属性设置为false
	  for (var i=0; i<this.affectedDropzonesIndexs.length; i++) {
	      var index = this.affectedDropzonesIndexs[i];
		  this.dropZones[index].canDrop = false;
	  };
   },
   _deactivateRegisteredDropZones: function() {
  
      var n = this.dropZones.length;
      for ( var i = 0 ; i < n ; i++ ){
	  	this.dropZones[i].deactivate();
	  }   
      this.activatedDropZones = false;
	  //刷新流程
	   if(process){
		   process.validate();
	   }
	  if(!this.affectedDropzonesIndexs) return;
	  //将受影响的Dropzones的canDop属性设置为true
	  for (var i=0; i<this.affectedDropzonesIndexs.length; i++) {
	      var index = this.affectedDropzonesIndexs[i];
		  this.dropZones[index].canDrop = true;
	  };
   }				
}
/**
 *  Sample 'CustomDraggable' object which extends the Rico.Draggable to
 *  override the behaviors associated with a draggable object...
 **/
var CustomDraggableMethods = {
 
   initialize: function( htmlElement, name, root, id) {
      this.type        = 'Custom';				 
      this.htmlElement = $(htmlElement); 
      this.name        = name;
	  this.id        = id;
	  //root代表拖拽根源，可以是来自palette或者来自activity
	  this.root        = root;
	
   },
 
   select: function() {
	   editorMenuType = false;//组件编辑状态
	  // editorComponent = this.htmlElement;//选中组件
      this.selected = true;
      var comp = this.htmlElement.childNodes;
 
      // show the item selected.....
	   //el.style.color           = "#000000";
	   //el.childNodes[2].style.backgroundColor="red"
	   for(var i = 0;i<comp.length;i++){
		   var el = comp[i];
		   if(this.root=='palette'){
//	  	   this.restoreBgcolor = el.style.backgroundColor;
//      	   el.style.backgroundColor = "#b3ffff";
		   }else{
			   if (isComponent(el)) {
				   /*this.restoreBgcolor = el.style.backgroundColor;
				   el.style.backgroundColor = "#3399FF";*/
			   }else if(isBusConnect(el)){
				   /*this.restoreBusConnectBgcolor = el.style.backgroundColor;
				   el.style.backgroundColor = "#3399FF";*/
			   }/*else if(isControlFlow(el)){
				   this.restoreControlFlowtBgcolor = el.style.backgroundColor;
			   }*//* else {
				   dojo.addClass(el, "containerSelected");
			   }*/
			   //showBtn(el);
		   }
	   }

   },
 
   deselect: function() {
	   editorMenuType = true;//全局编辑状态
	  // editorComponent = null;//取消选中
      this.selected = false;
      var comp = this.htmlElement.childNodes;
	   for(var i = 0;i<comp.length;i++){
		   var el = comp[i];
		   el.style.color           = "#2b2b2b";
		   /*if(this.root=='palette'){
//	       el.style.backgroundColor = this.restoreBgcolor;
		   }else{
			   /!*if(dojo.hasClass(el,"containerSelected")){
				   dojo.removeClass(el,"containerSelected");
			   }else *!/if (isComponent(el)) {
				   el.style.backgroundColor = util.unSelectColor;
				   //el.style.backgroundColor = "#3399FF";
			   }else if(isBusConnect(el)){
				   el.style.backgroundColor = util.unSelectTransparentColor;
			   }/!*else if(isControlFlow(el)){
				   el.style.backgroundColor = this.restoreControlFlowtBgcolor;
			   }*!/
			   //hideBtn(el);
		   }*/
	   }
   },	
   startDrag: function() {
   	   dndManager.dragging = true;
	   },
   cancelDrag: function() {
   	   dndManager.dragging = false;
	   },
   endDrag: function() {
   	  dndManager.dragging = false;
	   },

   //此处生成拖拽过程中的反馈形状
   getSingleObjectDragGUI: function() {
	   //用于判断drop的类型
	   if(this.name == "OS"){
		   dropType = 3;
	   }else if(this.name == "BusConnect"){
		   dropType = 2;
	   }else if(this.name == "ControlFlow"){
		   dropType = 1;
	   }else{
		   dropType = 0;
	   }
      var comp = reg.getComponentById(this.id);
	  var feedback = new Feedback({
	  	  type: comp?comp.type:this.name,
		  name: comp?comp.name:this.name
	  });
	   //获取正在移动的组件
	   draggingComponent = reg.getComponentById(this.id);
	  //半透明
	  $(feedback.node).setOpacity(0.5);
	  Rico.Corner.round(feedback.node,{corners:"all", color: "transparent"});
	   //Rico.Corner.round(element, {color:"transparent"});
	  return feedback.node;
   },
   //此处生成Drop后的形状
   getDroppedGUI: function() {	 
   	  if(this.root=="activity"){
	  	  this.comp = reg.getComponentById(this.id);
		  //如果该名字已经在reg中注册了，并且移动方式为move，就直接返回this.comp
		  if(this.comp){
		      var result = dndManager.moveStyle == "move" ? this.comp : dojo.clone(this.comp); 
		  	  return result;
		  }	
	  }
   	 //var complexActs = ["Sequence","Parallel","ForEach","IfElse","Approval"];
	  //var index = complexActs.indexOf(this.name);
	   var comp;
	   if(this.name == "OS"){
		   comp = new OS({refNode:$("maincontent")});
		   return comp;
	   }else if(this.name == "ControlFlow"){
		   comp = new ControlFlow();
		   return comp;
	   }else if(this.name == "BusConnect"){
		   comp = new BusConnect();
		   return comp;
	   }else{
		   /*var parent  = process;
		   var component = null;
		   while(parent != os.mainProcess){
			   component = parent.parentComponent;
			   parent = component.parent;
			   if(parent == null){
				   break;
			   }
		   }*/
		   if(process == os.mainProcess){
			   comp = new Component({type:this.name,mainType:this.name});
		   }else{
			   comp = new Component({type:this.name,mainType:process.parentComponent.mainType});
		   }
		   //InplaceEditor
		   if(comp.nameField) new InplaceEditor({},comp.nameField);
		   //圆角
		   Rico.Corner.round(comp.node, {corners:"all", color: "transparent"});
		   //将创建好的组件也注册为可移动的
		   dndManager.registerDraggable(new CustomDraggable(comp.node, comp.name, "activity", comp.id));

		   reg.registry(comp);
		   return comp;
	   }

	  /*if (index != -1) {
	  	switch (index) {
	  		case 0:
				comp = new Sequence({type:"Sequence"});
				dndManager.registerDropZone(new CustomDropzone(comp.placeholder));
	  			break;
	  		case 1:
				comp = new Parallel({type:"Parallel"});
				break;
	  		case 2:
				comp = new ForEach({type:"ForEach"}); 
	  			break;
	  		case 3:
				comp = new IfElse({type:"IfElse"});
	  			break;
	  		default:
                comp = new Approval({type:"Approval"});
                break;
	  	}
	  }
	  else {*/

	 //}

   },
 
   toString: function() {
      return this.name;
   }
 
};
var CustomDropMethods = {
	//模块移动
	activate: function(){
		//流程锁定
		if(process){
			if(process.locked){
				//alert("此流程被锁定！");
				return;
			}
		}else{

		}
		if(process != null){
			var component0 = process.parentComponent;
			if(component0 == null){
				//软件系统主管
				if(roleControl(0, null)){

				}else{
					return ;
				}
			}else{
				var component1 = process.parentComponent.parent.parentComponent;
				if(component1 == null){
					//软件构件主管
					if(roleControl(1, component0.type)){

					}else{
						return ;
					}
				}else{
					//软件设计人员
					if(roleControl(2, null)){

					}else{
						return ;
					}
				}
			}
		}
		//流程锁定
		//组建控制流锁定
		if(draggingComponent){
			var parent = draggingComponent.parent;
			var index = parent.children.indexOf(draggingComponent,0);
			if((parent.children[index+1] instanceof ControlFlow)||(parent.children[index-1] instanceof ControlFlow)){
				return;
			}
		}
		//组建控制流锁定
		var htmlElement = this.getHTMLElement();
		if (htmlElement == null || this.showingActive) 
			return;
		
		this.showingActive = true;
		this.saveBackgroundColor = htmlElement.style.backgroundColor;
		
		var fallbackColor = "#ffea84";
		var currentColor = Rico.Color.createColorFromBackground(htmlElement);
		if (currentColor == null) 
			htmlElement.style.backgroundColor = fallbackColor;
		else {
			currentColor.isBright() ? currentColor.darken(0.2) : currentColor.brighten(0.2);
			htmlElement.style.backgroundColor = currentColor.asHex();
		}
		//显示占位符
		switch (dropType){
			case 0:
				if(dojo.hasClass(htmlElement,"dropAfter")){
					htmlElement.style.display = "block";
				}
				break;
			case 1:
				if(dojo.hasClass(htmlElement,"dropAfter")){
					if(isStart(htmlElement.previousSibling)||isStart(htmlElement.nextSibling)){
						htmlElement.style.display = "none";
					}else{
						htmlElement.style.display = "block";
					}
				}
				break;
			case 2:
				if(dojo.hasClass(htmlElement,"busConnectDrop")){
					htmlElement.style.display = "block";
				}
				break;
			case 3:
				if(dojo.hasClass(htmlElement,"OSPlaceholder")){
					htmlElement.style.display = "block";
				}
				break;
		}
		/*if(showBusConnect){
			if(dojo.hasClass(htmlElement,"busConnectDrop")){
				htmlElement.style.display = "block";
			}
		}else{
			if(!dojo.hasClass(htmlElement,"busConnectDrop")){
				htmlElement.style.display = "block";
				if(isStart(htmlElement.previousSibling)){

				}
			}
		}*/
		//激活隐藏分支
		/*dojo.forEach(sortByHierarchy(getAllParallels(process)), function(item, i){
			var lastChd = item.children[item.children.length - 1];
			if (lastChd.node.style.display == "none") {
				//拖拽的对象
				var dragObj = reg.getComponentByName(dndManager.currentDragObjects[0].name);
				//多加入一个dragFromActivity，防止组件类型与组件名一致所引起的无法激活隐藏分支BUG
				var dragFromActivity = dndManager.currentDragObjects[0].root == "activity"
				if (dragObj && dragFromActivity) {
					var dragFromParallel;
					//如果拖拽对象的parent或parent的parent是该Parallel，那么不应该激活隐藏分支，以避免做无谓的移动
					if (dragObj.parent == item || dragObj.parent.parent == item) 
						dragFromParallel = true;
					var dontShowHidden = dndManager.moveStyle == "move" && dragFromParallel;
					if (!dontShowHidden) {
						lastChd.node.style.display = "block";
						try {
							item.drawLines();
						} 
						catch (e) {
						
						}
					}
				}
				else {
					lastChd.node.style.display = "block";
					try {
						item.drawLines();
					} 
					catch (e) {
					
					}
				}
			}
		});*/
	},
	//模块停止移动
	deactivate: function(){
		var htmlElement = this.getHTMLElement();
		if (htmlElement == null || !this.showingActive) 
			return;
		
		htmlElement.style.backgroundColor = this.saveBackgroundColor;
		this.showingActive = false;
		this.saveBackgroundColor = null;
		
		//隐藏占位符
		/*if (!YAHOO.util.Dom.hasClass(htmlElement, 'dropAfterAndBefore'))*/
			htmlElement.style.display = "none";
		//此时dndMgr.dropZones已经发生了变化，新创建的组件已经注册进去了，所以无法捕捉到最后一个占位符的 deactivate事件 
		//隐藏隐藏分支
		/*dojo.forEach(getAllParallels(process), function(item, i){
			if (item.children.length > 2) {
				var lastChd = item.children[item.children.length - 1];
				var isHiddenBranch = dojo.filter(lastChd.children, function(item){
					return isRealChild(item);
				}).length ==
				0;
				if (isHiddenBranch && lastChd.node.style.display == "block") 
					lastChd.node.style.display = "none";
			}
		});*/
	},
	//鼠标悬停在放置占位符上方时
	showHover: function(){
		var htmlElement = this.getHTMLElement();
		if (htmlElement == null || this.showingHover) 
			return;
		
		/*this.saveBorderWidth = htmlElement.style.borderWidth;
		this.saveBorderStyle = htmlElement.style.borderStyle;
		this.saveBorderColor = htmlElement.style.borderColor;*/
		this.saveBackgroundColor1 = htmlElement.style.backgroundColor;
		//dojo.addClass(htmlElement,"mouseHover");
		this.showingHover = true;
		htmlElement.style.backgroundColor="#ff0000";
		/*htmlElement.style.borderWidth = "1px";
		htmlElement.style.borderStyle = "solid";
		htmlElement.style.borderColor = "#ff0000";*/
	},
	hideHover: function() {
		var htmlElement = this.getHTMLElement();
		if ( htmlElement == null || !this.showingHover )
			return;

		/*htmlElement.style.borderWidth = this.saveBorderWidth;
		htmlElement.style.borderStyle = this.saveBorderStyle;
		htmlElement.style.borderColor = this.saveBorderColor;*/
		//dojo.removeClass(htmlElement,"mouseHover");
		htmlElement.style.backgroundColor = this.saveBackgroundColor1;
		this.showingHover = false;
	},
	initialize: function(wrappedObj){
		this.wrappedObj = wrappedObj;
		if (!wrappedObj.node) 
			throw new Error("Arguments error! Class:CustomDropZone accept a wrapped object as its arguments,which must has an attribute called node");
		this.htmlElement = wrappedObj.node;
		this.absoluteRect = null;
		this.canDrop = true;
	},	
	accept: function(draggableObjects){


		if (!this.canDrop)
			return;
		isDirty = true;
		var htmlElement = this.getHTMLElement();
		if (htmlElement == null) 
			return;
		var n = draggableObjects.length;
		for (var i = 0; i < n; i++) {
			//此处直接得到的并不是Dom节点，而是节点对应的包装对象
			var wrappedObj = draggableObjects[i].getDroppedGUI();

			if(wrappedObj instanceof OS){
				os = wrappedObj;
				//var theGUI = wrappedObj.node;
				//dojo.place(theGUI,htmlElement, "after");
				mainFrame.createProject();
				os.sendNetMsg(NetMsgUtil.prototype.msgNew);
				os.freshen();
				return;
			}

			if(wrappedObj instanceof ControlFlow){
				var parent = this.wrappedObj.parent;
				wrappedObj.parent = parent;
				var theGUI = wrappedObj.node;
				dojo.place(theGUI,htmlElement, "after");
				parent.addControlFlow(this.wrappedObj,wrappedObj);
				//parent.node.removeChild(this.wrappedObj.node);
				wrappedObj.sendNetMsg(NetMsgUtil.prototype.msgNew);
				parent.validate();
				return;
			}

			if(wrappedObj instanceof BusConnect){
				var comp = this.wrappedObj.parent;
				wrappedObj.parent = comp;
				//删除Dom元素
				/*comp.node.removeChild(this.wrappedObj.node);*/
				var theGUI = wrappedObj.node;
				dojo.place(theGUI, comp.componentNode, "after");
				comp.addBusConnect(wrappedObj);
				wrappedObj.sendNetMsg(NetMsgUtil.prototype.msgNew);
				return;
			}
			//htmlElement和theGUI具有相同的parent,将htmlElement的parent指定给wrappedObj
			var parent = this.wrappedObj.parent;
			var moveOrCopy;
			//如果wrappedObj.parent存在，说明是move或者copy
			if (wrappedObj.parent) {
				moveOrCopy = true;
			}
			
			var theGUI = wrappedObj.node;
			
			if (RicoUtil.getElementsComputedStyle(theGUI, "position") == "absolute") {
				theGUI.style.position = "static";
				theGUI.style.top = "";
				theGUI.style.top = "";
			}
			var isMove = false;
			var operatingMode = ControlUtil.prototype.ComponentCreateMode;
			var oldIndex;
			if (dndManager.moveStyle == "move" && moveOrCopy) {
				oldIndex = wrappedObj.parent.children.indexOf(wrappedObj,0);
				wrappedObj.parent.removeChild(wrappedObj);
				operatingMode = ControlUtil.prototype.ComponentMoveMode;
				isMove = true;
			}
			//Sequence的addChild方法会判断前一个占位符的类型，所以必须等新创建的节点被加入到Dom中后才能使用它
			dojo.place(theGUI, htmlElement, "after");
			parent.addChild(wrappedObj,operatingMode,oldIndex);
			//parent.sendNetMsg();
			//网络通信
			/*if(isMove){
				wrappedObj.sendNetMsg(NetMsgUtil.prototype.msgChange,["position",oldIndex]);
			}*/
			//如果是隐藏分支，先为隐藏分支生成TreeNode
			/*var grandParent = wrappedObj.parent.parent;
			if (grandParent instanceof Parallel && grandParent.dropOnHiddenBranch) {
				wrappedObj.parent.generateTreeNode(isMove);
			}
			else */
			wrappedObj.generateTreeNode(isMove);
		}
	}
};