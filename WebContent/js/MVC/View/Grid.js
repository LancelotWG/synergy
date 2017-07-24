/**
 * @author lenovo
 */
dojo.require("dojox.grid.EnhancedGrid");
dojo.declare("js.Grid",dojox.grid.EnhancedGrid,{
	createView: function(inClass, idx){
		var c = dojo.getObject(inClass);
		//使用自定义的_headerBuilderClass
//		var view = new c({ grid: this, index: idx,_headerBuilderClass: js._HeaderBuilder});
        var view = new c({ grid: this, index: idx});
		this.viewsNode.appendChild(view.domNode);
		this.viewsHeaderNode.appendChild(view.headerNode);
		this.views.addView(view);
		dojo.attr(this.domNode, "align", this.isLeftToRight() ? 'left' : 'right');
        //处理滚动条问题
        dojo.style(this.domNode,{width:"95%",height:"90%"});
		return view;
	}
});
