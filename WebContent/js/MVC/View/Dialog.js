/**
 * @author wanshujia
 */
dojo.require("dojox.widget.Dialog");
//dojo.declare("js.Dialog",dojox.widget.Dialog,{
//dojox.widget.Dialog太卡了
dojo.declare("js.Dialog",dijit.Dialog,{
	_setup: function(){
			var node = this.domNode;

			if(this.titleBar && this.draggable){
				this._moveable = new ((dojo.isIE == 6) ? dojo.dnd.TimedMoveable // prevent overload, see #5285
					: js.Moveable)(node, { handle: this.titleBar });
				this.connect(this._moveable, "onMoveStop", "_endDrag");
				//监听mouseup事件，因为Mover不能正常的监听到touch.release事件
				dojo.connect(this.titleBar,"onmouseup",this,function(e){
					this._moveable.mover2.onMouseUp(e);
				});
			}else{
				dojo.addClass(node,"dijitDialogFixed");
			}

			this.underlayAttrs = {
				dialogId: this.id,
				"class": dojo.map(this["class"].split(/\s/), function(s){ return s+"_underlay"; }).join(" ")
			};
			
			if(!this._alreadyInitialized){
				this._navIn = dojo.fadeIn({ node: this.closeButtonNode });
				this._navOut = dojo.fadeOut({ node: this.closeButtonNode });
				if(!this.showTitle){
					dojo.addClass(this.domNode,"dojoxDialogNoTitle");
				}
			}
//            dojo.style(node,"fontSize","12pt");
	}
});
dojo.declare("js.DialogWithoutClose",dijit.Dialog,{
	show:function(){
		if(dojo.hasClass(this.closeButtonNode,"dijitDialogCloseIcon"))
			dojo.removeClass(this.closeButtonNode,"dijitDialogCloseIcon")
		this.inherited(arguments);
	},
	_onKey: function(/*Event*/evt){
		if(evt.charOrCode==dojo.keys.ESCAPE) return;
		this.inherited(arguments);
	}
});
