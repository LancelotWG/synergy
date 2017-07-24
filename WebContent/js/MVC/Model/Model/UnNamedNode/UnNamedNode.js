/**
 * Abstract class 
 */

dojo.declare("UnNamedNode",Model,{
	refNode:null,
	pos:"",
	constructor:function(args){
		this.initDomNode();
	},
	initDomNode:function(){}
});
