package com.nwpu.lwg.action.user;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.xml.sax.InputSource;

import com.nwpu.lwg.action.BaseAction;
import com.nwpu.lwg.model.project.Workflow;
import com.nwpu.lwg.model.role.Role;
import com.nwpu.lwg.model.user.User;
import com.nwpu.lwg.util.AppException;
import com.nwpu.lwg.util.action.FileOperation;
import com.nwpu.lwg.util.action.PathUtil;
import com.nwpu.lwg.util.action.transmission.DataTransmission;
import com.nwpu.lwg.util.action.transmission.MultipartUploadFileParser;
import com.nwpu.lwg.util.action.transmission.RequestUploadFileParser;
import com.nwpu.lwg.util.constant.ControlUtil;
import com.nwpu.lwg.util.constant.SeparatorUtil;
import com.opensymphony.xwork2.ModelDriven;

@Scope("prototype")
@Controller("userAction")
public class UserAction extends BaseAction implements ModelDriven<User> {
	private static final long serialVersionUID = 1L;
	private static final long timeout = 10000;
	// protected Map<String, Object> sessions;

	public String login() throws Exception {
		User loginUser = (User) session.get("user");
		if (loginUser == null) {
			return USER_LOGIN;
		} else {
			return USER_OPERATE;
		}
	}

	/**
	 * 用户注册
	 * 
	 * @return
	 * @throws Exception
	 */
	public String save() throws Exception {
		boolean unique = userDao.isUnique(user.getName());// 判断用户名是否可用
		if (unique) {// 如果用户名可用
			userDao.save(user);// 保存注册信息
			return USER_LOGIN;// 返回会员登录页面
		} else {
			throw new AppException("此用户名不可用");// 否则返回页面错误信息
		}
	}

	/**
	 * 用户登录
	 * 
	 * @return
	 * @throws Exception
	 */
	public String logon() throws Exception {
		// 增加用户
		/*
		 * User testUser = new User(); //testUser.setId(44);
		 * testUser.setName("lancelotwg"); testUser.setPassword("000000");
		 * userDao.save(testUser);
		 */

		User sessionLoginUser = (User) session.get("user");
		// 验证用户是否在同一浏览器中
		if (sessionLoginUser == null) {
			// 不同浏览器中
			User loginUser = userDao.login(user.getName(), user.getPassword());
			if (loginUser != null) {// 如果通过验证
				Map<String, Object> userSession = (Map<String, Object>) application.get(loginUser.getName());
				if (userSession != null) {
					User applicationLoginUser = (User) userSession.get("user");
					/* if (applicationLoginUser != null) { */
					// 该用户已登录
					/*
					 * User sessionUser = (User)
					 * sessions.get(applicationLoginUser.getName());
					 * if(sessionUser == null){ session.put("user", loginUser);
					 * return USER_OPERATE; }
					 */
					Object newHeatBeatTime = userSession.get("newHeatBeatTime");
					Object oldHeatBeatTime = userSession.get("oldHeatBeatTime");
					long heatBeatTime = (new Date()).getTime();
					if (newHeatBeatTime != null && oldHeatBeatTime != null) {
						if ((heatBeatTime - (long) newHeatBeatTime) >= timeout) {
							session.put("user", loginUser);
							session.put("newHeatBeatTime", (new Date()).getTime());
							session.put("oldHeatBeatTime", (new Date()).getTime());
							application.put(loginUser.getName(), session);//
							removeUserFromAll();
							return USER_OPERATE;
						}
					}
					addFieldError("", "该用户已登录,请确保用户名和密码未泄露！");// 返回错误信息
					return USER_LOGIN;// 返回会员登录页面
					/*
					 * } else { // 该用户未登录 session.put("user", loginUser);//
					 * 将登录会员信息保存在Session中 session.put("newHeatBeatTime", (new
					 * Date()).getTime()); application.put(loginUser.getName(),
					 * session);// return USER_OPERATE; }
					 */
				} else {
					session.put("user", loginUser);// 将登录会员信息保存在Session中
					session.put("newHeatBeatTime", (new Date()).getTime());
					session.put("oldHeatBeatTime", (new Date()).getTime());
					application.put(loginUser.getName(), session);//
					removeUserFromAll();
					return USER_OPERATE;
				}
			} else {// 验证失败
				addFieldError("", "用户名或密码不正确！");// 返回错误信息
				return USER_LOGIN;// 返回会员登录页面
			}
		} else {
			// 在同一浏览器中
			removeUserFromAll();
			return USER_OPERATE;
		}
	}
	
	//从所有在线工程中移除
	private void removeUserFromAll(){
		List<Workflow> workflows = workflowDao.find(null, null, null);
		User sessionUser = (User) session.get("user");
		for (Workflow workflow : workflows) {
			Set<User> projectUser = (Set<User>) application.get(workflow.getName());
			if(projectUser != null){
				for (User user : projectUser) {
					if(user.getName().equals(sessionUser.getName())){
						projectUser.remove(user);
						break;
					}
				}
			}
		}
	}

	/**
	 * 错误页面转发
	 * 
	 * @return String
	 * @throws Exception
	 */
	public String error() throws Exception {
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String type = httpRequest.getParameter("type");
		if (type.equals("user_exist")) {
			addFieldError("", "该浏览器已通过websokect连接到组，请勿连接到其他组！");// 返回错误信息
			return ERROR;
		} else if (type.equals("websocket_open_fail")) {// 暂时没有使用到。
			if (session != null && session.size() > 0) {
				User sessionUser = (User) session.get("user");
				if (sessionUser != null) {
					Map<String, Object> userSession = (Map<String, Object>) application.get(sessionUser.getName());
					if (userSession != null) {
						application.remove(sessionUser.getName());
					}
					session.clear();
				}
			}
			addFieldError("", "错误：Websocket连接服务器失败，请稍后再试。");// 返回错误信息
			return ERROR;
		}
		addFieldError("", "错误！");// 返回错误信息
		return ERROR;
	}

	/**
	 * 用户退出
	 * 
	 * @return String
	 * @throws Exception
	 */
	public String logout() throws Exception {
		if (session != null && session.size() > 0) {
			User sessionUser = (User) session.get("user");
			if (sessionUser != null) {
				Map<String, Object> userSession = (Map<String, Object>) application.get(sessionUser.getName());
				if (userSession != null) {
					application.remove(sessionUser.getName());
				}
				session.clear();
			}
		}
		return LOGOUT;
	}
	
	//从工程中移除不再编辑用户
	public void removeNotOnProjectPersonnel(){
		User sessionLoginUser = (User) session.get("user");
		String projectName = httpRequest.getParameter("projectName");
		Set<User> projectUsers = (Set<User>) application.get(projectName);
		for (User user : projectUsers) {
			if(user.getName().equals(sessionLoginUser.getName())){
				projectUsers.remove(user);
			}
		}
	}
	
	//超时检测
	private boolean checkTimeOut(long heatBeatTime){
		if((new Date()).getTime() - heatBeatTime >= timeout ){
			return false;
		}
		return true;
	}

	// 心跳
	public void heartBeat() throws Exception {
		User sessionLoginUser = (User) session.get("user");
		long oldHeatBeatTime = (long) session.get("newHeatBeatTime");
		if (sessionLoginUser != null) {
			session.put("oldHeatBeatTime", oldHeatBeatTime);
			session.put("newHeatBeatTime", (new Date()).getTime());
			System.out.println("##################" + sessionLoginUser.getName() + "####################");
			System.out.println("oldHeatBeatTime:");
			System.out.println(oldHeatBeatTime);
			System.out.println("newHeatBeatTime:");
			System.out.println((long) session.get("newHeatBeatTime"));
		}
		String data = "";
		List<User> tempUsers = (List<User>) application.get("users");
		if(tempUsers == null){
			tempUsers = userDao.find(null, null, null);
			application.put("users", tempUsers);
		}
		//获取所有用户
		for (User user : tempUsers) {
			String userName = user.getName();
			Map<String, Object> userSession = (Map<String, Object>) application.get(userName);
			if(userSession == null){
				data += (userName + SeparatorUtil.userName + "0" + SeparatorUtil.user);
			}else{
				if(checkTimeOut((long)userSession.get("newHeatBeatTime"))){
					data += (userName + SeparatorUtil.userName + "1" + SeparatorUtil.user);
				}else{
					data += (userName + SeparatorUtil.userName + "0" + SeparatorUtil.user);
				}
			}
		}
		data = data.substring(0, data.length() - 1);
		System.out.println(data);
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		out.print(data);
		out.flush();
		out.close();
	}

	// 检测当前用户目录下的工程文件更新数据库中的信息
	public boolean checkAndUpdateProject(String projectName, Workflow workflow) {
		String basePath = httpRequest.getRealPath("/");
		if (FileOperation.checkFileExist(basePath, projectName)) {
			if (workflow == null) {
				String data = FileOperation.loadFile(basePath, projectName);
				String[] val1 = String.valueOf(data).split("\\*");
				String userName = val1[0];
				User user = userDao.getByName(userName);
				workflow = new Workflow();
				workflow.setName(projectName);
				workflow.setBuild_person(user);
				workflow.setBuild_time(new java.sql.Date(new Date().getTime()));
				workflow.getUsers().add(user);
				user.getWorkflows().add(workflow);
				userDao.saveOrUpdate(user);
				workflowDao.save(workflow);
				Role role = roleDao.getRole(workflow.getId(), user.getId());
				role.setRole_a(1);
				role.setRole_b("null");
				role.setRole_c(0);
				roleDao.saveOrUpdate(role);
			} else {

			}
			return false;
		} else {
			if (workflow == null) {

			} else {
				workflowDao.delete(workflow.getId());
			}
			return true;
		}
	}

	// 新建工程
	public void createNewProject() {
		String projectName = httpRequest.getParameter("projectName");
		Workflow checkWorkflow = workflowDao.getByName(projectName);
		String data = "";
		User sessionUser = (User) session.get("user");
		User loginUser = userDao.login(sessionUser.getName(), sessionUser.getPassword());
		Set<User> projectUsers = (Set<User>) application.get(projectName);
		String userName = sessionUser.getName();
		User currentUser = userDao.getByName(userName);
		if(projectUsers == null){
			projectUsers = new HashSet<User>();
			projectUsers.add(currentUser);
			application.put(projectName, projectUsers);
		}else{
			boolean isAdd = true;
			for (User user : projectUsers) {
				String checkUsername = user.getName();
				if(checkUsername.equals(currentUser.getName())){
					isAdd = false;
				}
			}
			if(isAdd){
				projectUsers.add(currentUser);
			}
		}
		if (checkAndUpdateProject(projectName, checkWorkflow)) {
			Workflow workflow = new Workflow();
			workflow.setName(projectName);
			workflow.setBuild_person(loginUser);
			workflow.setBuild_time(new java.sql.Date(new Date().getTime()));
			workflow.getUsers().add(loginUser);
			loginUser.getWorkflows().add(workflow);
			userDao.saveOrUpdate(loginUser);
			workflowDao.save(workflow);
			Role role = roleDao.getRole(workflow.getId(), loginUser.getId());
			role.setRole_a(1);
			role.setRole_b("null");
			role.setRole_c(0);
			roleDao.saveOrUpdate(role);
			data += "success";
		} else {
			data += "error";
		}
		System.out.println(data);
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		out.print(data);
		out.flush();
		out.close();
	}

	// 删除工程
	public void deleteProject() {
		String basePath = httpRequest.getRealPath("/");
		String projectName = httpRequest.getParameter("projectName");
		Workflow workflow = workflowDao.getByName(projectName);
		workflowDao.delete(workflow.getId());
		FileOperation.deleteFile(basePath, projectName);
	}

	// 移除软件设计人员
	public void removeSoftwareDesigner() {
		String projectName = httpRequest.getParameter("projectName");
		String userName = httpRequest.getParameter("userName");
		Workflow workflow = workflowDao.getByName(projectName);
		User user = userDao.getByName(userName);
		Role role = roleDao.getRole(workflow.getId(), user.getId());
		if (role.getRole_a() == null)
			role.setRole_a(0);
		if (role.getRole_b() == null)
			role.setRole_b("null");
		if (role.getRole_c() == null || role.getRole_c() == 1)
			role.setRole_c(0);
		roleDao.saveOrUpdate(role);
		if (role.getRole_a() == 0 && role.getRole_b().equals("null") && role.getRole_c() == 0) {
			user.getWorkflows().remove(workflow);
			workflow.getUsers().remove(user);
			userDao.saveOrUpdate(user);
			workflowDao.saveOrUpdate(workflow);
		}
	}

	// 移除构件设计人员
	public void removeArtifactDesigner() {
		String projectName = httpRequest.getParameter("projectName");
		String userName = httpRequest.getParameter("userName");
		String role_b = httpRequest.getParameter("role_b");
		Workflow workflow = workflowDao.getByName(projectName);
		User user = userDao.getByName(userName);
		Role role = roleDao.getRole(workflow.getId(), user.getId());
		if (role.getRole_a() == null)
			role.setRole_a(0);
		if (role.getRole_b() == null){
			role.setRole_b("null");
		}else if(!role.getRole_b().equals("null")){
			String temp = "";
			String[] artifacts = String.valueOf(role.getRole_b()).split("\\^");
			for(int i = 0; i < artifacts.length; i++){
				if(!artifacts[i].equals(role_b)){
					temp += (artifacts[i] + "^");
				}
			}
			if(temp.equals("")){
				temp = "null";
			}else{
				temp = temp.substring(0, temp.length() - 1);
			}
			role.setRole_b(temp);
		}	
		if (role.getRole_c() == null)
			role.setRole_c(0);
		roleDao.saveOrUpdate(role);
		if (role.getRole_a() == 0 && role.getRole_b().equals("null") && role.getRole_c() == 0) {
			user.getWorkflows().remove(workflow);
			workflow.getUsers().remove(user);
			userDao.saveOrUpdate(user);
			workflowDao.saveOrUpdate(workflow);
		}
	}
	
	//移除工程人员
	public void removeProjectPersonnel(){
		String projectName = httpRequest.getParameter("projectName");
		String userName = httpRequest.getParameter("userName");
		Workflow workflow = workflowDao.getByName(projectName);
		User user = userDao.getByName(userName);
		Role role = roleDao.getRole(workflow.getId(), user.getId());
		role.setRole_a(0);
		role.setRole_b("null");
		role.setRole_c(0);
		roleDao.saveOrUpdate(role);
		if (role.getRole_a() == 0 && role.getRole_b().equals("null") && role.getRole_c() == 0) {
			user.getWorkflows().remove(workflow);
			workflow.getUsers().remove(user);
			userDao.saveOrUpdate(user);
			workflowDao.saveOrUpdate(workflow);
		}
	}

	// 添加软件设计人员
	public void addSoftwareDesigner() {
		String projectName = httpRequest.getParameter("projectName");
		String userName = httpRequest.getParameter("userName");
		Workflow workflow = workflowDao.getByName(projectName);
		User user = userDao.getByName(userName);
		Role role = roleDao.getRole(workflow.getId(), user.getId());
		if (role == null) {
			workflow.getUsers().add(user); 
			user.getWorkflows().add(workflow);
			userDao.saveOrUpdate(user);
			workflowDao.saveOrUpdate(workflow);
			role = roleDao.getRole(workflow.getId(), user.getId());
		}
		if (role.getRole_a() == null)
			role.setRole_a(0);
		if (role.getRole_b() == null)
			role.setRole_b("null");
		if (role.getRole_c() == null || role.getRole_c() == 0)
			role.setRole_c(1);
		roleDao.saveOrUpdate(role);
	}

	// 添加构件设计人员
	public void addArtifactDesigner() {
		String projectName = httpRequest.getParameter("projectName");
		String userName = httpRequest.getParameter("userName");
		String role_b = httpRequest.getParameter("role_b");
		Workflow workflow = workflowDao.getByName(projectName);
		User user = userDao.getByName(userName);
		Role role = roleDao.getRole(workflow.getId(), user.getId());
		if (role == null) {
			workflow.getUsers().add(user);
			user.getWorkflows().add(workflow);
			userDao.saveOrUpdate(user);
			workflowDao.saveOrUpdate(workflow);
			role = roleDao.getRole(workflow.getId(), user.getId());
		}
		if (role.getRole_a() == null)
			role.setRole_a(0);
		if (role.getRole_c() == null)
			role.setRole_c(0);
		if (role.getRole_b() == null)
			role.setRole_b(role_b);
		else if( role.getRole_b().equals("null"))
			role.setRole_b(role_b);
		else
			role_b += ("^" + role.getRole_b());
		role.setRole_b(role_b);
		roleDao.saveOrUpdate(role);
	}

	// 获取用户列表
	public void getUserList() {
		String projectName = httpRequest.getParameter("projectName");
		String data = "";
		Workflow workflow = workflowDao.getByName(projectName);
		List<User> users = userDao.find(null, null, null);
		//获取所有用户
		for (User user : users) {
			String userName = user.getName();
			Map<String, Object> userSession = (Map<String, Object>) application.get(userName);
			if(userSession == null){
				data += (userName + SeparatorUtil.userName + "0" + SeparatorUtil.user);
			}else{
				data += (userName + SeparatorUtil.userName + "1" + SeparatorUtil.user);
			}
		}
		data = data.substring(0, data.length() - 1);
		data += SeparatorUtil.userAll;
		Set<User> projectUsers = workflow.getUsers();
		// 返回用户列表以及用户权限，web端做用户权限分类
		for (User user : projectUsers) {
			String userName = user.getName();
			Role role = roleDao.getRole(workflow.getId(), user.getId());
			Integer role_a = role.getRole_a();
			String role_b = role.getRole_b();
			Integer role_c = role.getRole_c();
			data += (userName + SeparatorUtil.userName
					+ role_a.toString()+ SeparatorUtil.roleLevel
					+ role_b.toString() + SeparatorUtil.roleLevel
					+ role_c.toString() + SeparatorUtil.user);
		}
		data = data.substring(0, data.length() - 1);
		System.out.println(data);
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		out.print(data);
		out.flush();
		out.close();
	}

	// 获取工程列表
	public void getProjectList() {
		//getUserList();
		User sessionUser = (User) session.get("user");
		String basePath = httpRequest.getRealPath("/");
		String path = basePath + PathUtil.groupData;
		User loginUser = userDao.login(sessionUser.getName(), sessionUser.getPassword());
		Set<Workflow> workflows = loginUser.getWorkflows();
		// 检测用户名下的工程有效性
		for (Workflow workflow : workflows) {
			String projectName = workflow.getName();
			if (FileOperation.checkFileExist(basePath, projectName)) {
				
			} else {
				workflows.remove(workflow);
				workflowDao.delete(workflow.getId());
			}
		}
		//检测组用户目录下的工程文件
		File projectFiles = new File(path);
		if (projectFiles.isDirectory()) {
			File[] projectDirectory = projectFiles.listFiles();
			for (int i = 0; i < projectDirectory.length; i++) {
				if (projectDirectory[i].isFile()) {
					
				}else if(projectDirectory[i].isDirectory()){
					File[] projectFile = projectDirectory[i].listFiles();
					for(int j = 0; j < projectFile.length; j++){
						String data = FileOperation.loadFile(projectFile[0]);
						String[] val1 = String.valueOf(data).split("\\*");
						String userName = val1[0];
						User user = userDao.getByName(userName);
						Workflow workflow = new Workflow();
						String projectName = projectFile[0].getName().split("\\.")[0];
						boolean isAdd = true;
						for (Workflow wf : workflows) {
							if(wf.getName().equals(projectName)){
								isAdd = false;
								break;
							}
						}
						List<Workflow> allWorkflows = workflowDao.find(null, null, null);
						for (Workflow wf : allWorkflows) {
							if(wf.getName().equals(projectName)){
								isAdd = false;
								break;
							}
						}
						if(isAdd){
							workflow.setName(projectName);
							workflow.setBuild_person(user);
							workflow.setBuild_time(new java.sql.Date(new Date().getTime()));
							workflow.getUsers().add(user);
							user.getWorkflows().add(workflow);
							userDao.saveOrUpdate(user);
							workflowDao.save(workflow);
							Role role = roleDao.getRole(workflow.getId(), user.getId());
							role.setRole_a(1);
							role.setRole_b("null");
							role.setRole_c(0);
							roleDao.saveOrUpdate(role);
						}
					}
				}
			}
		}
		
		// 获取相应用户名下的工程列表
		//userDao.update(loginUser);
		//loginUser = userDao.login(sessionUser.getName(), sessionUser.getPassword());
		//workflows = loginUser.getWorkflows();
		String data = "";
		for (Workflow workflow : workflows) {
			String projectName = workflow.getName();
			data += (SeparatorUtil.projectName + projectName);
		}
		System.out.println(data);
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		out.print(data);
		out.flush();
		out.close();
	}
	
	//获取工程中用户存在信息，以及用户列表信息
	public void getUserInfo() {
		String projectName = httpRequest.getParameter("projectName");
		String userName = httpRequest.getParameter("userName");
		String data = "";
		Set<User> projectUsers = (Set<User>) application.get(projectName);
		User currentUser = userDao.getByName(userName);
		if(projectUsers == null){
			projectUsers = new HashSet<User>();
			projectUsers.add(currentUser);
			application.put(projectName, projectUsers);
		}else{
			boolean isAdd = true;
			for (User user : projectUsers) {
				String checkUsername = user.getName();
				if(checkUsername.equals(currentUser.getName())){
					isAdd = false;
				}
			}
			if(isAdd){
				projectUsers.add(currentUser);
			}
		}
		for (User user : projectUsers) {
			String username = user.getName();
			if(!username.equals(userName)){
				Map<String, Object> userSession = (Map<String, Object>) application.get(username);
				if(userSession == null){
					
				}else{
					if(checkTimeOut((long)userSession.get("newHeatBeatTime"))){
						data += ("1*" + username);
						break;
					}else{
						
					}
				}
			}
		}
		if(data.equals("")){
			data += ("0*server");
		}
		System.out.println(data);
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		out.print(data);
		out.flush();
		out.close();
	}

	// 用户读取process
	public void loadProcess() throws Exception {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String webUrl = httpRequest.getRealPath("/");
		String processName = httpRequest.getParameter("processName");
		String userName = httpRequest.getParameter("userName");
		/*Set<User> projectUsers = (Set<User>) application.get(processName);
		User currentUser = userDao.getByName(userName);
		if(projectUsers == null){
			projectUsers = new HashSet<User>();
			projectUsers.add(currentUser);
			application.put(processName, projectUsers);
		}else{
			boolean isAdd = true;
			for (User user : projectUsers) {
				String checkUsername = user.getName();
				if(checkUsername.equals(currentUser.getName())){
					isAdd = false;
				}
			}
			if(isAdd){
				projectUsers.add(currentUser);
			}
			
		}*/
		String path = PathUtil.getDataPath(webUrl, ControlUtil.OperationModel.group, processName);
		processName = httpRequest.getParameter("processName") + ".data";
		DataTransmission.download(httpRequest, response, path, processName, ControlUtil.ClientTransmissionType.context,
				ControlUtil.ClientType.data, ControlUtil.ServerType.data, ControlUtil.CFGType.normal);
		DataTransmission.closeWriter(response);
		return;
	}

	// 上传源文件
	public void uploadCodeFile() {
		String webUrl = httpRequest.getRealPath("/");
		// User activeUser = (User) session.get("user");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		String processName = httpRequest.getParameter("processName");
		// 自定义数据文件路径
		String dataPath = PathUtil.getCodePath(webUrl, ControlUtil.OperationModel.group, processName);
		// 保存自定义文件
		DataTransmission.upload(httpRequest, response, dataPath, processName,
				ControlUtil.ClientTransmissionType.context, ControlUtil.ServerType.codeResource);
		return;
	}

	// 下载源文件
	public void downloadCodeFile() {
		String processName = httpRequest.getParameter("processName");
		String fileName = httpRequest.getParameter("fileName");
		String webUrl = httpRequest.getRealPath("/");
		// User activeUser = (User) session.get("user");
		String filePath = PathUtil.getCodePath(webUrl, ControlUtil.OperationModel.group, processName);
		DataTransmission.download(httpRequest, response, filePath, fileName, ControlUtil.ClientTransmissionType.file,
				ControlUtil.ClientType.cfg, ControlUtil.ServerType.codeResource, ControlUtil.CFGType.normal);
		return;
	}

	// 用户文件下载
	public void downloadFile() throws Exception {
		String processName = httpRequest.getParameter("processName");
		String fileName = httpRequest.getParameter("fileName");
		String webUrl = httpRequest.getRealPath("/");
		// User activeUser = (User) session.get("user");
		String filePath = PathUtil.getPath(webUrl, ControlUtil.OperationModel.group, processName, processName,
				ControlUtil.ElementType.OS);
		DataTransmission.download(httpRequest, response, filePath, fileName, ControlUtil.ClientTransmissionType.file,
				ControlUtil.ClientType.cfg, ControlUtil.ServerType.cfg, ControlUtil.CFGType.normal);
		return;
	}

	// JNLP下载器
	public void JNLPLaunch() throws Exception {
		String webUrl = httpRequest.getRealPath("/");
		String path = webUrl + PathUtil.resourceApp;
		String componentName = httpRequest.getParameter("componentName") + ".jnlp";
		DataTransmission.download(httpRequest, response, path, componentName, ControlUtil.ClientTransmissionType.file,
				ControlUtil.ClientType.cfg, ControlUtil.ServerType.codeResource, ControlUtil.CFGType.normal);
		// DataTransmission.closeWriter(response);
		return;
	}

	// 用户编辑文件保存
	public void saveUserProcess() throws Exception {
		String webUrl = httpRequest.getRealPath("/");
		// User activeUser = (User) session.get("user");
		httpRequest.setCharacterEncoding("UTF-8");
		String processName = httpRequest.getParameter("processName");
		// 自定义数据文件路径
		String dataPath = PathUtil.getDataPath(webUrl, ControlUtil.OperationModel.group, processName);
		// 用户需求文件目录
		String path = PathUtil.getPath(webUrl, ControlUtil.OperationModel.group, processName, processName,
				ControlUtil.ElementType.OS);
		// 保存自定义文件
		DataTransmission.upload(httpRequest, response, dataPath, processName,
				ControlUtil.ClientTransmissionType.context, ControlUtil.ServerType.data);
		// 保存用户需求文件
		// DataTransmission.upload(httpRequest, response, path, processName,
		// ControlUtil.ClientTransmissionType.context,
		// ControlUtil.ServerType.cfg);
		return;
	}

	// 加载操作系统
	public void loadOSVersion() throws Exception {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String webUrl = httpRequest.getRealPath("/");
		String templateName = httpRequest.getParameter("templateName");
		String path = PathUtil.getTemplatePath(webUrl, templateName, ControlUtil.ElementType.OS);
		DataTransmission.loadContent(httpRequest, response, path);
	}

	// 加载组件版本
	public void loadComponentVersion() {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String webUrl = httpRequest.getRealPath("/");
		String templateName = httpRequest.getParameter("templateName");
		String type = httpRequest.getParameter("type");
		String path = null;
		if (type.equals("IO")) {
			path = PathUtil.getTemplatePath(webUrl, templateName, ControlUtil.ElementType.IO);
		} else if (type.equals("RM")) {
			path = PathUtil.getTemplatePath(webUrl, templateName, ControlUtil.ElementType.RM);
		} else if (type.equals("CL")) {
			path = PathUtil.getTemplatePath(webUrl, templateName, ControlUtil.ElementType.CL);
		}
		DataTransmission.loadContent(httpRequest, response, path);
	}

	// 加载总线版本
	public void loadBusVersion() throws Exception {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String webUrl = httpRequest.getRealPath("/");
		String templateName = httpRequest.getParameter("templateName");
		String path = PathUtil.getTemplatePath(webUrl, templateName, ControlUtil.ElementType.BUS);
		DataTransmission.loadContent(httpRequest, response, path);
	}

	// 加载总线数据
	public void loadBusContext() throws Exception {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		// User activeUser = (User) session.get("user");
		// String userName = activeUser.getName();
		String model = httpRequest.getParameter("model");
		String contextName = httpRequest.getParameter("contextName");
		;
		String webUrl = httpRequest.getRealPath("/");
		if (model.equals("template")) {
			String templateName = httpRequest.getParameter("templateName");
			String BusContextPath = PathUtil.getTemplatePath(webUrl, templateName, ControlUtil.ElementType.BUS);
			DataTransmission.download(httpRequest, response, BusContextPath, contextName,
					ControlUtil.ClientTransmissionType.context, ControlUtil.ClientType.cfg, ControlUtil.ServerType.cfg,
					ControlUtil.CFGType.BUS);
			DataTransmission.download(httpRequest, response, BusContextPath, contextName,
					ControlUtil.ClientTransmissionType.context, ControlUtil.ClientType.data, ControlUtil.ServerType.cfg,
					ControlUtil.CFGType.BUS);
		} else if (model.equals("temp")) {
			String processName = httpRequest.getParameter("processName");
			String BusContextPath = PathUtil.getTempPath(webUrl, ControlUtil.OperationModel.group, processName,
					processName, ControlUtil.ElementType.BUS);
			DataTransmission.download(httpRequest, response, BusContextPath, contextName,
					ControlUtil.ClientTransmissionType.context, ControlUtil.ClientType.cfg, ControlUtil.ServerType.cfg,
					ControlUtil.CFGType.BUS);
			DataTransmission.download(httpRequest, response, BusContextPath, contextName,
					ControlUtil.ClientTransmissionType.context, ControlUtil.ClientType.data, ControlUtil.ServerType.cfg,
					ControlUtil.CFGType.BUS);
		}
		DataTransmission.closeWriter(response);
		return;
	}

	// 上传BusConfigure
	public void uploadBusConfigure() throws Exception {
		String webUrl = httpRequest.getRealPath("/");
		User activeUser = (User) session.get("user");
		String userName = activeUser.getName();
 		String processName = httpRequest.getParameter("processName");
		String tempBusPath = PathUtil.getTempPath(webUrl, ControlUtil.OperationModel.group, processName, processName,
				ControlUtil.ElementType.BUS);// 單用戶
		DataTransmission.upload(httpRequest, response, tempBusPath, null, ControlUtil.ClientTransmissionType.file,
				ControlUtil.ServerType.cfg);
	}

	// 组件代码传输
	public void codeTransmission() throws Exception {
		responseHeadConfig();
		// User activeUser = (User) session.get("user");
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String webUrl = httpRequest.getRealPath("/");
		String codeName = httpRequest.getParameter("codeName");
		String type = httpRequest.getParameter("type");
		String path = PathUtil.getCodePath(webUrl, ControlUtil.OperationModel.group, codeName);
		if (type.equals("upload")) {
			// 保存自定义文件
			DataTransmission.upload(httpRequest, response, path, codeName, ControlUtil.ClientTransmissionType.context,
					ControlUtil.ServerType.codeResource);
		} else if (type.equals("download")) {
			DataTransmission.download(httpRequest, response, path, codeName + ".c",
					ControlUtil.ClientTransmissionType.context, ControlUtil.ClientType.cfg, ControlUtil.ServerType.cfg,
					ControlUtil.CFGType.normal);
			DataTransmission.closeWriter(response);
		}
		return;
	}

	// 组件初始化
	public void componentConfig() throws Exception {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String fileName = "comp_config.json";
		String webUrl = httpRequest.getRealPath("/");
		String path = webUrl + PathUtil.resourceJson;
		DataTransmission.download(httpRequest, response, path, fileName, ControlUtil.ClientTransmissionType.context,
				ControlUtil.ClientType.data, ControlUtil.ServerType.data, ControlUtil.CFGType.normal);
		DataTransmission.closeWriter(response);
		// readAndWriteFile(url);
		return;
	}

	// 请求html
	public void requestHTML() {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("utf-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String fileName = httpRequest.getParameter("href") + ".html";
		String webUrl = httpRequest.getRealPath("/");
		String path = webUrl + PathUtil.resourceHTML;
		DataTransmission.download(httpRequest, response, path, fileName, ControlUtil.ClientTransmissionType.context,
				ControlUtil.ClientType.data, ControlUtil.ServerType.data, ControlUtil.CFGType.normal);
		DataTransmission.closeWriter(response);
		return;
	}

	// 加载组件数据流
	public void loadComponentDataFlow() {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String webUrl = httpRequest.getRealPath("/");
		String templateName = httpRequest.getParameter("templateName");
		String type = httpRequest.getParameter("type");
		String mainType = httpRequest.getParameter("mainType");
		String version = httpRequest.getParameter("version");
		String fileName = type + PathUtil.modelFile;
		String path = null;
		if (mainType.equals(ControlUtil.ComponentIO)) {
			if (type.equals(mainType)) {
				path = PathUtil.getTemplateModelPath(webUrl, templateName, ControlUtil.ElementType.IO, version);
			} else {
				path = PathUtil.getTemplateSubModelPath(webUrl, templateName, ControlUtil.ElementType.IO, version);
			}
		} else if (mainType.equals(ControlUtil.ComponentRM)) {
			if (type.equals(mainType)) {
				path = PathUtil.getTemplateModelPath(webUrl, templateName, ControlUtil.ElementType.RM, version);
			} else {
				path = PathUtil.getTemplateSubModelPath(webUrl, templateName, ControlUtil.ElementType.RM, version);
			}
		} else if (mainType.equals(ControlUtil.ComponentCL)) {
			if (type.equals(mainType)) {
				path = PathUtil.getTemplateModelPath(webUrl, templateName, ControlUtil.ElementType.CL, version);
			} else {
				path = PathUtil.getTemplateSubModelPath(webUrl, templateName, ControlUtil.ElementType.CL, version);
			}
		}
		DataTransmission.download(httpRequest, response, path, fileName, ControlUtil.ClientTransmissionType.context,
				ControlUtil.ClientType.data, ControlUtil.ServerType.cfg, ControlUtil.CFGType.componentData);
		DataTransmission.closeWriter(response);
	}

	// 加载子模型
	public void loadSubComponent() {
		responseHeadConfig();
		response.setContentType("text/html");
		try {
			httpRequest.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO 自动生成的 catch 块
			e2.printStackTrace();
		}
		String webUrl = httpRequest.getRealPath("/");
		String templateName = httpRequest.getParameter("templateName");
		String type = httpRequest.getParameter("type");
		String mainType = httpRequest.getParameter("mainType");
		String version = httpRequest.getParameter("version");
		String fileName = type + PathUtil.modelFile;
		String path = null;
		if (mainType.equals(ControlUtil.ComponentIO)) {
			if (type.equals(mainType)) {
				path = PathUtil.getTemplateModelPath(webUrl, templateName, ControlUtil.ElementType.IO, version);
			} else {
				path = PathUtil.getTemplateSubModelPath(webUrl, templateName, ControlUtil.ElementType.IO, version);
			}
		} else if (mainType.equals(ControlUtil.ComponentRM)) {
			if (type.equals(mainType)) {
				path = PathUtil.getTemplateModelPath(webUrl, templateName, ControlUtil.ElementType.RM, version);
			} else {
				path = PathUtil.getTemplateSubModelPath(webUrl, templateName, ControlUtil.ElementType.RM, version);
			}
		} else if (mainType.equals(ControlUtil.ComponentCL)) {
			if (type.equals(mainType)) {
				path = PathUtil.getTemplateModelPath(webUrl, templateName, ControlUtil.ElementType.CL, version);
			} else {
				path = PathUtil.getTemplateSubModelPath(webUrl, templateName, ControlUtil.ElementType.CL, version);
			}
		}
		DataTransmission.download(httpRequest, response, path, fileName, ControlUtil.ClientTransmissionType.context,
				ControlUtil.ClientType.data, ControlUtil.ServerType.cfg, ControlUtil.CFGType.componentModel);
		DataTransmission.closeWriter(response);
	}

	// 管用户
	private User user = new User();
	// 确认密码
	private String repassword;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getRepassword() {
		return repassword;
	}

	public void setRepassword(String repassword) {
		this.repassword = repassword;
	}

	@Override
	public User getModel() {
		return user;
	}
}