package com.nwpu.lwg.model.role;

import java.io.Serializable;

import com.nwpu.lwg.model.project.Workflow;
import com.nwpu.lwg.model.user.User;

public class Role implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer id;
	private Integer role_a;
	private String role_b;
	private Integer role_c;
	private Workflow workflow;
	private User user;
	public Role(){
		
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getRole_a() {
		return role_a;
	}
	public void setRole_a(Integer role_a) {
		this.role_a = role_a;
	}
	public String getRole_b() {
		return role_b;
	}
	public void setRole_b(String role_b) {
		this.role_b = role_b;
	}
	public Integer getRole_c() {
		return role_c;
	}
	public void setRole_c(Integer role_c) {
		this.role_c = role_c;
	}
	public Workflow getWorkflow() {
		return workflow;
	}
	public void setWorkflow(Workflow workflow) {
		this.workflow = workflow;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	
}
