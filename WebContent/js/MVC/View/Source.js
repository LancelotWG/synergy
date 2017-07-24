dojo.require("dojo.dnd.Source");
dojo.declare("js.Source",dojo.dnd.Source,{
	//覆盖Container类中的方法，通过markup创建的对象默认跳过startup方法
	//在startup方法中会给this.parent和this.defaultCreator赋值，如果这两个属性没有值，不能通过InsertNodes方法插入item
	markupFactory: function(params, node, ctor){
//		params._skipStartup = true;
		return new ctor(node, params);
	},
	checkAcceptance: function(source, nodes){
		// summary:
		//		checks if the target can accept nodes from this source
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		if(this == source){
			return !this.copyOnly || this.selfAccept;
		}
		for(var i = 0; i < nodes.length; ++i){
			var type = source.getItem(nodes[i].id).type;
			// type instanceof Array
			var flag = false;
			for(var j = 0; j < type.length; ++j){
				if(type[j] in this.accept){
					flag = true;
					break;
				}
			}
			if(!flag){
				return false;	// Boolean
			}
		}
		
		var cooperType = dijit.byId("cooperTypeSelect").get("value");
		var n = this.node.children.length;
		if((cooperType=="1:1"||cooperType=="1:n")&&this.id=="dnd_target1"){
			if(n>0) return false;
			else if(nodes.length>1) return false;
			else return true;
		}
		if((cooperType=="1:1"||cooperType=="n:1")&&this.id=="dnd_target2"){
			if(n>0) return false;
			else if(nodes.length>1) return false;
			else return true;
		}
		
		return true;	// Boolean
	},
	onMouseUp: function(e){
		// summary:
		//		event processor for onmouseup
		// e: Event
		//		mouse event
		if(this.mouseDown){
			this.mouseDown = false;
			dojo.dnd.Source.superclass.onMouseUp.call(this, e);
		}else{
			//添加代码，控制err_border的删除
			var cooperType = dijit.byId("cooperTypeSelect").get("value");
			if(dojo.hasClass(this.node,"err_border")){				
				if(this.id=="dnd_target1"){
					if(cooperType=="1:1"||cooperType=="1:n")
						dojo.removeClass(this.node,"err_border");
					else if(this.node.children.length>=1)
						dojo.removeClass(this.node,"err_border");
				}else if(this.id=="dnd_target2"){
					if(cooperType=="1:1"||cooperType=="n:1")
						dojo.removeClass(this.node,"err_border");
					else if(this.node.children.length>=1)
						dojo.removeClass(this.node,"err_border");
				}	
				//cooperType要求1个，实际有n个，此时要监听dnd_source的mouseup事件			
			}else if(this.id=="dnd_source"){
				var source = dojo.dnd._manager.source;
				if(dojo.hasClass(source.node,"err_border")){
					if(source.id=="dnd_target1"){
						if(cooperType=="1:1"||cooperType=="1:n"){
							if(source.node.children.length==2) dojo.removeClass(source.node,"err_border");
						}
					}else if(source.id=="dnd_target2"){
						if(cooperType=="1:1"||cooperType=="n:1"){
							if(source.node.children.length==2) dojo.removeClass(source.node,"err_border");
						}
					}
				}				
			}			
		}
		/*
		 * 由于未知原因，dojo.dnd.Manager不能捕获mouseup事件。而dojo.dnd.Source能够捕获到mouseup事件.
		 * 所以在此处将mouseup事件传播给的dojo.dnd.Manager
		 */
		dojo.dnd._manager.onMouseUp(e);
	}
});
