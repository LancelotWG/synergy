/**
 * Abstract class
 */

dojo.declare("ContainerNode",NamedNode,{
	children:null,
	expand:true,	
	monitors:[],
	initDomNode:function(){
		this.children = new Array();
		
		this.node = dojo.create("div",{className:this.type+" Activity",align:"center"});
		this.state = new dojo.Stateful({expanded:true,parent:this});
		this.ctrlBtn = dojo.create("img",{src:contextPath+"/resource/image/icons/Minus.png",alt:"Collapse"},this.node,"first");
		this.ctrlBtn.style.display = "none";
		this.connects.push(dojo.connect(this.ctrlBtn,'click',this,function(){
		  	this.changeView();
		}));
	
		this.monitors.push(this.state.watch("expanded",function(name,oldvalue,newvalue){
			  var btn =  this.get("parent").ctrlBtn;
		  	  if(newvalue){
			      btn.src =contextPath+"/resource/image/icons/Minus.png";
				  btn.alt = "Collapse";
			  }else{
			  	  btn.src = contextPath+"/resource/image/icons/Plus.png";
				  btn.alt = "Expand";
			  }
		}));
		this.storeNode = dojo.create("div",{
		  	  className:"Component Activity",
			  align:"center",
			  style:{"width":"80"}
		});		
		this.img = dojo.create("img",{src:contextPath+"/resource/image/icons/"+this.type+".png",alt:this.type},this.storeNode,null);
		dojo.create("br",null,this.storeNode,null);
		this.nameField2 = dojo.create("label",{align:"left",innerHTML:this.name,className:"name_lbl"},this.storeNode,null);
		new InplaceEditor({},this.nameField2);
		Rico.Corner.round(this.storeNode, {color: "transparent"});
	},
	changeView:function(){
		var temp = this.storeNode;
		this.storeNode = this.node;
		var parent = this.node.parentNode;
		var prevNode = this.node.previousSibling;
		//更新draggable，否则组件无法被选中
		var draggable = getDraggableByComponent(this);
		var index = dojo.indexOf(dndManager.draggables,draggable);
		dndManager.draggables.splice(index,1);
		dndManager.registerDraggable(new CustomDraggable(temp, this.name,"activity"));
		//将storeNode中的内容显示出来
		this.node = temp;
		parent.removeChild(this.storeNode);
		
		dojo.place(this.ctrlBtn,this.node,null);
		dojo.place(this.node,prevNode,"after");
		this.ctrlBtn.style.display = "none";		
		//更新Stateful的状态
		var bl = this.state.expanded;
		this.state.set("expanded",!bl);
		process.validate();
	},
	addChild:function(child){
		this.children.push(child);
	},
	removeChild: null,
	getLeftWidth: null,
	drawLines: null,
	moveTo: null,
	validate: null,
	//生成TreeNode
	generateTreeNode:function(isMove){
		if(this instanceof Sequence)
			this.sortChildren();
		//得到真正有意义的children
		var realChildren =  dojo.filter(this.children,function(item){
			if(isRealChild(item)) return true;
		});
		//如果id不存在就给id赋值（当删除组件时可能需要手动清除id）
		if(!this.treeNode.id){
			this.treeNode.id = processTree.treeMaxID;
			processTree.treeMaxID++;
		}
		if (isMove) {
			var children = this.parent.storeItem.children;
			if (!children)
				children = [];
			//当组件被拖拽到隐藏分支上时，this.storeItem可能还undefined
			if(!this.storeItem){
				this.generateTreeNode(false);
				//此方法会把当前ContainerNode的下一级children全部创建出来并添加到当前ContainerNode.storeItem的children中去
				this.addAndSortTreeNode();
			}
			children.push(this.storeItem);
			processTree.treeStore.setValues(this.parent.storeItem, "children", children);
		}
		else {
			var isTreeNodeExisted;
			try{
				if(this.parent == null){
					this.storeItem = processTree.treeStore.newItem(this.treeNode, {});
				}else{
					this.storeItem = processTree.treeStore.newItem(this.treeNode, {parent:this.parent.storeItem,attribute:"children"});
				}
			}catch(e){
				isTreeNodeExisted = true;
			}
			if(!isTreeNodeExisted){
				//给当前item指定parent，要先给当前item指定parent，然后才能调用this.addAndSortTreeNode();
				if(this.parent&&this.parent instanceof Sequence){
					this.parent.addAndSortTreeNode();
				}

				//如果this是Sequence，并且是Parallel的隐藏分支，就要调用parent的addAndSortTreeNode将隐藏分支显示出来
				if(this instanceof Sequence&&this.parent&&this.parent.addAndSortTreeNode){
					this.parent.addAndSortTreeNode();
					this.parent.dropOnHiddenBranch = false;
				}
			}

			this.addAndSortTreeNode();
		}

		/*if((!isMove)&&processTree&&(!isTreeNodeExisted)){
		 var treeNode = processTree.getNodesByItem(this.storeItem)[0];
		 new InplaceEditor({isNeedSetLoc:false,treeNode:treeNode,width:"*", style:"width: *;"},treeNode.labelNode);
		 }*/
	},
	addAndSortTreeNode:function(){
		var children = [];
		for(var i=0;i<this.children.length;i++){
			if(dojo.style(this.children[i].node,"display")=="none") continue;
			//如果storeItem不存在，先创建它
			if(!this.children[i].storeItem) this.children[i].generateTreeNode(false);
			children.push(this.children[i].storeItem);
		}
		processTree.treeStore.setValues(this.storeItem,"children",children);
	},
	destroyDescendants:function(){
		dojo.forEach(this.children, function(widget){
			if(widget.destroyRecursive){
				widget.destroyRecursive();
			}
		});
	},
	destroy: function(){
		dojo.forEach(this.monitors,function(monitor){
			monitor.unwatch();
		});
		this.inherited(arguments);
	}	
});