/**
 * @author lenovo
 * 这个类的作用是提供统一的接口来操作RadioButton，如get("value")可以获得当前选中的RadioButton的值，
 * destroyRecursive方法来销毁所有的RadioButton.
 */

dojo.declare("js.RadioGroup",null,{
	//RadioButton对应的标签的数组，长度应该等于num
	labels:null,
	//RadioButton的value数组
	values:null,
	//RadioButton的数量
	num:2,
	//RadioButton的数组
	radios:null,
	id:"",
	name:"RadioGroup",
	//必须的属性
	parentNode:null,
	horiz:true,
	constructor:function(args){
		if(args)
			dojo.safeMixin(this,args);
		this.radios = [];
		//如果没给values，就用labels作为values
		if(!this.values){
			this.values = [];
			dojo.forEach(this.labels,dojo.hitch(this,function(item){
				this.values.push(item);
			}));
		}			
		this.create();
		dijit.registry.add(this);
	},
	create:function(){
		for(var i=0;i<this.num;i++){
			var radio = new dijit.form.RadioButton({name:this.name,value:this.values[i]});
			radio.placeAt(this.parentNode,null);
			this.radios.push(radio);
			dojo.create("label",{'for':this.name,innerHTML:this.labels[i]},this.parentNode,null);	
			if(!this.horiz) dojo.create("br",{},this.parentNode,null);
		}
	},
	get: function(name){
		if(name=="value"){
			var value;//返回checked的RadioButton的值
			dojo.forEach(this.radios,function(item){
				if(item.get("checked")) value = item.get("value");
			});
			return value;
		}
	},
	destroyRecursive: function(/*Boolean?*/preserveDom){
		dijit.registry.remove(this.id);
		dojo.forEach(this.radios,function(item){
			item.destroyRecursive(false);
		});
		dojo.empty(this.parentNode);
	}
});
