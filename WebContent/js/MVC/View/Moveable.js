/**
 * @author wanshujia
 */
dojo.require("dojo.dnd.Moveable");
dojo.declare("js.Moveable",dojo.dnd.Moveable,{
	onDragDetected: function(/* Event */ e){
		// summary:
		//		called when the drag is detected;
		//		responsible for creation of the mover
		this.mover2 = new this.mover(this.node, e, this);
	}
});
