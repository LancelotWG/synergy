dojo.require("dijit.Tree");
dojo.declare("js.Tree",dijit.Tree,{
	/*getTooltip: function(item){
		/!*var quote = item.quote;
		if(quote instanceof Sequence.Process){
			if(item.subProcess.locked){
				var des = "此流程已被锁定" + "<br/>" +"编辑者："+item.quote.subProcess.keyHolder[0];
				return des;
			}
		}else if(quote instanceof Component){
			if(item.quote.subProcess != null){
				if(item.subProcess.locked){
					var des = "此流程已被锁定" + "<br/>" +"编辑者："+item.quote.subProcess.keyHolder[0];
					return des;
				}
			}
		}*!/

		return  item.des[0];
	},*/
	getIconClass:function(item,opened){
		var type = item.type[0];
		var comp = reg.getComponentByName(item.name);
		if(comp instanceof Component){
			var sub = comp.subProcess;
			if(sub != null){
				if(sub.locked){
					type += "_locked";
				}
			}
		}else if(comp instanceof Sequence.Process){
			if(comp.locked){
				type += "_locked";
			}
		}
		if(type=="Sequence.Branch") type = "Sequence";
        if(!isEnglishCharacter(type)) type = "userdefined";
		return "icon-"+type.toLowerCase();
	},
	_onKeyPress: function(/*Event*/e){
		//ignoreKeyEvent代表Tree是否应该忽略键盘事件
		if(ignoreKeyEvent) return;
//		this.inherited(arguments);

// summary:registry.add
		//		Translates keypress events into commands for the controller
		if(e.altKey){ return; }
		//没有使用异步加载的方式，不能使用registry对象，可以使用dijit来代替
//		var treeNode = registry.getEnclosingWidget(e.target);
		var editor = dijit.getEnclosingWidget(e.target);
		var treeNode = editor instanceof InplaceEditor ? editor.treeNode : editor;
		//没有使用异步加载的方式，所以keys也不能直接使用，可以使用dojo.keys
		var keys = dojo.keys;
		if(!treeNode){ return; }

		var key = e.charOrCode;
		if(typeof key == "string" && key != " "){	// handle printables (letter navigation)
			// Check for key navigation.
			if(!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey){
				this._onLetterKeyNav( { node: treeNode, key: key.toLowerCase() } );
				event.stop(e);
			}
		}else{	// handle non-printables (arrow keys)
			// clear record of recent printables (being saved for multi-char letter navigation),
			// because "a", down-arrow, "b" shouldn't search for "ab"
			if(this._curSearch){
				clearTimeout(this._curSearch.timer);
				delete this._curSearch;
			}

			var map = this._keyHandlerMap;
			if(!map){
				// setup table mapping keys to events
				map = {};
				map[keys.ENTER]="_onEnterKey";
				//On WebKit based browsers, the combination ctrl-enter
				//does not get passed through. To allow accessible
				//multi-select on those browsers, the space key is
				//also used for selection.
				map[keys.SPACE]= map[" "] = "_onEnterKey";
				map[this.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW]="_onLeftArrow";
				map[this.isLeftToRight() ? keys.RIGHT_ARROW : keys.LEFT_ARROW]="_onRightArrow";
				map[keys.UP_ARROW]="_onUpArrow";
				map[keys.DOWN_ARROW]="_onDownArrow";
				map[keys.HOME]="_onHomeKey";
				map[keys.END]="_onEndKey";
				this._keyHandlerMap = map;
			}
			if(this._keyHandlerMap[key]){
				this[this._keyHandlerMap[key]]( { node: treeNode, item: treeNode.item, evt: e } );
				//因为没有使用dojo1.7的异步加载方式，而且event对象是匿名的，所以无法使用event对象
				//但是event.stop(e);操作实际上还是执行了e.preventDefault();e.stopPropagation();两个方法
				//所以此处可以直接调用这两个方法
//				event.stop(e);
				e.preventDefault();
				e.stopPropagation();
			}
		}
	},
	/**
	*Drop规则：1、children级别的drop.
				a、Sequence不接受Sequence作为children，其他类型都接受
				b、Parallel只接受Sequence作为children，并且dragSource的parentParallel的children必须大于2个，其他类型都不接受
				c、其他类型都不接受children
			   2、sibling级别的drop
			    a、Sequence只接受来自Parallel的Sequence作为Sibling，并且dragSource的parentParallel的children必须大于2个,其他类型都不接受
			    b、其他类型都不接受Sequence作为Sibling，其他都接受
			   3、特殊规则：如果DragSource是Sequence且来自ForEach或IfElse，那么直接返回false
	*/
	checkItemAcceptance:function(target, source, position){

		var treeNode = dijit.getEnclosingWidget(target);
		if(!(treeNode instanceof dijit._TreeNode)) throw new Error("Can't get the corresponding TreeNode object by domNode");
		var name = treeNode.label;
		var dropTarget = reg.getComponentByName(name);
		var selection = source.getSelectedTreeNodes();
		if(selection.length>1) {
			alert("Can't support muti-selection dragging");
			return false;
		}
		var dragSource = reg.getComponentByName(selection[0].label);
		//流程锁定
		if(dragSource.parent != dropTarget.parent || dragSource.parent.locked){
			/*alert("请勿越级移动！");*/
			return false;
		}
		//流程锁定
		if(dragSource instanceof Sequence&&(dragSource.parent instanceof ForEach||dragSource.parent instanceof IfElse))
			return false;
		if(position=="over"){				
			if(dropTarget instanceof Sequence){
				if(dragSource instanceof Sequence)
					 return false;
				return true;
			}else
				return false;
		}else			
			if(dropTarget instanceof Sequence){
				if(dragSource instanceof Sequence/*&&dragSource.parent instanceof Parallel&&dragSource.parent.children.length>2*/)
					return true;
				else if(dragSource instanceof Sequence&&dragSource.parent==dropTarget.parent)
					return true;
				else
					return false;
			}else{
				if(dragSource instanceof Sequence) 
					return false;
				return true;
			}
	},
	//覆盖此方法，当编辑树时忽略树的单击事件，以免焦点移出编辑框
	_onClick: function(/*TreeNode*/nodeWidget, /*Event*/ e){
		if(ignoreKeyEvent) return;
		this.inherited(arguments);	
	}
});

dojo.require("dijit.tree.TreeStoreModel");
dojo.declare("js.TreeStoreModel",dijit.tree.TreeStoreModel,{
	pasteItem: function(/*Item*/childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, /*int?*/ insertIndex){
		this.inherited(arguments);
		//增加一个回调函数，同步更新流程的显示
		this.onPasteItem(childItem,oldParentItem,newParentItem,bCopy,insertIndex);		
	},
	onPasteItem: function(childItem,oldParentItem,newParentItem,bCopy,insertIndex){	
		var child,oldParent,newParent;
		child = reg.getComponentByName(childItem.name[0]);
		newParent = reg.getComponentByName(newParentItem.name[0]);
		oldParent = reg.getComponentByName(oldParentItem.name[0]);
		if(!(newParent instanceof Sequence)){
			newParent = newParent.subProcess;
			oldParent = newParent;
		}
		//更新流程显示
		if(!bCopy){
			var oldIndex = child.parent.children.indexOf(child,0);
			oldParent.removeChild(child,true);
			if(newParent instanceof Sequence){
				//不能根据insertIndex加减一来插入节点，而是要找到占位符
				var placeholder = this.getPlaceholderByInsertIndex(insertIndex,newParent);
				dojo.place(child.node,placeholder.node,"after");
				newParent.addChild(child,ControlUtil.prototype.ComponentMoveMode,oldIndex);
				//child.sendNetMsg(NetMsgUtil.prototype.msgChange,["position",oldIndex]);//树移动组件消息
			}else{
				throw new Error("Unsupported sort of moving");	
			}
		}else{
			throw new Error("Don't support copy now");
		}		
		
		//刷新树的显示
		newParent.addAndSortTreeNode();
		process.validate();
	},
	onNewItem: function(/* dojo.data.Item */ item, /* Object */ parentInfo){
		this.inherited(arguments);
	},
	getPlaceholderByInsertIndex: function(insertIndex,newParent){
		if(!insertIndex) insertIndex = 0;
		newParent.sortChildren();
		var i = 0;
		for(var j=0;j<newParent.children.length;j++){
			var child = newParent.children[j];
			if(child instanceof Placeholder){
				i++;
				if(i==insertIndex+1) return child;		
			}
		}	
		//否则返回最后一个占位符
		var phs = dojo.filter(newParent.children,function(item){
			return item instanceof Placeholder;
		});
		return phs[i-1];
//		throw new Error("Can't find the correct Placeholder");
	}
});
