/**
 * @author Administrator
 */
function isDropAfter(el){
	return dojo.hasClass(el,"dropAfter");
}
function isDropBefore(el){
	return dojo.hasClass(el,"dropBefore");
}
function isDropAfterAndBefore(el){
	return dojo.hasClass(el,"dropAfterAndBefore");
}
function isBus(el){
	return (el instanceof Bus)||dojo.hasClass(el,"Bus");
}
function isComponent(el){
	return (el instanceof Component)||dojo.hasClass(el,"Component");
}
function isBusConnect(el){
	return dojo.hasClass(el,"BusConnect");
}
function isControlFlow(el){
	if(el == null){
		return false;
	}
	return dojo.hasClass(el,"ControlFlow");
}
function isSequence(el){
	return dojo.hasClass(el,"Sequence");
}
function isParallel(el){
	return dojo.hasClass(el,"Parallel");
}
function isIfElse(el){
	return dojo.hasClass(el,"IfElse");
}
function isApproval(el){
    return dojo.hasClass(el,"Approval");
}
function isForEach(el){
	return dojo.hasClass(el,"ForEach");
}
function isStart(el){
	return dojo.hasClass(el,"Start");
}
function isRealChild(chd){
	return chd instanceof Component||isContainer(chd);
}
function isContainer(el){
	return (el instanceof Sequence)/*||(el instanceof Parallel)||(el instanceof IfElse)||(el instanceof ForEach)*/;
}
function isNeedDrawLines(el){
	return (el instanceof Parallel)||(el instanceof IfElse)||(el instanceof ForEach);
}
function getHeight(el){
	var height = 0;
	if(!isContainer(el)){
		height = el.getHeight();
	}else if(el instanceof Sequence){
		if(el.node.style.display=="none") return 0;
		//计算补白
//		if(el.showBorder) height += el.Hpadding*2;
		for (var i=0; i<el.children.length; i++) {
			var child = el.children[i];
			//不能计算隐藏元素的高度
			if(YD.getStyle(child.node,"display")=="none") continue;
			else if(child.node.className=="pad") continue;
			var h = getHeight(child);
			height += h;	
		};
	}
	/*else if(el instanceof Parallel){
		if(!el.state.expanded) height = el.getHeight();
		else{
			height = el.defaultForkSize+el.defaultJoinSize+el.CanvasHeight*2;
			var maxH = 0; 
			var branches = el.branches ? el.branches:el.children;
			for (var i=0; i<branches.length; i++) {
		        var branch = branches[i];
				var h = getHeight(branch);
				if(h>maxH){
					maxH = h;
				}
			};
			height += maxH;
		}		
	}else if(el instanceof IfElse){
		if(!el.state.expanded) height = el.getHeight();
		else height = el.forkSize + el.joinSize + 36 + el.getHigherBranch().h;		
	}else if(el instanceof ForEach){
		if(!el.state.expanded) height = el.getHeight();
		else height = el.forkSize + el.joinSize + el.VSpace*2 + getHeight(el.seq);
	}*/
	return height;
}
/*
 * 计算真实宽度（包括补白）
 */
function getWidth(el){
	var width = 0;
	if(!isContainer(el)){
		width = el.getWidth();
	}else if(el instanceof Sequence){
		if(el.node.style.display=="none") return 0;
		var max = 0;	
		for (var i=0; i<el.children.length; i++) {
			var child = el.children[i];
			if(!child) continue;
			var w = getWidth(child);
			if(child.defaultSize<w) continue;
			if(w>max){
				max = w;
			}			
		};
		width = max;
		//如果显示边界，宽度才要加上补白
		if(el.showBorder)
			width += el.Hpadding*2;
	}
	/*else if(el instanceof Parallel){
		if(!el.state.expanded) width = el.getWidth();
		else{
			width = el.Hpadding*2;
			var branches = el.branches?el.branches:el.children;
			for (var i=0; i<branches.length; i++) {
				var branch = branches[i];
				if(branch.node.style.display == "none") continue;
				width += getWidth(branch);
				width += el.HSpace;
			};
			width -= el.HSpace;
		}		
	}else if(el instanceof IfElse){
		if (!el.state.expanded) 
			width = el.getWidth();
		else {
			var else_w = getWidth(el.elseSeq);
			//10是mrCanvas宽度的一半，当else不显示的时候，计算宽度要考虑mrCanvas的宽度，因为在mrCanvas上总是居中画线的，mrCanvas有一半的宽度折叠进HSpace中了，所以只加一半的宽度
			width = el.padding * 2 + el.HSpace + (else_w == 0 ? 10 : else_w);
			var ifWidth = getWidth(el.ifSeq);
			var w = ifWidth > el.forkSize ? ifWidth : el.forkSize;
			width = width + w;
		}
	}else if(el instanceof ForEach){
		if(!el.state.expanded) width = el.getWidth();
		else width = el.padding*2 + el.forkSize + el.HSpace + getWidth(el.seq);
	}*/
	return width;
}

function getHeightestBranch(parallel){
	var branches = parallel.branches;
	if(!branches) branches = parallel.children;
	var max = 0;
	var index;
	for (var i=0; i<branches.length; i++) {
		var branch = branches[i];
		var h = getHeight(branch);
		if(h > max){
			max = h;
			index=i;
		}
	};
	return {"index":index,"height":max};
}

function restoreFromCookie(cookie){
	
}

/*
	校验输入的值是否合法，并返回合法值
*/
function validateInputValue(newValue,oldValue){
		if(newValue=="") return false;
		else{
			//去除空格
			var s = newValue.replace(/(^\s*)|(\s*$)/g,"");
			if(s=="") return false;
			//如果新旧值相同
			if(newValue==oldValue) return false;
			//判断是否与其他组件重名
			var existedNode = reg.getComponentByName(newValue);
			if(existedNode!=null){
				alert("Component name can't be repeated!")
				return false;
			} 
			return true;
		}
}
function isClickedWhiteSpace(el){
	return el.id=="maincontent"||el.id=="process"||YD.hasClass(el,"Connection")||YD.hasClass(el,"Start")||YD.hasClass(el,"Stop")||YD.hasClass(el,"ControlFlow");
}
function getChildrenLength(s){
	var length = 0;
	for(var i=0;i<s.children.length;i++){
		var child = s.children[i];
		if(isRealChild(child)) length++;
	}
	return length;
}
//返回数组中是否包含某个元素
function contains(array,element){
	return dojo.indexOf(array,element)>=0;
}
function random(range,start){
	return parseInt(Math.random()*range+start);
}
function mid(n){
	return n%2==0?n/2:(n-1)/2;
}
function getAllParallels(parent){
	var list = [];
	dojo.forEach(dojo.filter(parent.children,function(item,i){
		if(isContainer(item)) return true;
	}),function(item,i){
		if(item instanceof Parallel) list.push(item);
		dojo.forEach(getAllParallels(item),function(item,i){
			list.push(item);
		});
	});
	return list;
}
function sortByHierarchy(array){
	for (var i=0; i<array.length-1; i++) {
		for (var j=i+1; j<array.length; j++) {
			if(getHierarchyLevel(array[j])>getHierarchyLevel(array[i])){
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		};
	};
	return array;
}
function getHierarchyLevel(container){
	if(!isContainer(container)) return;
	var level = 0;
	var it = container.parent;
	while(it!=null){
		level++;
		it = it.parent;
	}
	return level;
}
//获得comp的前一个和后一个占位符
function getPrevAndNextPlaceholder(comp){
	if(comp.parent){
		comp.parent.sortChildren();
		var children = comp.parent.children;
		var index = dojo.indexOf(children,comp);
		var result = {};
		for(var i=index+1;i<children.length;i++){
			if (children[i] instanceof Placeholder) {
				result.next = children[i];
				break;
			}
		}
		for(var i=index-1;i>=0;i--){
			if (children[i] instanceof Placeholder) {
				result.prev = children[i];
				break;
			}
		}
		return result;
	}else throw new Error("Component: "+comp.name+" hasn't a parent assigned!");
}
/*
 * 计算当前拖拽对象所影响的Dropzones,这些AffectedDropzones在拖拽过程中将不会被激活
 */
function caculateAffectedDropzones(){
	var currentDragObject = dndManager.currentDragObjects[0];
	//如果当前拖拽的对象来自palette，AffectedDropzones为空
	if(currentDragObject.root == "palette") return null;
	//获得当前拖拽对象所对应的封装对象
	var comp = reg.getComponentById(currentDragObject.id);
	//获得前一个和后一个占位符
	var result = getPrevAndNextPlaceholder(comp);
	result.prev_index = getIndexOfDropzoneByPlaceholder(result.prev);
	result.next_index = getIndexOfDropzoneByPlaceholder(result.next);
	
	var AffectedDropzones = [result.prev_index,result.next_index];
	if(comp instanceof ContainerNode){
		dojo.forEach(dndManager.dropZones,function(item,i){
			var parent = item.wrappedObj.parent;
			//如果占位符的某一级parent是comp,就将该占位符的索引保存进AffectedDropzones数组中去
			while(parent.parent){
				if(parent.parent==comp){
					AffectedDropzones.push(i);
					break;
				} 
				parent = parent.parent;
			}
		});
	}	
	if(AffectedDropzones.length>0) return AffectedDropzones;
}
//返回给定占位符对应的Dropzone在dropZones中的位置索引
function getIndexOfDropzoneByPlaceholder(ph){
	if(ph instanceof Placeholder){
		var domNode = ph.node;
		var dropzones = dndManager.dropZones;
		for(var i=0;i<dropzones.length;i++){
			var dropzone = dropzones[i];
			if(dropzone.getHTMLElement()==domNode) return i;
		}
	}
}
function refreshProcess(){
	process.validate();
	clearSelection();
	clearTreeSelection();
}
function clearTreeSelection(){
	var items = processTree.selectedItems;
	for(var i=0;i<items.length;i++){
		var nodes = processTree.getNodesByItem(items[i]);
		if(nodes&&nodes.length>0){
			for(var j=0;j<nodes.length;j++)
				nodes[j].setSelected(false);
		}
	}
}

function getBusByDomNode(el){
	var node = el;
	do{
		if(isBus(node))
			break;
		else
			node = node.parentNode;
	}while(node);
	//如果未找到Parallel、ForEach、IfElse、Component之一，就返回为null
	if(!node){
		return null;
	}else{
		return bus;
	}
}

function getBusConnectByDomNode(el){
	var node = el;
		do{
			if(isBusConnect(node))
				break;
			else
				node = node.parentNode;
		}while(node);
		//如果未找到Parallel、ForEach、IfElse、Component之一，就返回为null
		if(!node)	return null;

	var result = dojo.query(".name_lbl",node.parentNode);
	var name;
	if(result.length>0)
		name = result[0].innerHTML;
	else
		throw new Error("Can't find the nameField domNode");
	var comp = reg.getComponentByName(name);
	if(!comp)
		throw new Error("The component named "+name+" isn't registered!");
	return comp;
}

function getControlFlowByDomNode(el){
	var node = el;
	do{
		if(isControlFlow(node))
			break;
		else
			node = node.parentNode;
	}while(node);
	//如果未找到Parallel、ForEach、IfElse、Component之一，就返回为null
	if(!node){
		return null;
	}
	else{
		/*return node;*/
		var comp = getComponentByDomNode(node.previousSibling.childNodes[0], true);
		var parent = comp.parent;
		var index = parent.children.indexOf(comp,0) + 1;
		 var controlFlow = parent.children[index];
		return controlFlow;
	}
}

function getComponentByDomNode(el,searchParent){
	var node = el;
	if(searchParent){
		do{
			if(isParallel(node)||isForEach(node)||isIfElse(node)||isComponent(node)||isApproval(node))
				break;
			else
				node = node.parentNode;
		}while(node);
		//如果未找到Parallel、ForEach、IfElse、Component之一，就返回为null
		if(!node)	return null;
	}else{
		if(!(isParallel(node)||isForEach(node)||isIfElse(node)||isComponent(node)||isApproval(node))) return null;
	}	
	
	var result = dojo.query(".name_lbl",node);
	var name;
	if(result.length>0)
		name = result[0].innerHTML;
	else 
		throw new Error("Can't find the nameField domNode");
	var comp = reg.getComponentByName(name);
	if(!comp)
		throw new Error("The component named "+name+" isn't registered!");
	return comp;
}
function getDraggableByComponent(comp){
	var draggables = dndManager.draggables;
	for(var i=0;i<draggables.length;i++){
		var draggable = draggables[i];
		if(draggable.htmlElement == comp.node) return draggable;
	}
	throw new Error("The component named "+comp.name+" isn't a draggable!");
}
function clearSelection(el){
	var draggables = dndManager.draggables;
	for(var i=0;i<draggables.length;i++){
		var draggable = draggables[i];
		if(draggable.isSelected()) draggable.deselect();
	}
	if(el != null){

		if(isComponent(el)){
			el.style.backgroundColor = ControlUtil.prototype.unSelectColor;
		}else if(isBus(el)){
			bus.select(false);
		}else{
			el.style.backgroundColor = ControlUtil.prototype.unSelectTransparentColor;
		}
	}
}
function hasSelection(){
	var draggables = dndManager.draggables;
	var result={};
	var selection = [];
	for(var i=0;i<draggables.length;i++){
		var draggable = draggables[i];
		if(draggable.root=="palette") continue;
		if(draggable.isSelected()) selection.push(draggable.htmlElement);
	}
	result.flag = selection.length>0?true:false;
	if(result.flag) result.selection = selection;
	return result;
}
function deleteAction(){
	var result = hasSelection();
	if(result.flag){
		var selection = result.selection;
		for(var i=0;i<selection.length;i++){
			var selectedNode = selection[i];
			var comp = getComponentByDomNode(selectedNode);
			if(comp&&comp.parent){
				delDraggableWhenDelComp(comp);
				comp.parent.removeChild(comp);
				comp.onDelete();
			}
		}
		process.validate();
	}else{
		alert("No component is selected now.");
	}
}
function delDraggableWhenDelComp(comp){
	var draggable = getDraggableByComponent(comp);
	var index = dojo.indexOf(dndManager.draggables,draggable);
	if(index==-1) throw new Error("Can't find the draggable object by component!");
	dndManager.draggables.splice(index,1);
}

function rememberChanged(){
	var value = dijit.byId('remember').get('value');
	if(value){
		//Save into cookies
	}
}
//先检查cookie中是否有缓存，如果有就用缓存的值，没有就用默认值false
function getRememberValue(){
	//此处添加对缓存的判断
	
	return false;
}

function saveTypeChanged(){
	var options = document.getElementsByName("SaveType");
	for(var i=0;i<options.length;i++){
		var option = options[i];
		if(option.checked){
			var key = option.id;
			var map = tagReg.get(key);
			var disabled = key=="toCustom"?false:true;
			var widget;
			widget = dijit.byId("processTag");
			widget.set("value",map.process)
			widget.setDisabled(disabled);
			widget = dijit.byId("componentTag");
			widget.set("value",map.comp);
			widget.setDisabled(disabled);
			widget = dijit.byId("parallelTag");
			widget.set("value",map.parallel);
			widget.setDisabled(disabled);
			widget = dijit.byId("sequenceTag");
			widget.set("value",map.seq);
			widget.setDisabled(disabled);
			widget = dijit.byId("foreachTag");
			widget.set("value",map.foreach);
			widget.setDisabled(disabled);
			widget = dijit.byId("ifelseTag");
			widget.set("value",map.ifelse);
			widget.setDisabled(disabled);
			break;
		}
	}
}
function showBtn(el){
		var names = dojo.query(".name_lbl",el);
		if(names.length==0){
			throw new Error("No nameField is found");
			return;
		} 
		var name = names[0].innerHTML;
		var container = reg.getComponentByName(name);
        if(!container) return;
		if(!container.ctrlBtn) return;
		 var pos = YD.getXY(container.node);
		 
		 var size = dojo.getMarginBox(container.node);
		 container.ctrlBtn.style.display="inline";
		 if(!container.state.expanded){
		     YD.setXY(container.ctrlBtn,[pos[0],pos[1]]);
			 var size2 = dojo.getMarginBox(container.ctrlBtn);	
		 	 dojo.setMarginBox(container.node,{h:size.h});
			 var y = YD.getY(container.node);
			 YD.setY(container.ctrlBtn,y-size2.h);	 
		 }	
		 process.validate();				 
}
function hideBtn(el){
		var names = dojo.query(".name_lbl",el);
		if(names.length==0){
//			throw new Error("No nameField is found");
			return;
		} 
		var name = names[0].innerHTML;
		var container = reg.getComponentByName(name);
		if(!container.ctrlBtn) return;
		container.ctrlBtn.style.display="none";
}
function openThemeDialog(){
	var themeDlg = dijit.byId("themeDlg");
	if(themeDlg) themeDlg.show();
	else throw new Error("Theme Dialog is not ready!");
	//初始化方法要放在onLoad之后，因为Dialog的内容是通过href使用xhr异步加载的
	dojo.connect(themeDlg,"onLoad",initThemeDlg);	
}
function initThemeDlg(){
	//初始化对话框，包括单选按钮的值，以及remember CheckBox的值
	var theme = dojo.cookie("theme");
	if(!theme) theme = "claro";
	//选中theme对应的单选按钮
	var radio = dijit.byId(theme+"_radio");
	radio.set("checked",true);
}
function saveThemeIntoCookie(){
	var isRem = dijit.byId("remember_theme").get("checked");
	if(isRem){
		var theme;
		dojo.forEach(document.getElementsByName("ThemeType"),function(item){
			var widget = dijit.byId(item.id);
			if(widget.get("checked")) theme = widget.get("value");
		});
		var expires_theme = parseInt(dijit.byId("expires_theme").get("value"));
		dojo.cookie("theme",theme,{expires:expires_theme});
	}
	dijit.byId("themeDlg").onCancel();
}
function changeTheme(newTheme,id){
	if(dijit.byId(id).get('checked'))
		dojox.html.activeStyleSheet(newTheme);
}
function openGanttDialog(){
	dojo.empty(dojo.byId("ganttChart"));
	var ganttDlg = dijit.byId("ganttDlg");
	ganttDlg.show();	
	if(!checkProcess()){
		alert("Process not intact! You should assign every task to idiographic person(s) and specify its duration through 'Start date' and 'End date' attributes");
		ganttDlg.hide();
	}else{
		var project = new dojox.gantt.GanttProjectItem({
						id: getIdFromTreeStore(process),
						name: process.name,
						startDate: parseDate(process.sdate)
					});
		generateGanttTaskItems(process,project);
		//绘制Gantt图
		var ganttChart = new dojox.gantt.GanttChart({
					//readOnly: true,			//optional: gantt chart editable
					//dataFilePath: "gnt.json",	//optional: json data file path for load and save, default is "gantt_default.json"
					//withTaskId: false,		//optional: if true, task id will be on the right of task name, default value is !readOnly.
					//animation: false,			//optional: whether you need animation when changing granularity of time line 
					height: 400,				//optional: chart height in pixel, default is 400px
					width: 1200,				//optional: chart width in pixel, default is 600px
					withResource: true			//optional: with the resource chart or not
				}, "ganttChart"); 					//"gantt" is the node container id of gantt chart widget
				
		// Add project data to gantt chart widget
		ganttChart.addProject(project);
		
		// Initialize and Render
		ganttChart.init();
	}
}
function getIdFromTreeStore(comp){
	if(!isRealChild(comp)) throw new Error("Illegel Arguments! This method require a real component as its parameter");
//	var items = tree_store._arrayOfAllItems;
	var items = tree_store._getItemsArray();
	var id;
	dojo.forEach(items,function(item){
		if (item.name[0] == comp.name) id = item.id[0];			
	});
	return id;
}
//该方法递归
function caculateStartTime(obj){
	if(obj instanceof Component) return parseDate(obj.sdate);
	else if(obj instanceof Sequence){
		var time;
		//返回第一个RealChild的StarTime		
		for(var i=0;i<obj.children.length;i++){
			var child = obj.children[i];
			if(isRealChild(child)) return caculateStartTime(child);
		}
	}else if(obj instanceof Parallel){//返回所有Sequence中时间最早的那个任务的StartTime
		var min;
		dojo.forEach(obj.children,function(child){
			var sTime = caculateStartTime(child);
			if((!min)||min>sTime) min = sTime
		});
		return min;
	}else if(obj instanceof IfElse){
		return caculateStartTime(obj.ifSeq);
	}else if(obj instanceof ForEach){
		return caculateStartTime(obj.seq);
	}
}
//该方法递归
function caculateEndTime(obj){
	if(obj instanceof Component) return parseDate(obj.edate);
	else if(obj instanceof Sequence){
		//倒序循环，找到最后一个RealChild的EndTime
		for(var i=obj.children.length-1;i>=0;i--){
			if(isRealChild(obj.children[i])) return caculateEndTime(obj.children[i]);
		}	
	}else if(obj instanceof Parallel){//返回所有Sequence中结束时间最晚的那个任务的EndTime
		var max;
		dojo.forEach(obj.children,function(child){
			var sTime = caculateEndTime(child);
			if((!max)||max<sTime) max = sTime
		});
		return max;
	}else if(obj instanceof IfElse){
		return caculateEndTime(obj.ifSeq);
	}else if(obj instanceof ForEach){
		return caculateEndTime(obj.seq);
	}
}
//一天按8个小时算
function caculateDuration(obj){
	var sTime = caculateStartTime(obj);
	var eTime = caculateEndTime(obj);
	return (eTime - sTime)/(1000*60*60*24)*8;
}
//该方法递归
function caculateOwner(obj){
	if(obj instanceof Component) return obj.role.actualUsers;
	else if(obj instanceof Sequence){//返回所有child的角色的并集
		var allRoles = "";
		var children = dojo.filter(obj.children,function(child){
			if(isRealChild(child)) return true;
		});
		dojo.forEach(children,function(child,i){
			allRoles += caculateOwner(child);//不同角色之间使用;隔开
			if(i!=children.length-1) allRoles += ";";
		});
		return allRoles;
	}else if(obj instanceof Parallel){
		var allRoles = "";
		dojo.forEach(obj.children,function(child,i){
			allRoles += caculateOwner(child);
			if(i!=obj.children.length-1) allRoles += ";";
		});
		return allRoles;
	}else if(obj instanceof IfElse){
		return caculateOwner(obj.ifSeq);
	}else if(obj instanceof ForEach){
		return caculateOwner(obj.seq);
	}	
}
function getPreviousTaskId(realChildren,i){
	if(i==0) return "";
	else return realChildren[i-1].ganttItem.id+"";
}
//该方法递归
function generateGanttTaskItems(parent,parentItem){		
	//对于Sequence,为每个直接child创建GanttTaskItem,假设Sequence已经排序过了
	if(parent instanceof Sequence){
		var realChildren = dojo.filter(parent.children,function(child){
			if(isRealChild(child)) return true;
		});		
		dojo.forEach(realChildren,function(child,i){
			var task_item = new js.GanttTaskItem({
					id: getIdFromTreeStore(child),
					name: child.name,
					startTime: caculateStartTime(child),
					duration: caculateDuration(child),
					percentage: 0,//第一个任务previousTaskId指定为""
					previousTaskId: getPreviousTaskId(realChildren,i),
					taskOwner: caculateOwner(child)
				});
			//将ganttItem保存进child中，以备后续的child指定previousTaskId
			child.ganttItem = task_item;
			if(parent instanceof Sequence.Process)
				parentItem.addTask(task_item);
			else 
				parentItem.addChildTask(task_item);
			if(isContainer(child)){
				generateGanttTaskItems(child,task_item)
			}
		});
	}else if(parent instanceof Parallel){
		dojo.forEach(parent.children,function(child){
			if(dojo.style(child.node,"display")=="none"){}
			else{
				//不指定前一任务，指定为ChildTask
				var task_item = new js.GanttTaskItem({
						id: getIdFromTreeStore(child),
						name: child.name,
						startTime: caculateStartTime(child),
						duration: caculateDuration(child),
						percentage: 0,
						taskOwner: caculateOwner(child)
					});
	//			child.ganttItem = task_item;
				parentItem.addChildTask(task_item);//child一定是Sequence，不需要进行判断
				generateGanttTaskItems(child,task_item);
			} 
			
		});
	}else if(parent instanceof ForEach){
		var child = parent.seq;
		var task_item = new js.GanttTaskItem({
					id: getIdFromTreeStore(child),
					name: child.name,
					startTime: caculateStartTime(child),
					duration: caculateDuration(child),
					percentage: 0,
					taskOwner: caculateOwner(child)
				});
		parentItem.addChildTask(task_item);//child一定是Sequence，不需要进行判断
		generateGanttTaskItems(child,task_item);
	}else if(parent instanceof IfElse){
		var child = parent.ifSeq;
		var task_item = new js.GanttTaskItem({
					id: getIdFromTreeStore(child),
					name: child.name,
					startTime: caculateStartTime(child),
					duration: caculateDuration(child),
					percentage: 0,
					taskOwner: caculateOwner(child)
				});
		parentItem.addChildTask(task_item);//child一定是Sequence，不需要进行判断
		generateGanttTaskItems(child,task_item);
	}
}
function parseDate(str){
	return dojo.date.locale.parse(str,_FormatOptions);
}
function checkProcess(){
	
	return true;
}
function openSettingsDialog(){
	dijit.byId('configDlg').show();
}
function startWith(str,prefix){
	var regExp = new RegExp("^"+prefix+"+.*$");
	return regExp.test(str);
}
function toHumpFormat(str,separator){
    if(typeof separator == "undefined") separator = " ";
    var array = str.split(separator);
    var res = "";
    dojo.forEach(array,function(s,i){
        if(i==0)
            res += s.toLowerCase();
        else
            res += s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
    });
    return res;
}
function isEnglishCharacter(s){
    var regex = /\w+/g;
    if(s.length>0){
        var c = s.charAt(0);
        return regex.test(c);
    }else
        throw new Error("字符串长度为0，无法判断是否是汉字");
}