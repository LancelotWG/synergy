/**
 * @author wanshujia
 * 在usage中给出的使用示例中的参数都是必须的参数，如果缺少，会发生不可预料的错误，
 * 因为程序中没有对参数进行检查，任意个数的参数都是合法的
 */
//组件名字自动加1的控制器
var nameIndexMap = new Hash();
var globalId = new Hash();
var YD = YAHOO.util.Dom;
//var ifElseReg = [];
/**
 * Abstract base class
 */
dojo.require("dojo.Stateful");
dojo.declare("Model",dojo.Stateful,{
	//对应的dom节点
	node:null,
	//唯一标识符
	id:"",
	//父模型
	parent:null,
	connects:[],
	constructor: function(args){
		if(args)
			dojo.safeMixin(this,args);
		if(globalId.get("Model") == undefined){
			globalId.set("Model",1);
		}else{
			var index = globalId.get("Model");
			index += 1;
			globalId.set("Model",index);
		}
		this.id = globalId.get("Model");
	},
	getWidth: function(){
		return this.node.offsetWidth;
	},
	getHeight: function(){
		return this.node.offsetHeight;
	},
	destroyRecursive:function(){
		this.destroyDescendants();
		this.destroy();
	},
	destroyDescendants:function(){},
	destroy: function(){
		dojo.forEach(this.connects,dojo.disconnect);
		this.destroyRendering();
	},
	destroyRendering:function(){
		if(this.node){
			dojo.destroy(this.node);
			delete this.node;
		}			
	}
});




