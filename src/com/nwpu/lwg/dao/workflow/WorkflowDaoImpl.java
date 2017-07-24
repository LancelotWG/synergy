package com.nwpu.lwg.dao.workflow;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.nwpu.lwg.dao.DaoSupport;
import com.nwpu.lwg.model.project.Workflow;
import com.nwpu.lwg.model.role.Role;
import com.nwpu.lwg.model.user.User;

@Repository("workflowDao")
@Transactional
public class WorkflowDaoImpl extends DaoSupport<Workflow> implements WorkflowDao {
	
	@SuppressWarnings("unchecked")
	@Transactional(propagation=Propagation.NOT_SUPPORTED,readOnly=true)
	public void deletePerson(Workflow workflow, User user) {
		// TODO 自动生成的方法存根
		workflow.getUsers().remove(user);
		update(workflow);
	}

	@SuppressWarnings("unchecked")
	@Transactional(propagation=Propagation.NOT_SUPPORTED,readOnly=true)
	public Workflow newWorkflow(Workflow workflow, User user) {
		// TODO 自动生成的方法存根
		workflow.setBuild_person(user);
		workflow.getUsers().add(user);
		user.getWorkflows().add(workflow);
		update(workflow);;
		update(user);
		return workflow;
	}

	@Override
	public Workflow getByName(String projectName) {
		if(projectName != null){
			String where = "where name=?";
			Object[] queryParams = {projectName};
			List<Workflow> list = find(where, queryParams,null);
			if(list != null && list.size() > 0){
				return list.get(0);
			}
		}
		return null;
	}

}
