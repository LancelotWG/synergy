/**
 * @author lenovo
 */
function saveToLocal(fileName){
//    var win = window.frames("fileIframe");
//    win.document.open();
//    var values = dijit.byId("saveFileForm").gatherFormValues(["SaveType"]);
//    var filpyName = process.name + ".xml";
//    var lines = values.SaveType.split("\r\n");
//    dojo.forEach(lines,function(line){
//        win.document.write(toAscii(line));
//        win.document.write("\r\n");
//    });
//    win.document.close();
//    var result = win.document.execCommand("SaveAs",true,filpyName);
//    if(result){
//        alert("保存成功");
//        dijit.byId("saveDlg").onCancel();
//    }
    //window.location.href = "user_downloadFile.xhtml?processName=" + (reg.getComponentById(1)).name;

    //此处不能用onCancel方法，因为onCancel方法会导致服务器上临时文件被删除，那么下载就会失败，因此改用hide方法
    //临时文件的删除延迟到下次打开该网页的时候

	window.open("user_downloadFile.xhtml?processName=" + os.mainProcess.name + "&fileName=" + os.mainProcess.name + ".cfg");
    dijit.byId("saveDlg").hide();
	//netController.onConnect();//重新连接服务器
}
function toAscii(str){
    var s = "";
    for(var i=0;i<str.length;i++){
        var ch = str.charCodeAt(i);
        s += String.fromCharCode(ch);
    }
    return s;
}

function setComponentProperty(){
	var property = document.getElementById("componentPropertyForm");
	configuringComponent.property.push({name:"property1",data:property.Property1.value});
	configuringComponent.property.push({name:"property2",data:property.Property2.value});
	configuringComponent.property.push({name:"property3",data:property.Property3.value});
	configuringComponent.property.push({name:"property4",data:property.Property4.value});
	configuringComponent.property.push({name:"property5",data:property.Property5.value});
	configuringComponent.property.push({name:"property6",data:property.Property6.value});
	configuringComponent.property.push({name:"property7",data:property.Property7.value});
	dijit.byId("setComponentPropertyDlg").hide();
}

function getRealChildren(obj){
	return dojo.filter(obj.children,function(item){
		if(isRealChild(item)&&isNotHiddenSequence(item)) return true;
	});
}
function getRealChildrenRecursively(obj){
	if(!this.tag)
		this.tags = ["Parallel","Sequence","Sequence.Branch","ForEach","IfElse","Catia","ProE","Solidworks","UG","Abaqus","Adams","Ansys","Matlab","Patran","VirtualLab"];
	var res = [];
	if(contains(this.tags,obj.tagName))
		res.push(obj);
	if(obj.childNodes){
		dojo.forEach(obj.childNodes,function(item){
			dojo.forEach(getRealChildrenRecursively(item),function(item2){
				res.push(item2);
			});
		});
	}
	return res;
}
function isNotHiddenSequence(seq){
	if(seq instanceof Sequence){
		if(seq.node.style.display == "none") return false;
		return true;
	}
	return true;
}
function generateCommonContent(obj){
//	var parentNode = dojo.create(obj.type);
    //所有的Component都使用Component作为标签名
    var parentNode = dojo.create(obj.declaredClass);
	dojo.create("name",{},parentNode,null).innerHTML = obj.name;
    if(obj instanceof Component)
        dojo.create("type",{},parentNode,null).innerHTML = obj.type;
	dojo.create("description",{},parentNode,null).innerHTML = obj.description;
	if(obj.sdate){
		dojo.create("startDate",{},parentNode,null).innerHTML = obj.sdate;
		dojo.create("endDate",{},parentNode,null).innerHTML = obj.edate;
	}	
	return parentNode;
}
function generateChildrenNode(node,parent){
	var children = dojo.create("children",{},node,null);
	dojo.forEach(getRealChildren(parent),function(child){
		dojo.place(generateDomTree(child),children,null);
	});
}
function getProperties(queryObj,context){
	var xhrArgs = {
	    url: "jsp/getProperties.jsp?"+dojo.objectToQuery(queryObj),
	    handleAs: "text",
	    load: function(data){
		  //将结果存入上下文的props属性中
		  if(queryObj.method=="get")
	      	context.props = data.split(",");
	    },
	    error: function(error){
	      alert("Fetch ProcessDefinition Id failed!");
	    }
	  };
	  // Call the asynchronous xhrGet
	return dojo.xhrGet(xhrArgs);
}

function generateDomTree(parent){
	//生成共同的内容，包括name、description、startDate、endDate
	var node = generateCommonContent(parent);
	if (parent instanceof Sequence.Process) {
        //findParent(metadata_store._arrayOfAllItems);
		//流程变量
		var pvs = dojo.create("processVariables",{},node,null);
		dojo.forEach(process.pvs,function(item){
			var pv = dojo.create("ProcessVariable",{},pvs,null);
			dojo.create("name",{},pv,null).innerHTML = item.variablpyName;
			dojo.create("type",{},pv,null).innerHTML = item.variableType;
		});
		//角色
		var roles = dojo.create("roles",{},node,null);
		dojo.forEach(process.roles,function(item){
			var role = dojo.create("Role",{},roles,null);
			dojo.create("name",{},role,null).innerHTML = item.rolpyName;
			dojo.create("actualWorker",{},role,null).innerHTML = item.actualUsers;
		});
		//表达式
		var expressions = dojo.create("expressions",{},node);
		dojo.forEach(process.exps,function(exp){
			var expression = dojo.create("expression",{},expressions);
			dojo.create("name",{innerHTML:exp.expName},expression);
			dojo.create("LeftOperandType",{innerHTML:exp.left_type},expression);
			dojo.create("LeftOperand",{innerHTML:exp.left},expression);
			dojo.create("Operator",{},expression).innerText = exp.operator;
			dojo.create("RightOperandType",{innerHTML:exp.right_type},expression);
			dojo.create("RightOperand",{innerHTML:exp.right},expression);
		});
		generateChildrenNode(node,parent);
	}
	else 
		if (parent instanceof Component) {
			var role = dojo.create("bindingRole",{},node,null);
			if(parent.role){//如果关联了角色，才生成name和endpoint子节点
				dojo.create("name",{},role,null).innerHTML = parent.role.rolpyName;
				dojo.create("endpoint",{},role,null).innerHTML = parent.role.actualUsers;
			}			
			var mappings = dojo.create("dataMapping",{},node,null);
			dojo.forEach(parent.dms,function(item){
				var mapping = dojo.create("Mapping",{},mappings,null);
				dojo.create("VariablpyName",{innerHTML:item.variablpyName},mapping,null);
				dojo.create("VariableDirection",{innerHTML:item.variableDirection},mapping,null);
				dojo.create("AssociatedFile",{innerHTML:item.variableFile},mapping,null);
				dojo.create("bindingField",{innerHTML:item.variableMapping},mapping,null);
			});
            var metadataClass = dojo.create("metadataClass",{},node,null);

			//这仅仅只是测试属性
			dojo.forEach(parent.property,function(item){
				dojo.create(item.name,{},node,null).innerHTML = item.data;
			});
			//这仅仅只是测试属性

			var subProcess = parent.subProcess;

			if(subProcess!=null){
				generateChildrenNode(node,subProcess);
			}
//            dojo.create("metadata",{innerHTML:"<label>CAD元数据;尺寸</label>"},metadataClass,null)
            /*if(parent.mdArray){
                dojo.forEach(parent.mdArray,function(mdUrl){
                    var name = getMDName(mdUrl);
                    metadata_store.fetchItemByIdentity({identity:name,onItem:function(item){
                        var data = dojo.create("metadata",null,metadataClass,null);
                        dojo.create("name",{innerHTML:mdUrl},data,null);
                    }})
                })
            }
            if(parent.userMDArray){
                dojo.forEach(parent.userMDArray,function(mdUrl){
                    var name = getMDName(mdUrl);
                    metadata_store.fetchItemByIdentity({identity:name,onItem:function(item){
                        var data = dojo.create("customMetadata",null,metadataClass,null);
                        dojo.create("name",{innerHTML:mdUrl},data,null);
                    }})
                })
            }*/
		}
		/*else
			if (parent instanceof Parallel) {
				dojo.create("isCooperative",{innerHTML:parent.state.isCooperative},node,null);
				var cpvs = dojo.create("cooperVariables",{},node,null);
				if(parent.state.isCooperative) {
					dojo.forEach(parent.cpvs,function(item){
						var cpv = dojo.create("cooperVariable",{},cpvs,null);
						dojo.create("variablpyName",{innerHTML:item.variablpyName},cpv,null);
						dojo.create("cooperType",{innerHTML:item.cooperType},cpv,null);
						dojo.create("sourceTask",{innerHTML:item.sourceTask},cpv,null);
						dojo.create("targetTask",{innerHTML:item.targetTask},cpv,null);
					});
				}
				generateChildrenNode(node,parent);
			}
			else
				if (parent instanceof IfElse) {
					dojo.create("UseElseBranch",{innerHTML:parent.state.useElse},node,null);
					generateCondition(parent,node);
					generateChildrenNode(node,parent);
				}
				else 
					if (parent instanceof ForEach) {
                        if(parent instanceof Approval&&parent.role){
                            var role = dojo.create("bindingRole",{},node,null);
                            //如果关联了角色，才生成name和endpoint子节点
                            dojo.create("name",{},role,null).innerHTML = parent.role.rolpyName;
                            dojo.create("endpoint",{},role,null).innerHTML = parent.role.actualUsers;
                        }
						generateCondition(parent,node);
						generateChildrenNode(node,parent);
					}
					else 
						if(parent instanceof Sequence){
							generateChildrenNode(node,parent);
						} */
	return node;
}
function generateCondition(parent,node){
	var condition = dojo.create("Condition",{},node,null);
	if(!parent.condition) return;
	dojo.create("Name",{innerHTML:parent.condition.name},condition,null);
	dojo.create("Content",{innerHTML:parent.condition.content},condition,null);
	dojo.create("LeftOperandType",{innerHTML:parent.condition.left_type},condition,null);
	dojo.create("LeftOperand",{innerHTML:parent.condition.left},condition,null);
	dojo.create("Operator",{},condition,null).innerText = parent.condition.operator;
	dojo.create("RightOperandType",{innerHTML:parent.condition.right_type},condition,null);
	dojo.create("RightOperand",{innerHTML:parent.condition.right},condition,null);
}
function reconnectSource(type,node){
	//将BeforeXslt对象绑定到该函数上，以免每次调用此函数时都要实例化它
	if(!this.before)
		this.before = new BeforeXslt();
	//调用对应的预处理方法
//	var defer = this.before[type](node);
//	return defer.then(dojo.hitch(null,saveTempFileAjax,this.before.node,type));
	this.before[type](node);
	return saveTempFileAjax(this.before.node,type);
}
function addTracingTags(srcNode,fromId){
	if(fromId!=undefined) this.id = fromId;
	var result = dojo.query("children",srcNode);
	if(result.length>0){
		var children = result[0];
		dojo.forEach(children.childNodes,function(child){
			this.id++;
//            fromId++;
			dojo.create("tracingTag",{},child).innerText = this.id;
//            dojo.create("tracingTag",{},child).innerText = fromId;
            //对于审签循环来说，要预留一个tracingTag的位置给审签活动
            if(child.tagName == "Approval")
//                fromId++;
                this.id++;
			if(dojo.query("children",child).length>0)
//				addTracingTags(child,fromId);
                addTracingTags(child);
		});
	}	
	if(srcNode.tagName=="Sequence.Process"){
		dojo.create("activitySequence",{},srcNode).innerText = this.id;
//        dojo.create("activitySequence",{},srcNode).innerText = fromId;
	}
}
function addDuration(srcNode){
	dojo.create("duration",{},srcNode).innerText = getDuration(process) ;
    var comps = getAllChildTask(process);
    dojo.forEach(comps,function(comp){//根据name节点的值来查找
        var theNode = dojo.filter(dojo.query("name",srcNode),function(item){
            if(item.innerText==comp) return true;
        })[0].parentNode;
        dojo.create("duration",{},theNode).innerText = getDuration(reg.getComponentByName(comp));
    });
}
function addParentActivity(srcNode){
	if(srcNode.tagName=="Process"){
		//得到流程中所有的节点
		var children = getRealChildrenRecursively(srcNode);
		dojo.forEach(children,function(child){
			var parent = child.parentNode.parentNode;
			var nameNode = dojo.query("name",parent)[0];
			var declareClass = "";
			if(nameNode){
				var node = reg.getComponentByName(nameNode.innerHTML);
				if(node) declareClass = node.declaredClass;
			} 
			//标签映射
			switch(declareClass){
				case "Sequence.Process":
					declareClass = "org.uengine.kernel.ProcessDefinition";
					break;
				case "Parallel":
					declareClass = "org.uengine.kernel.AllActivity";
					break;
				case "IfElse":
					declareClass = "org.uengine.kernel.SwitchActivity";
					break;
				case "ForEach":
					declareClass = "org.uengine.kernel.LoopActivity";
					break;
				case "Sequence":
				case "Sequence.Branch":
					declareClass = "org.uengine.kernel.SequenceActivity";
					break;
				default:
			}
			dojo.create("class",{innerHTML:declareClass},dojo.create("parentActivity",{},child));
		});
	}
}
function getDuration(obj,sdate,edate){
	if(obj){//如果未设置开始时间和结束时间，就返回默认值10
		if(!obj.sdate){
			if(obj instanceof Sequence.Process) return 10;
			if(obj instanceof Component) return 5;
		} 
		return dojo.date.difference(dojo.date.locale.parse(obj.sdate,_FormatOptions), dojo.date.locale.parse(obj.edate,_FormatOptions), "day");
	} 
	return dojo.date.difference(dojo.date.locale.parse(sdate,_FormatOptions), dojo.date.locale.parse(edate,_FormatOptions), "day");
}
function formatXML(xmlStr,radio){	
	var xhrArgs = {
	    url: "jsp/saveResultProcessFile.jsp",
	    handleAs: "text",
		content: {
			content: xmlStr.replace("UTF-8", "GB2312")
		},
	    load: function(data){
			var str = data.substring(data.indexOf("<"));
			radio.set("value",str);
			dojo.byId("fileContent").innerText = str;
	    },
	    error: function(error){
	      alert("Write tempResultFile failed!");
	    }
	};
	//通过ajax调用，在服务器的xml文件夹下保存临时文件（以temp_resultfile为前缀，加一个随机数组成），
	//因为XSLTProcessorApplet只接受文件作为输入，不能接受字符串作为source。如果调用成功，返回临时文件的url
	return dojo.xhrPost(xhrArgs);
}
function createLink(from,to,parentNode){
    var node = dojo.create("edge",{},parentNode);
    dojo.create("from",{},node).innerHTML = from;
    dojo.create("to",{},node).innerHTML = to;
}
function addLinkForSequence(seq,parentNode){
    var children = dojo.query("children",seq)[0].childNodes;
    var from,to,i;
    //seq只有2种，要么是Sequence.Process，要么是Sequence.Branch.
    //不管是哪一种，在遍历它的children的时候，每个child只添加它前面的连线，
    //在seq结束的地方再补充一条连线，从最后一个child连接向FinalNode或JoinNode
    var isProcess = seq.tagName=="Sequence.Process";
    for(i=0;i<children.length;i++){
        var child = children[i];
        var childName = getChildName(child);
        //计算from
        if(i==0){
            if(isProcess) from = "InitialNode";
            else from = "Fork_" + getChildName(seq.parentNode.parentNode);
        }else{
            var preChild = children[i-1];
            if(preChild.tagName == "Component"){
                from = getChildName(preChild);
            }else{
                from = "Join_" + getChildName(preChild);
            }
        }
        //计算to
        if(child.tagName=="Parallel"){
            //Fork和Join的命名规则为“Fork_”或“Join_”加上Parallel的名字
            to = "Fork_" + childName;
        }else if(child.tagName=="Component"){
            to = childName;
        }else{
            throw new Error("不可预料的标签:"+child.tagName);
        }
        createLink(from,to,parentNode);
        if(child.tagName == "Parallel") addLinkForParallel(child,parentNode);
    }
    if(i==0){
        if(isProcess) from = "InitialNode";
        else from = "Fork_" + getChildName(seq.parentNode.parentNode);
    }else{
        if(children[i-1].tagName == "Component")
            from = getChildName(children[i-1]);
        else
            from = "Join_" + getChildName(children[i-1]);
    }
    if(isProcess){
        to = "FinalNode";
    }else{
        to = "Join_" + getChildName(seq.parentNode.parentNode);
    }
    createLink(from,to,parentNode);
}
function addLinkForParallel(parallel,parentNode){
    var children = dojo.query("children",parallel)[0].childNodes;
    for(var i=0;i<children.length;i++){
        var child = children[i];
        addLinkForSequence(child,parentNode);
    }
}
function getChildName(child){
    return  dojo.query("name",child)[0].innerHTML;
}