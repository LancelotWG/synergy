/**
 * Usage:new Sequence({type:"Sequence"});
 */

dojo.declare("Sequence",ContainerNode,{
	refNode:null,
	pos:null,
	//水平补白
	Hpadding:20,
	Wpadding:20,
	placeholder:null,
	layoutH:false,
	constructor:function(args){
		this.type = "Sequence";
		if(this.parent!=null)
		    this.parent.addChild(this);
	},
	initDomNode:function(){
		this.inherited(arguments);
//		this.node = dojo.create("div",{className:"Sequence Activity",align:"middle"},this.refNode?this.refNode:null,this.pos?this.pos:null);
		dojo.place(this.node,this.refNode?this.refNode:null,this.pos?this.pos:null);
		this.placeholder = new Placeholder({parent:this,type:"dropAfterAndBefore",refNode:this.node});
		this.children.push(this.placeholder);
		/*this.showBorder = true;*/
		dojo.style(this.node,{borderStyle:"dashed",borderWidth:"1px",padding:[0,this.Hpadding,0,this.Hpadding]});
		
//		this.nameField = dojo.create("label",{
//		  	  className:"name_lbl",
//			  innerHTML:this.name},this.node,"first");
	},
	/*
	 * 左边的宽度取决于该Sequence上最宽的组件的左边宽度
	 */
	getLeftWidth:function(){
		var max = 0;
		var theChild;
		for(var i=0;i<this.children.length;i++){
			var child = this.children[i];
			var w = getWidth(child);
			/*if(child instanceof Start) w = 32;
			if(child instanceof Arrow) w = 18;*/
			if(w>max){
				max = w;
				theChild = child;	
			}				
		}
		if(!isContainer(theChild))
			return /*this.showBorder ?  max/2+this.Hpadding :*/ max/2;
		else{
			var leftWidth = theChild.getLeftWidth();
			return /*this.showBorder ? leftWidth+this.Hpadding : */leftWidth;
		} 
	},
	getTopHeight:function(){
		var max = 0;
		var theChild;
		for(var i=0;i<this.children.length;i++){
			var child = this.children[i];
			var h = getHeight(child);
			/*if(child instanceof Start) h = 32;
			if(child instanceof Arrow) h = 18;*/
			if(h>max){
				max = h;
				theChild = child;
			}
		}
		if(!isContainer(theChild))
			return /*this.showBorder ?  max/2+this.Wpadding : */max/2;
		else{
			var topHeight = theChild.getTopHeight();
			return /*this.showBorder ? topHeight+this.Wpadding : */topHeight;
		}
	},
	getRightWidth:function(){
		return getWidth(this)-this.getLeftWidth();
	},
	
	removeChild:function(child){
		this.sortChildren();
		var index = this.children.indexOf(child,0);
		//如果该sequence长度为3或4，那么该sequence是一个Branch,它的元素构成为前后各一个占位符，
		//以及一个可能存在的ArrowPanel，此时应该删除child和其后的一个占位符
		/*if(this.children.length<=4){
			this.children.splice(index,3);
			//显示最初的占位符
//			this.placeholder.node.style.display = "block";
			/!*
			 * this.children[0]与this.placeholder不同步
			 *!/
			dojo.style(this.children[0].node,"display","block");
			//将类名改为dropAfterAndBefore
			this.children[0].node.className = "dropAfterAndBefore";
			this.placeholder = this.children[0];
			//删除Dom元素
			var arrowPanel = child.node.next().next();
			if(arrowPanel&&dojo.hasClass(arrowPanel,"pad"))	this.node.removeChild(arrowPanel);
			this.node.removeChild(child.node.next());
			this.node.removeChild(child.node);
		} 
		//如果下一个元素是Placeholder，向前删除两个child
		else if(this.children[index+1] instanceof Placeholder){
			this.children.splice(index-2,3);
			//删除Dom元素
			this.node.removeChild(child.node.previous().previous());
			this.node.removeChild(child.node.previous());
			this.node.removeChild(child.node);
		}*/
		//如果该child的下一个child是Arrow，那么删除该child以及之前之后的两个元素（一个Arrow，一个Placeholder）
		if((this.children[index+1] instanceof Placeholder)&&(this.children[index-1] instanceof Placeholder)){
			var removeDrop = this.children[index+1];
			this.children.splice(index,2);
			//删除Dom元素
			/*this.node.removeChild(child.node.previous());*/
			this.node.removeChild(child.node.next());
			this.node.removeChild(child.node);
			dndManager.deregisterDropZone(removeDrop.dropZone);
		}else{
			//alert("无法删除！<br>请先将组件前后传输控制组件删除后再试。");
			return false;
		}
		/*if(this.children.length<=4){
			//隐藏border
			this.hideBorder();
		}*/

		//从当前item的children中删去child对应的item
		var children = this.storeItem.children;
		if(!children) return false;
		var child_item = child.storeItem;
		index = dojo.indexOf(children,child_item);
		children.splice(index,1);
		processTree.treeStore.setValues(this.storeItem,"children",children);
		var parentComponent = child.parent.parentComponent;
		var parentProcess;
		var realChildren;
		while(parentComponent!=null){
			parentProcess = parentComponent.parent;

			processTree.treeStore.setValue(parentComponent.storeItem,"children",children);

			parentProcess.sortChildren();
			//得到真正有意义的children
			realChildren =  dojo.filter(parentProcess.children,function(_item){
				if(_item instanceof ContainerNode||_item instanceof Component) return true;
			});
			children = [];
			dojo.forEach(realChildren,function(child){
				//如果storeItem不存在，先创建它
				if(!child.storeItem) child.generateTreeNode(false);
				children.push(child.storeItem);
			});
			processTree.treeStore.setValues(parentProcess.storeItem,"children",children);

			parentComponent = parentProcess.parentComponent;
		}
		return true;
	},
	addChild:function(child,operatingMode,oldIndex){
		this.inherited(arguments);
		child.parent = this;
		//var placeholder = child.node.previousSibling;
		/*if(isDropAfterAndBefore(placeholder)){
			this.placeholder.node.className = "dropAfter";
			YD.setStyle(this.placeholder.node,"display","none");
			var newPh = new Placeholder({
				parent: this,
				type: "dropBefore",
				refNode: child.node,
				pos: "after"
			});
			dndManager.registerDropZone(new CustomDropzone(newPh));
			this.children.push(newPh);
		}else{*/
			/*var newPhType = isDropBefore(placeholder) ? "dropBefore" : "dropAfter";
			if(isDropAfter(placeholder)){*/
				/*var arrow = new Arrow({
					parent: this,
					refNode: child.node,
					pos: "after"
				});*/
				/*this.children.push(arrow);*/
		var ph = new Placeholder({
			parent: this,
			refNode: child.node,
			pos: "after",
			type: "dropAfter"
		});
		ph.dropZone = new CustomDropzone(ph);
		dndManager.registerDropZone(ph.dropZone);
		//dndManager.registerDropZone(new CustomDropzone(ph));
				this.children.push(ph);
		/*}else{
				placeholder.className = "dropAfter";
				if(this instanceof Sequence.Process){
					/!*this.children.push(new Arrow({parent:this,refNode:child.node,pos:"after"}));*!/
					var ph3 = new Placeholder({
						parent: this,
						refNode: this.stop.node,
						pos: "before",
						type: "dropBefore"
					});
					dndManager.registerDropZone(new CustomDropzone(ph3));
					this.children.push(ph3);
				}else{
					/!*this.children.push(new Arrow({
						parent: this,
						refNode: placeholder,
						pos: "before"
					}));*!/
					var ph2 = new Placeholder({
						parent: this,
						refNode: child.node,
						pos: "after",
						type: newPhType
					});
					dndManager.registerDropZone(new CustomDropzone(ph2));
					this.children.push(ph2);
				}
			}*/
		/*}*/
		/*if(this.getVisibleChildrenNum()>=2)
			this.displayBorder();*/
//		this.validate();
		//addTimeConfigure(child);
		this.validate();
		switch (operatingMode){
			case ControlUtil.prototype.ComponentCreateMode:
			case ControlUtil.prototype.ComponentNetCreateMode:
			case ControlUtil.prototype.ComponentServerCreateMode:
				child.loadTemplateData(operatingMode);
				break;
			case ControlUtil.prototype.ComponentMoveMode:
				child.sendNetMsg(NetMsgUtil.prototype.msgChange,["position",oldIndex]);
				break;
			case ControlUtil.prototype.ComponentNetMoveMode:
				break;
		}
	},
	saveSize: function(){
		var w = getWidth(this);
		var h = getHeight(this);
		this.prevSize = {"w":w,"h":h};
		var parent = this.parent;
		while(parent!=null){
			if(parent instanceof Sequence)
				parent.saveSize();
			parent = parent.parent;
		}
	},
	validate: function(){
		var newX = YD.getX(this.refNode) - this.refNode.scrollLeft;
		var newY = YD.getY(this.refNode) - this.refNode.scrollTop;
		//YD.setXY(this.node,[newX,newY]);
		YD.setXY(os.node,[newX,newY]);
		this.moveTo(newX/* + width/2 - processWidth/2*/,newY /*+ height/2 - this.getTopHeight() - height/5*/);
		newX = YD.getX(this.refNode) - this.refNode.scrollLeft;
		newY = YD.getY(this.refNode) - this.refNode.scrollTop;
		//var newX = this.refNode.offsetLeft;
		if(Hlayout){
			var height = this.refNode.offsetHeight;

			var width = this.refNode.scrollWidth;
			 var processWidth = this.getWidth();
			this.moveTo(newX + width/2 - processWidth/2,newY + height/2 - this.getTopHeight() - height/5);
			var osX = newX + width/2 - os.defaultSize[0]/2;
			var osY = newY + height/8 - os.defaultSize[1]/2;
			YD.setXY(os.node,[osX,osY]);
		}else{
			var width = this.refNode.offsetWidth;
			this.moveTo(newX + width/2 - this.getLeftWidth(), newY + 25);

		}
		/*if(this.parent!=null){//节点的位置布局！！！！
			var nw = getWidth(this);
			var nh = getHeight(this);
			/!*var pSize = this.prevSize;
			var diff = {"w":nw-pSize.w,"h":nh-pSize.h};
			if(this.parent instanceof Parallel){
				var n = this.parent.children.length;
				if(n>2) n-=1;
				var index = this.parent.children.indexOf(this);
				var oldX = YD.getX(this.parent.node);
				var oldY = YD.getY(this.parent.node);
				var newX;
				if(n%2==0){
					if(index<mid(n)) newX = oldX - diff.w;
					else newX = oldX;
				}else{
					if(index<mid(n)) newX = oldX - diff.w;
					else if(index == mid(n)) newX = oldX - diff.w/2;
					else newX = oldX;
				}
				if(oldX!=newX){
					 this.parent.moveTo(newX,oldY);
				}
				this.parent.validate();
			}else *!/if(this.parent instanceof Sequence){
				if(this.layoutH){
					dojo.style(this.node,{height:this.showBorder?nh-this.Wpadding*2:nh,width:nw});
				}else{
					dojo.style(this.node,{width:this.showBorder?nw-this.Hpadding*2:nw,height:nh});
				}
				this.parent.validate();
			}/!*else if(this.parent instanceof ForEach){
				this.parent.validate();
			}else if(this.parent instanceof IfElse){
				this.parent.validate();
			}*!/
		}else{
//			this.node.style.position = "absolute";
			if(Hlayout){
				var y = YD.getY(this.start.node)+this.start.getHeight()/2;
				y -= this.getTopHeight();
				var x = YD.getX(this.start.node);
				this.moveTo(x,y);
			}else{
				var x = YD.getX(this.start.node)+this.start.getWidth()/2;
				x -= this.getLeftWidth();
				var y = YD.getY(this.start.node);
				this.moveTo(x,y);
			}
//			this.node.style.position = "static";
		}*/
		//主界面锁定显示控制
		if(process == this){
			var elementHTML =  dojo.byId("maincontent");
			if(process.locked){
				dojo.addClass(elementHTML,"processLocked");
				dojo.byId("keyHolder").innerHTML = "锁定者："+"<b>"+process.keyHolder[0]+"</b>";
				YD.setStyle(dojo.byId("lockedFlag"),"display","block");
				/*dojo.byId("location").innerHTML += "(此流程已被"+userName+"锁定)";*/
			}else{
				dojo.removeClass(elementHTML,"processLocked");
				dojo.byId("keyHolder").innerHTML = "";
				YD.setStyle(dojo.byId("lockedFlag"),"display","none");
			}
		}
		/*if(processTree != null){
			this.addAndSortTreeNode();
		}*/
		//主界面锁定显示控制
	},
	moveTo: function(x,y){
		this.sortChildren();
		var h = 0;
		var w = 0;
		//配置时间刷新
		if(process == this){
			timeConfigureGrid.clearStore();
			/*timeConfigureGrid.timeConfigureStore_hb = {identifier:'id',items: []};
			timeConfigureGrid.timeConfigureStore = new dojo.data.ItemFileWriteStore({data: timeConfigureGrid.timeConfigureStore_hb});*/
		}

		if(Hlayout){
			h = this.getTopHeight()*2;
			/*h = this.showBorder ? h-this.Wpadding*2 : h;*/
			for(var i=0;i<this.children.length;i++){
				var children = this.children[i];
				if(isComponent(children))
					if(process == this){
						timeConfigureGrid.addStoreItem({id:children.id,name:children.name,configureTime:children.configureTime});
						/*timeConfigureGrid.timeConfigureStore.newItem({id:children.id,name:children.name,configureTime:children.configureTime});*/
					}
				/*if(YD.getStyle(children.node,"display")=="none") continue;*/
					w += getWidth(children);
			}
		}else{
			w = this.getLeftWidth()*2;
			/*w = this.showBorder ? w-this.Hpadding*2 : w;*/
			for(var i=0;i<this.children.length;i++){
				var children = this.children[i];
				if(isComponent(children))
					if(process == this){
						timeConfigureGrid.addStoreItem({id:children.id,name:children.name,configureTime:children.configureTime});
						/*timeConfigureGrid.timeConfigureStore.newItem({id:children.id,name:children.name,configureTime:children.configureTime});*/
					}
				/*if(YD.getStyle(children.node,"display")=="none") continue;*/
					h += getHeight(children);
			}
		}
		if(process == this){
			timeConfigureGrid.freshenGrid();
			/*timeConfigureGrid.grid.setStore(timeConfigureGrid.timeConfigureStore);
			timeConfigureGrid.grid.update();*/
		}

		//配置时间刷新
		//bus位置刷新
		if(this == process){
			YD.setXY(bus.node,[x,y+h+32]);
			YD.setXY(bus.canvasNode,[x,y+h+32]);
			bus.updateBus(w);
		}
		//bus位置刷新
		w = w+"px";h= h+"px";
		Element.setStyle(this.node,{"width":w,"height":h});
		YD.setXY(this.node,[x,y]);
		var cx = x+this.getLeftWidth();
		var cy = y+this.getTopHeight();
		if(Hlayout){
			for(var i=0;i<this.children.length;i++){
				var child = this.children[i];
				var nx = x;
				var offset = 0;
				for(var j=0;j<i;j++){
					/*if(YD.getStyle(this.children[j].node,"display")=="none") continue;*/
					offset += getWidth(this.children[j]);
				}
				/*if(child instanceof Arrow){
					child.changeLayout();
				}*/
				if(child instanceof Component){
					child.checkIcon();
				}
				var ny;
				if(isContainer(child))
					ny = cy - child.getTopHeight();
				else
					ny = cy - getHeight(child)/2;
				nx += offset;

				if(isContainer(child)&&child.state&&child.state.expanded){
					child.moveTo(nx,ny);
				}else{
					if(YD.getStyle(child.node,"display")=="none"){
						YD.setStyle(child.node,"display","block");
						YD.setXY(child.node,[nx,ny]);
						YD.setStyle(child.node,"display","none");
					}else
						YD.setXY(child.node,[nx,ny]);
				}
				if(child instanceof Placeholder){
					YD.setXY(child.node,[nx+child.defaultMargin[3],ny+child.defaultMargin[0]]);
				}
			}
		}else{
			for(var i=0;i<this.children.length;i++){
				var child = this.children[i];
				var ny = y;
				var offset = 0;
				for(var j=0;j<i;j++){
					/*if(YD.getStyle(this.children[j].node,"display")=="none") continue;*/
					offset += getHeight(this.children[j]);
				}
				/*if(child instanceof Arrow){
					child.changeLayout();
				}*/
				if(child instanceof Component){
					child.checkIcon();
				}
				var nx;
				if(isContainer(child))
					nx = cx - child.getLeftWidth();
				else
					nx = cx-getWidth(child)/2;
				ny += offset;

				if(isContainer(child)&&child.state&&child.state.expanded){
					child.moveTo(nx,ny);
				}else{
					if(YD.getStyle(child.node,"display")=="none"){
						YD.setStyle(child.node,"display","block");
						YD.setXY(child.node,[nx,ny]);
						YD.setStyle(child.node,"display","none");
					}else
						YD.setXY(child.node,[nx,ny]);
				}
			}
		}
    },
	sortChildren:function(){
		var first = this.placeholder.node;
		var next = first.nextSibling;
		var i=1;
		while(next != null){
			var obj = this.getObjectByDom(next);
			if(obj!=null){
				if(i!=obj.pos){
					var temp = this.children[i];
					this.children[i] = obj.value;
					this.children[obj.pos] = temp;
				}
			}
			next = next.nextSibling;
			i++;
		}
	},
	getObjectByDom:function(node){
		for (var i=0; i<this.children.length; i++) {
			var child = this.children[i];
			if(child.node==node)
				return {"pos":i,"value":child};
		};
		return null;
	},
	//VisibleChildren不包括ArrowPanel
	getVisibleChildrenNum:function(){
		var num = 0;
		for(var i=0;i<this.children.length;i++){
			var child = this.children[i];
			if(!child)	continue;
			if(YD.getStyle(child.node,"display")=="none") continue;
			else if(YD.hasClass(child.node,"pad")) continue;
			else num += 1;
		}
		return num;
	},
	/*displayBorder:function(){
		this.showBorder = true;
		YD.setStyle(this.node,"border-width","1px");
	},
	hideBorder:function(){
		this.showBorder = false;
		YD.setStyle(this.node,"border-width","0px");
	},*/
	//排序TreeNode，使其按照流程中组件的先后顺序
	addAndSortTreeNode:function(){
		this.sortChildren();
		//得到真正有意义的children
		var realChildren =  dojo.filter(this.children,function(_item){
			if(_item instanceof ContainerNode||_item instanceof Component) return true;
		});
		var children = [];
		dojo.forEach(realChildren,function(child){
			//如果storeItem不存在，先创建它
			if(!child.storeItem) child.generateTreeNode(false);
			children.push(child.storeItem);
		});
		processTree.treeStore.setValues(this.storeItem,"children",children);
		var parentComponent = this.parentComponent;
		var parentProcess;
		/*var wholeTreeStore = this.storeItem;*/
		while(parentComponent!=null){
			parentProcess = parentComponent.parent;

			processTree.treeStore.setValue(parentComponent.storeItem,"children",children);

			parentProcess.sortChildren();
			//得到真正有意义的children
			realChildren =  dojo.filter(parentProcess.children,function(_item){
				if(_item instanceof ContainerNode||_item instanceof Component) return true;
			});
			children = [];
			dojo.forEach(realChildren,function(child){
				//如果storeItem不存在，先创建它
				if(!child.storeItem) child.generateTreeNode(false);
				children.push(child.storeItem);
			});
			processTree.treeStore.setValues(parentProcess.storeItem,"children",children);
			parentComponent = parentProcess.parentComponent;
		}

	},
	//此方法用在打开流程时，打开流程时流程一定是自顶向下创建的，所以此方法中没有再进行排序(sortChildren)
	appendChildDom:function(domNode){
		var lastPH;
		for(var i=this.children.length-1;i>=0;i--){
			if(this.children[i] instanceof Placeholder){
				lastPH = this.children[i];
				break;
			}
		}
		if(lastPH){
			dojo.place(domNode,lastPH.node,"after");
		}
	}
});