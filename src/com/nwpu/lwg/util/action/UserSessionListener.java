package com.nwpu.lwg.util.action;

import java.util.Map;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.nwpu.lwg.model.user.User;
import com.opensymphony.xwork2.ModelDriven;

public class UserSessionListener implements HttpSessionListener {
	protected Map<String, Object> sessions;

	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
		// TODO 自动生成的方法存根
		System.out.println("add:session");
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent arg0) {
		// TODO 自动生成的方法存根
		User loginUser = (User) arg0.getSession().getAttribute("user");
		Map<String, Object> applicationLoginUser = null;
		if (loginUser != null) {
			applicationLoginUser = (Map<String, Object>) (arg0.getSession().getServletContext()).getAttribute(loginUser.getName());
		}
		if (applicationLoginUser != null) {
			(arg0.getSession().getServletContext()).removeAttribute(loginUser.getName());
			System.out.println("remove:" + loginUser.getName());
		}
		
	}
}
