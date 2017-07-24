package com.nwpu.lwg.model.project;

import java.io.Serializable;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

import com.nwpu.lwg.model.user.User;

public class Workflow implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String name;
	private User build_person;
	private Date build_time;
	private Set<User> users = new HashSet<>();
	public Workflow(){
		
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
	public Date getBuild_time() {
		return build_time;
	}
	public void setBuild_time(Date build_time) {
		this.build_time = build_time;
	}
	public Set<User> getUsers() {
		return users;
	}
	public void setUsers(Set<User> users) {
		this.users = users;
	}
	public User getBuild_person() {
		return build_person;
	}
	public void setBuild_person(User build_person) {
		this.build_person = build_person;
	}
		
}
