package com.nwpu.lwg.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts2.interceptor.ApplicationAware;
import org.apache.struts2.interceptor.RequestAware;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.interceptor.SessionAware;
import org.springframework.beans.factory.annotation.Autowired;

import com.nwpu.lwg.dao.role.RoleDao;
import com.nwpu.lwg.dao.user.UserDao;
import com.nwpu.lwg.dao.workflow.WorkflowDao;
import com.nwpu.lwg.model.user.User;
import com.opensymphony.xwork2.ActionSupport;

public class BaseAction extends ActionSupport implements RequestAware, SessionAware, ApplicationAware, ServletResponseAware, ServletRequestAware{
	private static final long serialVersionUID = 1L;
	protected Integer id;
	protected Integer[] ids;
	static protected int sessionNumber = 0;

	public static final String USER_OPERATE = "userOperate";
	public static final String ADMIN_OPERATE = "adminOperate";
	public static final String REG = "reg";
	public static final String ADMIN_LOGIN = "adminLogin";
	public static final String USER_LOGIN = "userLogin";
	public static final String LOGOUT = "logout";
	public static final String ERROR = "error";

	// 获取用户id
	// 获取用户对象
	/*
	 * public Customer getLoginCustomer() { if (session.get("customer") != null)
	 * { return (Customer) session.get("customer"); } return null; }
	 */
	// 获取管理员id
	// 获取管理员对象
	public User getLoginUser() {
		if (session.get("user") != null) {
			return (User) session.get("user");
		}
		return null;
	}

	// 从session中取出购物车

	// 注入Dao
	@Autowired
	protected UserDao userDao;
	@Autowired
	protected WorkflowDao workflowDao;
	@Autowired
	protected RoleDao roleDao;
	/*
	 * @Autowired protected AdminrDao customerDao;
	 */
	/*
	 * @Autowired protected UploadFileDao uploadFileDao;
	 */

	// Map类型的request
	protected Map<String, Object> request;
	// Map类型的session
	protected Map<String, Object> session;
	// Map类型的application
	protected Map<String, Object> application;
	//response
	protected HttpServletResponse response;
	//request
	protected HttpServletRequest httpRequest;
	
	@Override
	public void setRequest(Map<String, Object> request) {
		// 获取Map类型的request赋值
		this.request = request;
	}

	@Override
	public void setApplication(Map<String, Object> application) {
		// 获取Map类型的application赋值
		this.application = application;
	}

	@Override
	public void setSession(Map<String, Object> session) {
		// 获取Map类型的session赋值
		this.session = session;
	}

	// 处理方法
	public String execute() throws Exception {
		return SUCCESS;
	}

	public String reg() throws Exception {
		return REG;
	}

	public String logout() throws Exception {
		return LOGOUT;
	}

	// getter和settter方法
	public Integer[] getIds() {
		return ids;
	}

	public void setIds(Integer[] ids) {
		this.ids = ids;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	protected void responseHeadConfig() {
		response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
		response.setHeader("P3P", "CP='NOI DEVa TAIa OUR BUS UNI'");
		response.setHeader("Pragma","no-cache"); //HTTP 1.0
		response.setDateHeader ("Expires", 0); //prevents caching at the proxy server	
		response.setCharacterEncoding("UTF-8");
	}

	@Override
	public void setServletResponse(HttpServletResponse response) {
		// TODO 自动生成的方法存根
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest httpRequest) {
		// TODO 自动生成的方法存根
		this.httpRequest = httpRequest;
	}

}
