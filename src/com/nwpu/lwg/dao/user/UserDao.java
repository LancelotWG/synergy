package com.nwpu.lwg.dao.user;

import com.nwpu.lwg.dao.BaseDao;
import com.nwpu.lwg.model.user.User;

public interface UserDao extends BaseDao<User> {
	public User login(String username, String password);
	public boolean isUnique(String username);
	public User getByName(String userName);
}
