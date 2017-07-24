/**
 * @author wanshujia
 */
dojo.require("dojox.gantt.GanttTaskItem");
dojo.declare("js.GanttTaskItem",dojox.gantt.GanttTaskItem,{	
	addChildTask: function(task){
		this.cldTasks.push(task);
		task.parentTask = this;	
		//dojox中的GanttTaskItem的addChildTask方法中缺少了setProject
		task.setProject(this.project);	
	}
});
