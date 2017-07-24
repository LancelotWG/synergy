/**
 * @author LancelotWG
 * 传输控制类
 */

dojo.declare("ControlFlow",UnNamedNode,{
	parent:null,
	defaultSize:42,
	src:"",
	initDomNode: function(){
		this.node = dojo.create("div",{className:"ControlFlow",style:{"width":this.defaultSize+"px","height":this.defaultSize+"px","float":"left"}},this.refNode,this.pos);
		/*if(Hlayout){*/
			src = contextPath+"/resource/image/icons/ControlFlow.png";
		/*}else{
			src = contextPath+"/resource/image/icons/VArrow.png";
		}*/
		dojo.create("img",{src:src},this.node,"first");
	},/*,
	changeLayout: function(){
		if(Hlayout){
			src = contextPath+"/resource/image/icons/HArrow.png";
			this.node.firstChild.src = src;
		}else{
			src = contextPath+"/resource/image/icons/VArrow.png";
			this.node.firstChild.src = src;
		}
	}*/
	/*,
	getWidth: function(){
		return 18;
	},
	getHeight: function(){
		return 18;
	}	*/
	sendNetMsg:function(operate,additiveAttribute){
		switch (operate){
			case NetMsgUtil.prototype.msgNew:
				var index = this.parent.children.indexOf(this,0);
				var msg = new NetMsg(NetMsgUtil.prototype.msgNew,this,index);
				msg.msgSend();
				break;
			case NetMsgUtil.prototype.msgChange:

				break;
			case NetMsgUtil.prototype.msgDelete:
				var index = this.parent.children.indexOf(this,0);
				var msg = new NetMsg(NetMsgUtil.prototype.msgDelete,this,index);
				msg.msgSend();
				break;
		}
	}
});