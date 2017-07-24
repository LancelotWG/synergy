<!doctype html>
<html>
<head>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<head>
<meta charset="utf-8">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/js/lib/dojo/dojo/resources/dojo.css"
	type="text/css" />
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/js/lib/dojo/dijit/themes/tundra/tundra.css"
	type="text/css" />
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/lib/dojo/dojo/dojo.js"
	djConfig="isDebug:true,parseOnLoad:true">
	
</script>
<script type="text/javascript">
	dojo.require("dojo.parser");
	dojo.require("dojo.data.ItemFileReadStore");
	dojo.require("dijit.form.Form");
	dojo.require("dijit.form.Button");
	dojo.require("dijit.form.ValidationTextBox");
	dojo.require("dijit.Dialog");
	dojo.addOnLoad(function() {
	});
</script>
<title>Workflow</title>
</head>

<body class="tundra" style="text-align: center;">
	<div id="page_content">
		<div class="container">
			<img id="myLogo" border="0" alt="Workflow" name="myLogo" height="100"
				src="<%=request.getContextPath()%>/resource/image/logo.png"
				style="margin-top: 80px;">
			<h1>
				欢迎使用
				<bdo lang="en" dir="ltr">Workflow</bdo>
			</h1>
			<br>
			<s:fielderror></s:fielderror>
			<form data-dojo-type="dijit.form.Form" autocomplete="off" name="login_form"
				action="user_logon.xhtml" namespace="/user" method="post"
				style="display: block;" id="login_form">
				<fieldset
					style="border: 1px solid lightslategrey; height: 100px; width: 300px; margin-right: auto; margin-left: auto;">
					<legend style="text-align: left;"> 登录 </legend>
					<div class="item" style="margin: 12px;">
						<label for="input_username">用户名：</label> <input
							data-dojo-type="dijit.form.ValidationTextBox" id="user.name"
							type="text" size="24" name="user.name" required=true
							invalidMessage="Required." promptMessage="用户名不能为空！">
					</div>
					<div class="item" style="margin: 12px;">
						<label for="input_password">密码：</label> <input
							data-dojo-type="dijit.form.ValidationTextBox" id="user.password"
							type="password" size="24" name="user.password" required=true
							invalidMessage="Required." promptMessage="请输入密码！">
					</div>
				</fieldset>
				<fieldset
					style="border: 1px solid lightslategrey; height: 40px; width: 300px; margin-right: auto; margin-left: auto; margin-top: 5px;">
					<button data-dojo-type="dijit.form.Button" style="margin: 8px;"
						id="input_register" value="">
						注册
					</button>
					<button data-dojo-type="dijit.form.Button" style="margin: 8px;"
						id="input_go" type="submit" value="">
						登录
						<script type="dojo/method" event="onClick" args="evt">
                                var name = dijit.byId("user.name");
                                var password = dijit.byId("user.password");
                                if(name.value==""|| password.value==""){
                                    var d = new dijit.Dialog({ title: "错误", content: "请输入有效的用户名及密码！" });
                                    dojo.style(d.domNode,"text-align","left");
                                    dojo.style(d.domNode,"height","70px");
                                    dojo.style(d.domNode,"width","178px");
                                    d.hide();
                                    d.show();
                                    return false;
                                }
                                return true;
                        </script>
					</button>
				</fieldset>
			</form>
		</div>
	</div>

</body>
</html>
