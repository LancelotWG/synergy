/**
 * @author lenovo
 * 这个类作为一个全局注册表，所有组件一经创建必须向此类中注册。此类提供getComponentByName(name)方法，以实现在不同视图间同步修改组件名的目的
 */
dojo.provide("js.GlobalRegistry");
dojo.declare("js.GlobalRegistry",null,{
	_reg:new Hash(),
	constructor: function(){
	},
	registry:function(comp){
		this._reg.set(comp.id,comp);
	},
	deRegistry:function(comp){
		this._reg.unset(comp.id);
	},
	propertyChange:function(evt){
		var id = evt.source.id;
		if(id){
			var obj = this._reg.get(id);
			if(obj){
				this._reg.unset(id);
				this._reg.set(id,evt.source);
			}
		}
	},
	getComponentByName:function(name){
		function select(comp){
			if(comp[1].name==name)
				return true;
			else return false;
		}
		var cell = this._reg.filter(select);
		if (cell.length==0)
			return null;
		return cell[0][1];
	},
	getComponentById:function(id){
		return this._reg.get(id);
	},
	clearRegistry:function(){
		this._reg = new Hash();
	}
});

