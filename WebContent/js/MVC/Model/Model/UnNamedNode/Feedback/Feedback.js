/**
 * Usage:new Component.Feedback({type:"Catia"});
 */

dojo.declare("Feedback",UnNamedNode,{
	type:"",
	name:"",
	initDomNode:function(){
		if(this.type == "ControlFlow"){
			this.node = dojo.create("div",{
				className:"ControlFlow Inactivity",
				align:"center",
				style:{"width":"80px"}
			});
		}else if(this.type == "BusConnect"){
			this.node = dojo.create("div",{
				className:"BusConnect Inactivity",
				align:"center",
				style:{"width":"80px"}
			});
		}else{
			this.node = dojo.create("div",{
				className:"Component Activity",
				align:"center",
				style:{"width":"80px"}
			});
		}
        //如果type不是英文的，就使用Default.png作为其图片，因为中文的图片名无法正常显示
        if(!isEnglishCharacter(this.type))
            dojo.create("img",{src:contextPath+"/resource/image/icons/"+"Default.png",alt:this.type},this.node,null);
        else
            dojo.create("img",{src:contextPath+"/resource/image/icons/"+this.type+".png",alt:this.type},this.node,null);

//		dojo.create("img",{src:"icons/"+this.type+".png",alt:this.type},this.node,null);
		dojo.create("br",null,this.node,null);
		dojo.create("label",{innerHTML:this.name},this.node,null);
	}
});
