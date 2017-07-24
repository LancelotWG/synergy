/**
 * Abstract class
 */

dojo.declare("NamedNode",Model,{
	//组件名
	name:"",
	//类型，此属性必须在构造函数中指定
	type:"",
	//描述
	description:"",
	//属性监听支持，只要有名字，就应该有此属性。它可以处理在多个视图之间同步name以及其它一些需要显示的属性
	propertyChangeSupport:null,
	//显示在属性面板中的组件的属性列表，只有组件双击时需要显示属性面板，就应该有此属性
	props:null,
	//开始日期
	sdate:"",
	//结束日期
	edate:"",
	
	constructor: function(args){
		if(!this.name)
			this.autoNamed();
		if(!this.description)
			this.description = this.type;
		this.propertyChangeSupport = new js.PropertyChangeSupport();
		this.propertyChangeSupport.addListener(this);
		this.initDomNode();
		this.props = [];
		this.fillProps();
		this.treeNode = {name:this.name,des:this.description,type:this.type,quote:this};
	},
	initDomNode:null,
	fillProps:function(){
		this.props.push({name:"Activity Name: ",dojoType:"dijit.form.ValidationTextBox"});
		this.props.push({name:"Activity Description: ",dojoType:"dijit.form.TextBox"});
	},
	propertyChange:function(evt){
		if(evt.propName=="name"){
			this.name = evt.newValue;
		}
	},
	//此方法在修改name,通知其他监听器更新
	setName:function(newName){
		if(this.name==newName) return;
		var oldName = this.name;
		this.name = newName;
		if(this.nameField)
			this.nameField.innerHTML = newName;
		//更新store,树将自动更新显示
		if(this.storeItem)	processTree.treeStore.setValue(this.storeItem, "name", newName);
		var event = new js.PropertyChangeEvent({propName:"name",oldValue:oldName,newValue:newName,source:this});
		this.propertyChangeSupport.firePropertyChange(event,this);
		//模块名称更改时间配置响应
		var change = timeConfigureGrid.timeConfigureStore_hb.items.filter(function(item){
			if(item.name==oldName)
				return true;
		});
		if((timeConfigureGrid.timeConfigureStore_hb.items.indexOf(change[0])) != -1)
			timeConfigureGrid.timeConfigureStore_hb.items[(timeConfigureGrid.timeConfigureStore_hb.items.indexOf(change[0]))].name = [newName];
		timeConfigureGrid.grid._refresh();
		//模块名称更改时间配置响应

		if(this.subProcess != null||(this instanceof Sequence.Process)){
			var check = process.parentComponent;
			if(check == null)
				dojo.byId("location").innerHTML = "<b>"+ process.name + "</b>";//层级
			else{
				//层级
				var parentComponent = process.parentComponent;
				var parentProcess = parentComponent.parent;
				var location = "<b>"+parentComponent.name+"</b>";
				parentComponent = parentProcess.parentComponent;
				while(parentComponent!=null){
					parentProcess = parentComponent.parent;
					location = parentComponent.name + ">>" + location;
					parentComponent = parentProcess.parentComponent;
				}
				location = parentProcess.name + ">>" + location;
				dojo.byId("location").innerHTML = location;
				//层级
			}
		}
	},
	setDesc:function(newDesc){
		if(this.description==newDesc) return;
		var oldDesc = this.description;
		this.description = newDesc;
		/*if(this.storeItem)	tree_store.setValue(this.storeItem, "des", newDesc);*/
		var event = new js.PropertyChangeEvent({propName:"description",oldValue:oldDesc,newValue:newDesc,source:this});
		this.propertyChangeSupport.firePropertyChange(event);
	},
	//自动命名编号
	autoNamed:function(){
		if(nameIndexMap.get(this.type) == undefined || nameIndexMap.get(this.type) == "undefined"){
			nameIndexMap.set(this.type,1);	
			this.name = this.type;
		}else{
			var index = nameIndexMap.get(this.type);
			index += 1;
			this.name = this.type + index;
			nameIndexMap.set(this.type,index);	
		}	
	},
	toString: function() {
        return this.name;
   	},
	destroy: function(){
		reg.deRegistry(this);
		this.inherited(arguments);
	},
    onDelete:function(){
        //此方法是一个回调函数，用来被connect
    }
});