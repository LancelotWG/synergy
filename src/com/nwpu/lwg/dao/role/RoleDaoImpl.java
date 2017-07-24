package com.nwpu.lwg.dao.role;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.nwpu.lwg.dao.DaoSupport;
import com.nwpu.lwg.model.role.Role;

@Repository("roleDao")
@Transactional
public class RoleDaoImpl extends DaoSupport<Role> implements RoleDao {

	@Transactional(propagation=Propagation.NOT_SUPPORTED,readOnly=true)
	public Role getRole(int workflow_id, int user_id) {
		String where = "where workflow_id=? and user_id=?";
		Object[] queryParams = {workflow_id,user_id};
		List<Role> list = find(where, queryParams,null);
		if(list != null && list.size() > 0){
			return list.get(0);
		}
		return null;
	}
}
