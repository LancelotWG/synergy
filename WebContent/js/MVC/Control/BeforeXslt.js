/**
 * @author wsj
 */
dojo.declare("BeforeXslt",null,{
	toUengine:function(srcNode){
		//dojo.clone存在BUG？拷贝后的元素前面多加了一个冒号，例如Process变成:Process
		//在未找到其他替代方法之前，先使用prototype的Element.extend()来代替
//		this.node = dojo.clone(srcNode);
		this.node = Element.extend(srcNode);
		//持续时间
//		dojo.create("duration",{innerText:getDuration(process)},this.node,null);
		addDuration(this.node);
		//修改日期
//		var md = dojo.date.difference(new Date(1970,1,1), new Date(), "millisecond");
        var md = new Date().valueOf();
		dojo.create("time",{innerHTML:md},dojo.create("modifiedDate",{},this.node));
		//activitySequence和tracingTag
		addTracingTags(this.node,0);
        //xsl文件中已有相应实现
//		addParentActivity(this.node);
		//id(id与belongingDefinitionId应该是向数据库中保存记录时返回的版本id与流程定义id,当上传流程时，才添加这两个属性)
//		var queryObj = {method:"get",pdId:"1"};
//		var deferred = getProperties(queryObj,this);
//		return deferred.then(dojo.hitch(this,function(){
//			var id = parseInt(this.props[0]) + 1;
//			dojo.create("id",{innerHTML:id},this.node,null);
//			return id;
//		})).then(function(id){
//			queryObj = {method:"set",pdId:id};
//			getProperties(queryObj,this);
//		});
	},
	toCSEEditor:function(srcNode){
//		this.node = dojo.clone(srcNode);
		this.node = Element.extend(srcNode);
		addLinkForSequence(this.node,this.node);
        this.addAccordinates(this.node);
	},
	toModelCenter:function(srcNode){
//		this.node = dojo.clone(srcNode);
		this.node = Element.extend(srcNode);
	},
    caculateCenterXY:function(){
        var minX,minY;
        dojo.forEach(getRealChildren(process),function(child){
            var x = YD.getX(child.node);
            minX = minX ? (x<minX?x:minX) : x;
        });
        minY = dojo.position(process.start.node).y;
        this.minX = minX;
        this.minY = minY;
        this.centerX = minX + process.getLeftWidth();
        this.centerY = minY + getHeight(process)/2;
    },
    /*
        因为显示器的坐标系y轴是向下的，所以旋转90度后坐标变为x=y0;y=x0
     */
    transferPoint:function(pt){
        //将坐标平移至流程中心
        var p = [pt[0]-this.centerX,pt[1]-this.centerY];
        //旋转90度
        var x = p[1];
        var y = p[0];
        if(x<0){
            if(this.minX==undefined) this.minX = -1*x;
            else if(this.minX<(-1*x)) this.minX = -1*x;
        }
        if(y<0){
            if(this.minY==undefined) this.minY = -1*y;
            else if(this.minY<(-1*y)) this.minY = -1*y;
        }
        return [x,y];
    },
    createXY:function(loc,parentNode){
        dojo.create("x",{},parentNode).innerHTML = loc[0];
        dojo.create("y",{},parentNode).innerHTML = loc[1];
    },
    addAccordinates:function(node){
        switch(node.tagName){
            case "Sequence.Process":
                this.caculateCenterXY();
                var x = this.centerX;
                var Init_loc = [x-16-this.minX,dojo.position(process.start.node).y-this.minY];
                var Final_loc = [x-16-this.minX,dojo.position(process.stop.node).y-this.minY];
//                var Init_loc = [x,dojo.position(process.start.node).y+16];
//                var Final_loc = [x,dojo.position(process.stop.node).y+16];
//                Init_loc = this.transferPoint(Init_loc);
//                Final_loc = this.transferPoint(Final_loc);
                this.createXY(Init_loc,dojo.create("InitialNode",{},node));
                this.createXY(Final_loc,dojo.create("FinalNode",{},node));
                var children = dojo.query("children",node)[0].childNodes;
                dojo.forEach(children,dojo.hitch(this,function(child){
                    this.addAccordinates(child);
                }));
                break;
            case "Component":
                var comp = reg.getComponentByName(getChildName(node));
                var loc = YD.getXY(comp.node);
                loc[0] -= this.minX;
                loc[1] -= this.minY;
//                var size = [getWidth(comp),getHeight(comp)];
//                loc[0] += size[0]/2;
//                loc[1] += size[1]/2;
//                loc = this.transferPoint(loc);
                this.createXY(loc,node);
                break;
            case "Parallel":
                var name = getChildName(node);
                var parallel = reg.getComponentByName(name);
                var fork_loc = YD.getXY(parallel.fork);
//                fork_loc[0] += 16;
//                fork_loc[1] += 16;
                fork_loc[0] -= this.minX;
                fork_loc[1] -= this.minY;
                var join_loc = YD.getXY(parallel.join);
                join_loc[0] -= this.minX;
                join_loc[1] -= this.minY;
//                join_loc[0] += 12;
//                join_loc[1] += 12;
//                fork_loc = this.transferPoint(fork_loc);
//                join_loc = this.transferPoint(join_loc);
                //因为CSEEditor中的Fork和Join节点是一样大的，而Parallel中的Fork和Join是不一样大的，所以
                //此处将Join的y值补偿为Fork的y值
//                join_loc[1] = fork_loc[1];
                var forkNode = dojo.create("ForkNode",{name:"Fork_"+name},node);
                var joinNode = dojo.create("JoinNode",{name:"Join_"+name},node);
                this.createXY(fork_loc,forkNode);
                this.createXY(join_loc,joinNode);
                var children = dojo.query("children",node)[0].childNodes;
                dojo.forEach(children,dojo.hitch(this,function(child){
                    this.addAccordinates(child);
                }));
                break;
            case "Sequence.Branch":
                var children = dojo.query("children",node)[0].childNodes;
                dojo.forEach(children,dojo.hitch(this,function(child){
                    this.addAccordinates(child);
                }));
                break;
            default:
        }
        //坐标平移，将坐标中的负值转换为正值
//        if(node.tagName == "Sequence.Process"){
//            if(this.minX){
//                dojo.forEach(dojo.query("x",this.node),dojo.hitch(this,function(item){
//                    item.innerHTML = parseInt(item.innerHTML) + this.minX;
//                }));
//            }
//            if(this.minY){
//                dojo.forEach(dojo.query("y",this.node),dojo.hitch(this,function(item){
//                    item.innerHTML = parseInt(item.innerHTML) + this.minY;
//                }));
//            }
//        }
    }
});
