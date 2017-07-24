/**
 * @author lenovo
 */
dojo.provide("js.PropertyChangeSupport");
dojo.declare("js.PropertyChangeSupport",null,{
		listeners:null,
		constructor: function(){
			this.listeners = new Array();
			this.listeners.push(reg);
		},
		addListener: function(listener){
			this.listeners.push(listener);
		},
		removeListener: function(listener){
			var index = this.listeners.indexOf(listener);
			this.listeners.splice(index,1);
		},
		firePropertyChange: function(event,source){
			event.source = source;
			for (var i=0; i<this.listeners.length; i++) {
				var listener = this.listeners[i];
				if(listener==source) continue;
				listener.propertyChange(event);
			};
		}
	});
dojo.declare("js.PropertyChangeEvent",null,{
	propName:"",
	oldValue:'',
	newValue:"",
	source:null,
	constructor: function(args){
		dojo.safeMixin(this,args);
	}
});
