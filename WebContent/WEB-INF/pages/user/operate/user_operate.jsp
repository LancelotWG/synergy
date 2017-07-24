<!doctype html>
<html>
    <head>
        <%@page import="com.nwpu.lwg.model.user.User"%>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="cache-control" content="no-cache,must-revalidate">
        <%@ page language="java" contentType="text/html; charset=UTF-8"
        pageEncoding="UTF-8"%>
        <%@ taglib prefix="s" uri="/struts-tags"%>
        <meta charset="UTF-8">
        <link rel="stylesheet"
            href="<%=request.getContextPath()%>/js/lib/dojo/dojo/resources/dojo.css"
            type="text/css" />
        <link id="themeStyles" rel="stylesheet" title="tundra"
            href="<%=request.getContextPath()%>/js/lib/dojo/dijit/themes/tundra/tundra.css"
            type="text/css" />
        <link id="themeStyles" rel="alternate stylesheet" title="nihilo"
            href="<%=request.getContextPath()%>/js/lib/dojo/dijit/themes/nihilo/nihilo.css"
            type="text/css" />
        <link id="themeStyles" rel="alternate stylesheet" title="soria"
            href="<%=request.getContextPath()%>/js/lib/dojo/dijit/themes/soria/soria.css"
            type="text/css" />
        <link id="themeStyles" rel="alternate stylesheet" title="claro"
            href="<%=request.getContextPath()%>/js/lib/dojo/dijit/themes/claro/claro.css"
            type="text/css" />
        <script type="text/javascript"
                src="<%=request.getContextPath()%>/js/lib/dojo/dojo/dojo.js"
                djConfig="isDebug:true,parseOnLoad:true">
        </script>
        <title>流程设计器</title>
        <style type="text/css">
            @import "<%=request.getContextPath()%>/js/lib/dojo/dijit/tests/css/dijitTests.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/grid/resources/Grid.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/grid/resources/tundraGrid.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/grid/resources/nihiloGrid.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/grid/resources/soriaGrid.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/grid/resources/claroGrid.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/form/resources/FileInput.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojo/resources/dnd.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojo/tests/dnd/dndDefault.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/layout/resources/ScrollPane.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/layout/resources/ExpandoPane.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/layout/resources/ToggleSplitter.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/widget/Dialog/Dialog.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/layout/resources/GridContainer.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/layout/resources/ResizeHandle.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/widget/Toaster/Toaster.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/form/resources/TriStateCheckBox.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/grid/enhanced/resources/claroEnhancedGrid.css";
            @import "<%=request.getContextPath()%>/js/lib/dojo/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css";
        </style>
        <!--使用@import引入gantt.css会导致在兼容性视图中无法正常显示甘特图-->
        <link rel="stylesheet" href="<%=request.getContextPath()%>/CSS/gantt.css">
        <link rel="stylesheet" href="<%=request.getContextPath()%>/CSS/processdesigner.css">
        <link rel="stylesheet" href="<%=request.getContextPath()%>/js/lib/FineUploader/fineuploader.css" >

        <!--外部依赖包-->
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/yui/yahoo-dom-event/yahoo-dom-event.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/yui/yahoo/yahoo-min.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/rico/src/prototype.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/rico/src/rico.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/FineUploader/fineuploader-3.0.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/dojoRequires.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/ace/src/ace.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/ace/src/ext-language_tools.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/ace/src/ext-old_ie.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/lib/ace/src/theme-monokai.js"></script>
        <!--常量-->
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/Util/StringUtil.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/Util/NetMsgUtil.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/Util/ColorUtil.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/Util/ControlUtil.js"></script>
        <!--模型-->
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/Model.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/ItemFileWriteStore.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/NamedNode.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/Start/Start.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/OS/OS.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/Bus/Bus.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/Component/Component.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/ContainerNode/ContainerNode.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/ContainerNode/Sequence/Sequence.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/NamedNode/ContainerNode/Sequence/Process/Sequence.Process.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/UnNamedNode/UnNamedNode.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/UnNamedNode/ControlFlow/ControlFlow.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/UnNamedNode/BusConnect/BusConnect.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/UnNamedNode/Placeholder/Placeholder.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Model/Model/UnNamedNode/Feedback/Feedback.js"></script>
        <!--视图工具-->
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/RadioGroup.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/MenuManager.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/Tooltip.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/InplaceEditor.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/Source.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/Moveable.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/Dialog.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/Grid.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/CommonGrid.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/Tree.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/Tree.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/ProcessTree.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/TimeConfigureGrid.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/MainFrame.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/View/BusLink.js"></script>
        <!--控制-->
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/CodeGeneration.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/Actions.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/helper.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/_HeaderBuilder.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/PropertyChangeSupport.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/GlobalRegistry.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/BeforeXslt.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/rico_custom_dnd.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/ui/expression.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/ui/saveFile.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/ui/openProcessFile.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/ui/uploadProcessFile.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/ui/metadata.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/NetController.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/NetMsg.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/MVC/Control/UserDataController.js"></script>

        <script type="text/javascript">
            //服务器实际地址
            var contextPath = "<%=request.getContextPath()%>";
            //全局组件
            var process, processTree, timeConfigureGrid;
            //拖拽组件
            var CustomDraggable, CustomDropzone, dndManager;
            //用户名
            var userName = "<%=((User)session.getAttribute("user")).getName()%>";
            console.log(userName);
            //用户
            var user = new UserDataController(userName);
            //创建主框架
            var mainFrame = new MainFrame();
            //全局注册表
            var reg = new js.GlobalRegistry();
            //菜单管理
            var menuManager = null;
            //其他控制变量
            var keyArgs = [];
            var ignoreKeyEvent;
            //流程布局方式，true为水平
            var Hlayout = true;
            /*//流程编辑菜单控制，false是为组件编辑，true时为全局编辑
            var editorMenuType = true;*/
            //流程窗口布局控制器
            var YD = YAHOO.util.Dom;
            //用户组网络通信控制器
            var netController = new NetController();
            netController.onConnect();
            //共享用户组(名称不变意义更新为工程组。)
            var shareUserGroup;
            //shareUserGroup = window.prompt("输入发送对象:");
            //文件保存标记
            var isDirty = false;
            //调试标识符
            var isDebug = true;
            //流程保护，禁止删除
            var canDelete = true;
            //treeTooltip显示控制参数
            var singleTreeTooltip = true;
            //配置时间刷新间隔
            var timeConfigureGridFreshen = false;
            //正在配置的组件
            var configuringComponent = null;
            //drop类别显示标识，0：普通组件 1：传输控制 2：总线交联 3：OS组件
            var dropType = 0;
            //正在移动的组件
            var draggingComponent = null;
            //总线
            var bus = null;
            //OS组件
            var os = null;
            //默认主面板组件
            var configObj = null;
            var isAllComponentConfigured = false;
            //工程文件名
            var projectName = "process";
            //工程的创建着
            var projectCreator = "";
            //代码编辑器
            var codeEditor = null;
            //主界面点击handle
            var mainHandle = null;
            //树点击handle
            var treeHandle = null;
            //选中元素
            var editorElement = null;
            dojo.addOnLoad(function(){
                Rico.onLoad(function (){
                    CustomDraggable = Class.create();//拖动源
                    CustomDropzone = Class.create();//放置地
                    CustomDraggable.prototype = Object.extend(new Rico.Draggable(), CustomDraggableMethods);//CustomDraggableMethods在rico_custom_dnd.js中
                    CustomDropzone.prototype = Object.extend(new Rico.Dropzone(), CustomDropMethods);//CustomDropMethods在rico_custom_dnd.js中
                    dndManager = Object.extend(dndMgr, CustomMethods);//dndMgr在lib/rico/src/ricoDragDrop.js中定义，//CustomMethods在rico_custom_dnd.js中//dndManager是管理可拖拽式资源的集合
                    //修正组件的位置，使鼠标处于组件的中心
                    dojo.aspect.after(dndManager, "_updateDraggableLocation", function (e) {
                        YD.setXY(this.dragElement, [e.pageX - this.dragElement.offsetWidth / 2, e.pageY - this.dragElement.offsetHeight / 2])
                    }, true);
                    dndManager.moveStyle = "move";
                    //加载组件资源
                    //生成主框架
                    mainFrame.initial();
                    //加载用户数据***此为测试代码****
                    //生成主框架
                    //mainFrame.onCreate();
                    //user.loadProcess();

                    //请求数据同步
                    //user.requestData();
                });
            });
        </script>
    </head>

    <body class="tundra nihilo soria claro">
        <div id="main" dojoType="dijit.layout.BorderContainer" design="headline" persist="true" liveSplitters="false">
            <script type="dojo/method">
                this._splitterClass = "dojox.layout.ToggleSplitter";
                /*var freshenProcess = function(e) {
                    process.validate();
                };
                dojo.connect(this._splitterClass, "open", freshenProcess);
                dojo.connect(this._splitterClass, "collapsed", freshenProcess);
                dojo.connect(this._splitterClass, "_togglenodemousemove", freshenProcess);*/
            </script>
            <div id="header" class="box" dojoType="dijit.layout.ContentPane" region="top" splitter="true" maxSize=90 minSize=90>
                <div id="logo" style="margin-top: 10px; margin-bottom: auto;">
                    <img alt="logo" src="<%=request.getContextPath()%>/resource/image/icons/logo.png" onclick="window.location=home;"/>
                </div>
                <div id="footer_tip" style="margin-right: 10px;margin-top: 5px;display: none;" align="right">
                     <img src="<%=request.getContextPath()%>/resource/image/icons/loggingUser.gif" alt="创建人">&nbsp;:&nbsp;<label id="loggingUser"><s:property value="#session.user.name"/></label>&nbsp;<s:a action="user_logout" namespace="/user">退出</s:a>
                     <img src="<%=request.getContextPath()%>/resource/image/icons/Clock.png" alt="当前时间">&nbsp;:&nbsp;<label id="currentTime"></label>
                </div>
                <div class="box" style="height:45px;margin-right:10px;margin-top:8px" align="right">
                    <div class="outerbar">
                        <img id="Theme" alt="更换主题" dojoType="dojox.widget.FisheyeLite" style="width:32px; height:32px"
                            properties="{ width:1.5, height:1.5 }" src="<%=request.getContextPath()%>/resource/image/icons/Theme.png" onClick="openThemeDialog"/>
                        <img id="Delete" alt="删除" dojoType="dojox.widget.FisheyeLite" style="width:32px; height:32px;margin-right: 5px;"
                            properties="{ width:1.5, height:1.5 }" src="<%=request.getContextPath()%>/resource/image/icons/Delete.png" onClick="user.deleteProject()"/>
                        <img id="Save" alt="保存" dojoType="dojox.widget.FisheyeLite" style="width:32px; height:32px;margin-right: 5px;"
                            properties="{ width:1.5, height:1.5 }" src="<%=request.getContextPath()%>/resource/image/icons/Save.png" onClick="user.saveProject()"/>
                        <img id="Open" alt="打开" dojoType="dojox.widget.FisheyeLite" style="width:32px; height:32px;margin-right: 5px;"
                            properties="{ width:1.5, height:1.5 }" src="<%=request.getContextPath()%>/resource/image/icons/Open.png" onClick="user.openProject()"/>
                        <img id="New" alt="新建" dojoType="dojox.widget.FisheyeLite" style="width:32px; height:32px;margin-right: 5px;"
                            properties="{ width:1.5, height:1.5 }" src="<%=request.getContextPath()%>/resource/image/icons/New.png" onClick="user.newProject()"/>
                    </div>
                </div>
            </div>
            <div id="timeconfigure" class="box" dojoType="dijit.layout.BorderContainer" region="bottom" splitter="true" align="center" maxSize=350 minSize=100>
            <!--<div style="width: 50% ;height: 100%;float: left" >
            <div id="timeconfigure_grid" ></div>
            </div>
            <div id="timeconfigure_map"  style="width: 48%;height: 100%;float: right" >
            这里是预留空间！
            </div>-->
            <!--<div dojoType="dijit.layout.BorderContainer" design="sidebar"
            style="height: 100%;width: 100%;">-->
                <div id="grid_area" dojoType="dijit.layout.ContentPane" region="center">
                    <div id="timeconfigure_grid" ></div>
                </div>
                <div dojoType="dijit.layout.BorderContainer"  region="right" style="width: 1115px;">
                    <div dojoType="dijit.layout.BorderContainer"  region="top" style="height: 194px;">
                        <div dojoType="dijit.layout.ContentPane"  region="left" style="width: 248px;">
                            <span>工程内人员</span></br>
                            <select id="projectPersonnelList"></select>
                            <button id="removeProjectPersonnelButton" style="float:right;margin-top:70px; margin-right:5px;" data-dojo-type="dijit.form.Button" intermediateChanges="false" label="移除" iconClass="dijitNoIcon" onClick=''></button>
                        </div>
                        <div dojoType="dijit.layout.BorderContainer"  region="center"  >
                            <div dojoType="dijit.layout.ContentPane"  region="left" style="width: 248px;">
                                <span>构件主管</span></br>
                                <select id="competentMemberList"></select>
                                <button id="removeCompetentMemberButton" style="float:right;margin-top:70px; margin-right:5px;" data-dojo-type="dijit.form.Button" intermediateChanges="false" label="移除" iconClass="dijitNoIcon" onClick=''></button>
                            </div>
                            <div dojoType="dijit.layout.ContentPane"  region="center">
                                <span>软件设计人员</span></br>
                                <select id="softwareDesignerList"></select>
                                <button id="removeSoftwareDesignerButton" style="float:right;margin-top:70px; margin-right:5px;" data-dojo-type="dijit.form.Button" intermediateChanges="false" label="移除" iconClass="dijitNoIcon" onClick=''></button>
                            </div>
                        </div>
                        <div dojoType="dijit.layout.ContentPane"  region="right" style="width: 308px;">
                            <span>用户列表</span></br>
                            <select id="userList"></select>
                            <select id="userRoleLevel" style='width:100px;float:left;margin-top:40px;' dojoType="dijit.form.FilteringSelect" autoComplete="true" >
                                <option value="0">构建主管</option>
                                <option value="1">软件设计人员</option>
                            </select>
                            <select id="competentMemberType" style='width:100px;float:left;margin-top:10px;' dojoType="dijit.form.FilteringSelect" autoComplete="true" >
                                <option value="RM">余度</option>
                                <option value="IO">IO</option>
                                <option value="CL">控制律</option>
                            </select>
                            <button id="addPersonnelButton" style="float:right;margin-top:10px; margin-right: 40px" data-dojo-type="dijit.form.Button" intermediateChanges="false" label="添加" iconClass="dijitNoIcon"'></button>
                        </div>
                    </div>
                    <div dojoType="dijit.layout.ContentPane"  region="left" style="width: 30%;" splitter="true" >
                        <span>当前用户角色</span></br>
                        <div style="width: 100%; height:85%; float:left;" id="currentRoleMark"></div>
                    </div>
                    <div dojoType="dijit.layout.ContentPane"  region="center" style="height: 80%;" splitter="true" >
                            工程人员对话框
                     </div>
                </div>
            <!--</div>-->
            <!--<div id="progress_footer" data-dojo-type="dijit.ProgressBar" data-dojo-props='style:"float:right;width:70px;display:none;margin-right:220px",indeterminate:"true",label:"处理中..."'></div>-->
            </div>
            <div id="maincontent" class="box" dojoType="dijit.layout.ContentPane" region="center" align="left">
                <!--更换布局-->
                <!--<button dojoType="dijit.form.DropDownButton">
                    <span>布局方式</span>
                    <div dojoType="dijit.Menu">
                        <div dojoType="dijit.MenuItem" label="水平布局">
                            <script type="dojo/method" event="onClick" args="evt">
                                    Hlayout = true;
                                    process.validate();
                            </script>
                        </div>
                        <div dojoType="dijit.MenuItem" label="垂直布局">
                            <script type="dojo/method" event="onClick" args="evt">
                                    Hlayout = false;
                                    process.validate();
                            </script>
                        </div>
                    </div>
                </button>-->
                <!--属性对话框-->
                <div >
                    <span id = "location" >

                    </span>
                </div>
                <div id = "lockedFlag" style="display:none;width: 100%;height: 16px;">
                    <div style="float:left;margin-right: 3px;">
                        <img alt="logo" src="<%=request.getContextPath()%>/resource/image/icons/lock.png" style="height:16px;width: 13px"/>
                    </div>
                    <div style="float:left;margin-top: 1px;">
                        <span id = "keyHolder" >

                        </span>
                    </div>
                </div>
                <div id="propsDialog" dojoType="js.Dialog" style="padding-left: 0px;" showTitle="true" draggable="true"
                     easing="dojo.fx.easing.backOut" sizeDuration="400" dimensions="[520,380]" modal="true">
                </div>
                <!--保存文件配置对话框-->
                <div id="saveDlg" data-dojo-type="dijit.Dialog"
                     data-dojo-props='title:"保存文件",href:"user_requestHTML.xhtml?href=saveDialog",refreshOnShow:true'>
                    <!--<script type="dojo/connect" event="onCancel">
                                deleteTempFiles(tempProcessFileUrl);
                    </script>-->
                </div>

                <span data-dojo-type="js.Dialog" id="dataConfigureUploadDlg" title="数据配置(2)" href="user_requestHTML.xhtml?href=dataConfigureUpload"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="400"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 260px; height: 120px; width: 260px;">
                </span>

                <span data-dojo-type="js.Dialog" id="dataConfigureDlg" title="数据配置(1)" href="user_requestHTML.xhtml?href=dataConfigure"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 380px; height: 150px; width: 350px;">
                </span>

                <span data-dojo-type="js.Dialog" id="newProjectDlg" title="新建工程" href="user_requestHTML.xhtml?href=newProject"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 230px; height: 110px; width: 230px;">
                 </span>

                <span data-dojo-type="js.Dialog" id="codeEditorDlg" title="编辑模块代码" href="user_requestHTML.xhtml?href=codeEditor"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 870px; height: 600px; width: 870px;">
                </span>

                <span data-dojo-type="js.Dialog" id="busDataEditorDlg" title="编辑总线" href="user_requestHTML.xhtml?href=busDataEditor"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 340px; height: 320px; width: 340px;">
                </span>

                <span data-dojo-type="js.Dialog" id="codeGenerationDlg" title="代码生成" href="user_requestHTML.xhtml?href=codeGeneration"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 170px; height: 100px; width: 170px;">
                </span>

                <span data-dojo-type="js.Dialog" id="componentDataDefinitionDlg" title="定义模块数据" href="user_requestHTML.xhtml?href=componentDataDefinition"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 340px; height: 320px; width: 340px;">
                </span>

                <span data-dojo-type="js.Dialog" id="busConnectDlg" title="总线交联" href="user_requestHTML.xhtml?href=busConnect"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 420px; height: 340px; width: 420px;">
                </span>

                <span data-dojo-type="js.Dialog" id="OSConfigureDlg" title="OS配置" href="user_requestHTML.xhtml?href=OSConfigure"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 280px; height: 230px; width: 280px;">
                </span>

                <span data-dojo-type="js.Dialog" id="componentConfigureDlg" title="组件配置" href="user_requestHTML.xhtml?href=componentConfigure"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 280px; height: 230px; width: 280px;">
                </span>

                <span data-dojo-type="js.Dialog" id="OSTimeConfigureDlg" title="操作系统时间片配置" href="user_requestHTML.xhtml?href=OSTimeConfigure"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 380px; height: 260px; width: 380px;">
                </span>

                <span data-dojo-type="js.Dialog" id="busConfigureDlg" title="总线配置" href="user_requestHTML.xhtml?href=busConfigure"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" closable="false" style="min-width: 780px; height: 450px; width: 780px;">
                </span>

                <span data-dojo-type="js.Dialog" id="openProjectDlg" title="打开文件" href="user_requestHTML.xhtml?href=openProject"
                    extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                    autofocus="autofocus" draggable="true" style="min-width: 280px; height: 240px; width: 280px">
                </span>

                <span data-dojo-type="js.Dialog" id="openFileDlg" title="打开文件" href="user_requestHTML.xhtml?href=openFile"
                      extractContent="false" preventCache="true" preload="false" refreshOnShow="true" duration="200"
                      autofocus="autofocus" draggable="true" style="min-width: 200px; height: 150px; width: 325px;">
                </span>

                <span data-dojo-type="dijit.Dialog" id="progressDlg" title="正在打开"
                      href="user_requestHTML.xhtml?href=showProgress" extractContent="false"
                      preventCache="false" preload="false" refreshOnShow="false" duration="200" autofocus="autofocus"
                      draggable="true" style="height: 100px; width: 200px;">
                </span>

                <div id="setComponentPropertyDlg" data-dojo-type="dijit.Dialog"
                    data-dojo-props='title:"数据配置",href:"user_requestHTML.xhtml?href=setComponentPropertyDialog"'>
                </div>
                <div id="themeDlg" data-dojo-type="dijit.Dialog"
                     data-dojo-props='title:"更换主题",href:"user_requestHTML.xhtml?href=changeThemeDialog"'>
                </div>
                <div id="ganttDlg" data-dojo-type="js.Dialog" showTitle="true" title="甘特图" easing="dojo.fx.easing.backOut"
                     sizeDuration="1400" sizeToViewport="true" modal="true">
                    <div class="ganttContent">
                        <div id="ganttChart"></div>
                    </div>
                </div>
                <div id="configDlg" data-dojo-type="js.Dialog" showTitle="true" title="程序设置" easing="dojo.fx.easing.backOut"
                     sizeDuration="1400" sizeToViewport="true" modal="true">

                </div>
                <div id="addMetaDataDlg" data-dojo-type="dijit.Dialog"
                     data-dojo-props="title:'添加元数据',draggable:false,href:'user_requestHTML.xhtml?href=addMetadata'">7
                </div>
                <span data-dojo-type="js.DialogWithoutClose" id="uploadDlg" title="上传文件"
                       href="user/user_requestHTML.xhtml?href=uploadProcessFile" extractContent="false"
                       preventCache="true" preload="false" refreshOnShow="true" duration="200" autofocus="autofocus"
                       draggable="true" style="height: 110px; width: 240px;">
                    <script type="dojo/connect" event="onCancel">
                                dojo.xhrGet({
                                    url:"jsp/deleteTempProcessFile.jsp?delete="+tempProcessFileUrl,
                                    handleAs:"text",
                                    load: function(data){
                                    tempProcessFileUrl = null;
                                    },
                                    error: function(error){
                                    alert(error.description);
                                    }
                                });

                    </script>
                </span>
                <!--<div id="timecomfig" style="width: 100%; height: 20%; border: 1px solid black;"></div>-->
            </div>
            <!--<div id="timecomfig" class="box" dojoType="dijit.layout.ContentPane" region="center" align="left">

            </div>-->
            <div id="sidebar" class="box" dojoType="dijit.layout.ContentPane" title="Components Library" region="leading"
                 splitter="true" maxSize=250 minSize=150 style="width:200px;">
                <div data-dojo-type="dijit.layout.AccordionContainer" id="compContainer"></div>
            </div>
            <div id="outline" class="box " data-dojo-type="dijit.layout.ContentPane" data-dojo-props="doLayout:false"
            title="Outline" region="right" splitter="true" maxSize=250 minSize=100 align="left">
            <!--div id="outline_tree"></div-->
            </div>
        </div>
        <div dojoType="dojox.widget.Toaster"
             positionDirection="br-up" duration="0"
             messageTopic="uploadMessageTopic"></div>
    </body>
</html>