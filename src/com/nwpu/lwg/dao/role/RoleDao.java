package com.nwpu.lwg.dao.role;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.nwpu.lwg.dao.BaseDao;
import com.nwpu.lwg.model.role.Role;

@Repository("roleDao")
@Transactional
public interface RoleDao extends BaseDao<Role> {
	public Role getRole(int workflow_id, int user_id);
}
