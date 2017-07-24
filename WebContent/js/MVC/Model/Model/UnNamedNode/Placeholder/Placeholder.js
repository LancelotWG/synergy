/**
 * Usage:new Placeholder({parent:container,type:"dropAfter",refNode:prev_node,pos:"after"});
 */

dojo.declare("Placeholder",UnNamedNode,{
	//type can be one of dropAfterAndBefore/dropBefore/dropAfter
	defaultSize:[26,26],//[width,height]
	defaultMargin:[8,8,8,8],//[top,right,bottom,left]
	type:"",
	description:"Drop here",
	dropZone:null,
	initDomNode:function(){
		this.node = dojo.create("div",{
	  	    className:this.type,
		    style:{
		  		"width":this.defaultSize[0]+"px",
				"height":this.defaultSize[1]+"px",
				margin:this.defaultMargin[0]+"px"
		    }			  
		},this.refNode,this.pos);
		/*if(this.type = "busConnect"){
			YD.setStyle(this.node,"background-color","#80ffff");
		}else{
			YD.setStyle(this.node,"background-color","#66ccff");
		}*/
	},
	getWidth: function(){
		return this.defaultSize[0] + this.defaultMargin[1] + this.defaultMargin[3];
	},
	getHeight: function(){
		return this.defaultSize[1] + this.defaultMargin[0] + this.defaultMargin[2];
	}
});