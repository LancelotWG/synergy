dojo.require("dijit.InlineEditBox");
dojo.declare("InplaceEditor",dijit.InlineEditBox,{
	oldValue:"",
	isNeedSetLoc:true,
	treeNode:null,
	save: function(/*Boolean*/focus){
		//在未保存之前不同用this.getValue()方法得到newValue，只能从编辑部件dijit.form.TextBox中得到newValue
		var newValue = this.wrapperWidget.editWidget.getValue();
		if(validateInputValue(newValue,this.oldValue)){
			this.inherited(arguments);
			//修改组件的name
			var component = reg.getComponentByName(this.oldValue);
			component.setName(newValue);
			//流程名、组件名修改消息
			component.sendNetMsg(NetMsgUtil.prototype.msgChange,["name",this.oldValue]);
			/*var msg = new NetMsg(2,component,["name",this.oldValue]);
			msg.msgSend();*/
			/*if(component instanceof Sequence.Process){

			}else if(component instanceof Component){

			}*/
		}else{
			//如果输入不合法，要先更改编辑部件dijit.form.TextBox的值，再调用保存方法
			this.wrapperWidget.editWidget.setValue(this.oldValue);
			this.inherited(arguments);
		}
		if(this.isNeedSetLoc){
			//保存完可能出现名字没有位于左上角的BUG，这里使用YD.setXY将组件移动到左上角去,只有ContainerNode需要这么做
			var comp = reg.getComponentByName(this.getValue());
			if(comp instanceof ContainerNode){
				if(comp.state.expanded){
					var loc = YD.getXY(comp.node);
					var nameWidth = dojo.getMarginBox(this.domNode).w;
					YD.setXY(this.domNode,[loc[0]+getWidth(comp)-nameWidth,loc[1]]);
				}				
			}	
		}		
		
		/*ignoreKeyEvent = false;
		
		var params={};
		for(var i=0; i<processTree.dndParams.length;i++){
			if(processTree[processTree.dndParams[i]]){
				params[processTree.dndParams[i]] = processTree[processTree.dndParams[i]];
			}
		}*/
		//processTree.dndController = new dijit.tree.dndSource(processTree,params);
	},
	edit: function(){
		//将旧值保存起来(Dojo存在一个BUG，当this.displayNode通过其他方式被修改时，InlineEditor不能实时的反应这些变化)
//		this.oldValue = this.getValue();

		//流程锁定
		var locked = false;
		var lockedProcess = reg.getComponentByName(this.displayNode.innerText);
		if(lockedProcess != null){
			var component0 = lockedProcess.parent.parentComponent;
			if(component0 == null){
				//软件系统主管
				if(roleControl(0, null)){

				}else{
					this.cancel(false);
					return ;
				}
			}else{
				var component1 = component0.parent.parentComponent;
				if(component1 == null){
					//软件构件主管
					if(roleControl(1, component0.type)){

					}else{
						this.cancel(false);
						return ;
					}
				}else{
					//软件设计人员
					if(roleControl(2, null)){

					}else{
						this.cancel(false);
						return ;
					}
				}
			}
		}
		var lockedSubProcess;
		if(lockedProcess instanceof Sequence.Process){

		}else if(lockedProcess instanceof Component){
			lockedSubProcess = lockedProcess.subProcess;
			lockedProcess = lockedProcess.parent;
		}
		if(lockedSubProcess != null){
			if(lockedSubProcess.locked){
				locked = true;
			}
		}
		if(lockedProcess.locked || locked){
			//alert("此流程被锁定！");
			this.cancel(false);
			return;
		}
		//流程锁定
		this.oldValue = this.displayNode.innerText;
		this.value = this.oldValue;
		this.inherited(arguments);
		
		ignoreKeyEvent = true;
		//当处于编辑状态时，将dndController释放掉，否则dndController会控制拖拽权，使得无法拖拽选中文字
		//processTree.dndController.destroy();
	},
	cancel: function(/*Boolean*/focus){
		this.inherited(arguments);
		ignoreKeyEvent = false;
		//当退出编辑状态时要重新构造出dndController，否则无法进行树的拖拽
		/*var params={};
		for(var i=0; i<processTree.dndParams.length;i++){
			if(processTree[processTree.dndParams[i]]){
				params[processTree.dndParams[i]] = processTree[processTree.dndParams[i]];
			}
		}*/
		//processTree.dndController = new dijit.tree.dndSource(processTree,params);
		
	}
});
