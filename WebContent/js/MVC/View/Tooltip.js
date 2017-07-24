/**
 * @author lenovo
 */
dojo.provide("js.Tooltip");
dojo.require("dijit.Tooltip");
dojo.declare("js.Tooltip",dijit.Tooltip,{
	propertyChange:function(evt){
		if(evt.propName=="desc"){
			this.label = "<i>"+evt.newValue+"</i>";
		}
	}
});