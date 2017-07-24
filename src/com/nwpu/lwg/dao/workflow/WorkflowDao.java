package com.nwpu.lwg.dao.workflow;

import java.util.Date;

import com.nwpu.lwg.dao.BaseDao;
import com.nwpu.lwg.model.project.Workflow;
import com.nwpu.lwg.model.role.Role;
import com.nwpu.lwg.model.user.User;

public interface WorkflowDao extends BaseDao<Workflow> {
	public Workflow newWorkflow(Workflow workflow, User user);
	public void deletePerson(Workflow workflow, User user);
	public Workflow getByName(String projectName);
}
