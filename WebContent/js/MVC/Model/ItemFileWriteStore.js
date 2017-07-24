/**
 * @author wanshujia
 */
dojo.declare("ItemFileWriteStore",dojo.data.ItemFileWriteStore,{
	//覆盖onDelete方法，在删除item时，先将所有对此item的引用置为无效
	//主要用在pvs_store,roles_store,exp_store上
	onDelete:function(item){
		//item在表达式中被引用所使用的字段是它的identity,将identity的值先读出来，作为比较值comparasion
		var comparasion = item[this._getIdentifierAttribute()][0];
		if(this.linkedGrid=="exp_grid") comparasion = item["content"][0];
		/**
		 * 先检查exp_store中是否对此item进行了引用
		 */
		dojo.hitch(this,checkStoreReference,exp_store,comparasion,["left","right"])();
		/**
		 * 再检查当前store特有的引用。pvs_store需要额外检查cpv_store、dataMap_store；
		 * roles_store需要额外检查Component；exp_store需要额外检查IfElse、ForEach
		 */
		switch(this.linkedGrid){
			case "pvs_grid"://协同变量与数据映射
				dojo.hitch(this,checkStoreReference,cpv_store,comparasion,["name"])();
				dojo.hitch(this,checkStoreReference,dataMap_store,comparasion,["name"])();
				break;
			case "roles_grid":
				//从绑定的组件中删除关联
				dojo.forEach(getAllChildTask(process),function(taskName){
					var comp = reg.getComponentByName(taskName);
					delete comp.role;
				});
				break;
			case "exp_grid":
				dojo.hitch(this,maintainKeyArgs)(item);
				break;
			case "cpv_grid":
			case "dm_grid":
				dojo.hitch(this,maintainKeyArgs)(item);
				break;
			default:
		}	
		this.save();
	},
	onSet: function(/* item */ item,
					/*attribute-name-string*/ attribute,
					/*object|array*/ oldValue,
					/*object|array*/ newValue){
		this.save();
	},

	onNew: function(/* item */ newItem, /*object?*/ parentInfo){
		this.save();
	}
});
function maintainKeyArgs(item){
	var index;
	for(var i=0;i<keyArgs.length;i++){
		var key = keyArgs[i];
		if(item==key.item) index = i;
	}
    if(index)
	    keyArgs.splice(index,1);
	//删除了一个Item之后，keyArgs中保存的rowIndex会发生位移
	var items = this._getItemsArray();
	dojo.forEach(keyArgs,function(key){
		if(contains(items,key.item)){
			key.rowIndex = items.indexOf(key.item);
		}
	});
}
function checkStoreReference(store,comparasion,attrs){
	dojo.forEach(store._getItemsArray(),dojo.hitch(this,function(item,i){
		var values = [];
		dojo.forEach(attrs,function(attr){
			values.push(store.getValue(item,attr));
		});
		if(contains(values,comparasion)){
			//将符合条件的表达式置为无效
			if(store.getValue(item,"valid")=="有效")
				store.setValue(item,"valid","<label style='color:red'>无效</label>");
			//添加tooltip，提示无效原因
			var msg;
			switch(this.linkedGrid){
				case "pvs_grid":
					msg = "流程变量:" + "<label style='color:red'>" + comparasion + "</label>" + "的引用不存在";
					break;
				case "roles_grid":
					msg = "角色:" + "<label style='color:red'>" + comparasion + "</label>" + "的引用不存在";
					break;
				case "exp_grid":
					msg = "子表达式:" + "<label style='color:red'>" + comparasion + "</label>" + "的引用不存在";
					break;
				default:
			}
			//因为失效原因可能不止一条，所以使用数组inValidMsg来保存失效信息，保存在对应的item中
			if(!item.inValidMsg) item.inValidMsg = [];
			item.inValidMsg.push(msg);
			var colIndex;
			switch(store.linkedGrid){
				case "cpv_grid":
				case "dm_grid":
					colIndex = 5;
					break;				
				case "exp_grid":
					colIndex = 3;
					break;
				default:
			}
			keyArgs.push({
				rowIndex: i,
				colIndex: colIndex,	
				item: item
			});	
		}
	}));
}
function addTooltipForGrid(grid){
	grid.connect(grid,"onCellMouseOver",filtCells);
	grid.connect(grid,"onCellMouseOut", function(e){
		dijit.hideTooltip(e.cellNode);
	});
}
function filtCells(e){
	var inValidMsg,isValidCell;
	for (var i=0; i<keyArgs.length; i++) {
		var key = keyArgs[i];
		if(key.rowIndex==e.rowIndex&&key.colIndex==e.cellIndex){
			isValidCell = true;
			inValidMsg = key.item.inValidMsg;
			break;
		}
	};
	if(isValidCell) dijit.showTooltip(decoreteMessage(inValidMsg), e.cellNode);
};
//function addTooltipForGrid(item,grid,store,columnIndex,rowIndexs){
	//避免重复connect
//	if(!item._connects){
//		item._connects = [];
//		item._connects.push(dojo.connect(grid, "onCellMouseOver", dojo.hitch(item,function(e){
//			var isValidCell = dijit.byId(store.linkedGrid).getItemIndex(this)==e.rowIndex&&e.cellIndex==columnIndex;
//			var isValidCell = contains(rowIndexs,e.rowIndex)&&e.cellIndex==columnIndex;
//			//仅在valid单元格上添加tooltip
//			if(isValidCell){
//				dijit.showTooltip(decoreteMessage(this.inValidMsg), e.cellNode);
//			}				
//		})));
//		item._connects.push(dojo.connect(grid, "onCellMouseOut", function(e){
//			dijit.hideTooltip(e.cellNode);
//		}));
//	} 
//}
function decoreteMessage(messages){
	if(messages.length==1) return messages[0];
	var result = "<ul>";
	dojo.forEach(messages,function(item){
		result = result + "<li>" + item + "</li>"
	});
	result += "</ul>";
	return result;
}