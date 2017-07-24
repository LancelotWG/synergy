/**
 * @author lenovo
 */
dojo.require("dojox.grid._Builder");
dojo.declare("js._HeaderBuilder",dojox.grid._HeaderBuilder,{
		beginColumnResize: function(e){
			this.moverDiv = document.createElement("div");
			dojo.style(this.moverDiv, {
				position: "absolute",
				left: 0
			}); // to make DnD work with dir=rtl
			dojo.body().appendChild(this.moverDiv);
			dojo.addClass(this.grid.domNode, "dojoxGridColumnResizing");
			//使用自定义的Moveable
			var m = (this.moveable = new js.Moveable(this.moverDiv));
			
			var drag = this.colResizeSetup(e, true);
			
			m.onMove = dojo.hitch(this, "doResizeColumn", drag);
			//使用自定义的监听器监听mouseup事件，因为Mover的touch.release监听器不可靠
			dojo.connect(dojo.body(), "onmouseup", dojo.hitch(this,function(e){
				if(!this.moveable) return;
				if(!this.moveable.mover2) return;
				this.moveable.mover2.onMouseUp(e);
			}));
			dojo.connect(m, "onMoveStop", dojo.hitch(this, function(){
				this.endResizeColumn(drag);
				if (drag.node.releaseCapture) {
					drag.node.releaseCapture();
				}
				this.moveable.destroy();
				delete this.moveable;
				this.moveable = null;
				dojo.removeClass(this.grid.domNode, "dojoxGridColumnResizing");
			}));
			
			if (e.cellNode.setCapture) {
				e.cellNode.setCapture();
			}
			m.onMouseDown(e);
		}
});