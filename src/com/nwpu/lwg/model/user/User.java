package com.nwpu.lwg.model.user;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import com.nwpu.lwg.model.project.Workflow;

public class User implements Serializable{
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String name;
	private String password;
	private Set<Workflow> workflows = new HashSet<>();
	public User() {
		
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Set<Workflow> getWorkflows() {
		return workflows;
	}
	public void setWorkflows(Set<Workflow> workflows) {
		this.workflows = workflows;
	}
	
}
