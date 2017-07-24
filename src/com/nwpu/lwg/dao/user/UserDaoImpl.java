package com.nwpu.lwg.dao.user;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.nwpu.lwg.dao.DaoSupport;
import com.nwpu.lwg.model.user.User;

@Repository("userDao")
@Transactional
public class UserDaoImpl extends DaoSupport<User> implements UserDao {

	@Transactional(propagation=Propagation.NOT_SUPPORTED,readOnly=true)
	public User login(String username, String password) {
		if(username != null && password != null){
			String where = "where name=? and password=?";
			Object[] queryParams = {username,password};
			List<User> list = find(where, queryParams,null);
			if(list != null && list.size() > 0){
				return list.get(0);
			}
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	@Transactional(propagation=Propagation.NOT_SUPPORTED,readOnly=true)
	public boolean isUnique(String username) {
		Object[] queryParams = {username};//设置参数对象数组
		List list = (List)super.uniqueResult("from User where name = ?", queryParams);
//		List list = super.getSession().find("from Customer where username = ?", username);
		if(list != null && list.size() > 0){
			return false;
		}
		return true;
	}

	@Override
	public User getByName(String userName) {
		if(userName != null){
			String where = "where name=?";
			Object[] queryParams = {userName};
			List<User> list = find(where, queryParams,null);
			if(list != null && list.size() > 0){
				return list.get(0);
			}
		}
		return null;
	}
}
