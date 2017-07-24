/**
 * Usage:new Start({parent:container,name:"Start",refNode:prev_node,pos:"after"});
 */

dojo.declare("Start",NamedNode,{
	refNode:null,
	pos:"",
	initDomNode: function(){
		this.node = dojo.create("div",{align:"center",className:"Start"},this.refNode,this.pos);
		dojo.create("img",{src:contextPath+"/resource/image/icons/"+this.name+".png",alt:this.name},this.node,null);
	},
	getWidth: function(){
		return 32;
	},
	getHeight: function(){
		return 32;
	}
});