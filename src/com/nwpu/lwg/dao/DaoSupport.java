package com.nwpu.lwg.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.nwpu.lwg.model.user.User;
import com.nwpu.lwg.util.GenericsUtils;

/**
 * Dao֧����
 * 
 * @author Li Yongqiang
 * @param <T>
 */

@Transactional
@SuppressWarnings("unchecked")
public class DaoSupport<T> implements BaseDao<T> {
	@Autowired
	private SessionFactory sessionFactory;

	// ���͵�����
	protected Class<T> entityClass = GenericsUtils.getGenericType(this.getClass());

	// Hibernateģ��
	// @Autowired
	// protected HibernateTemplate template;
	//
	// public HibernateTemplate getTemplate() {
	// return template;
	// }
	@Override
	public void delete(Serializable... ids) {
		for (Serializable id : ids) {
			T t = (T) getSession().load(this.entityClass, id);
			getSession().delete(t);
		}
	}

	/**
	 * ����get()�������ض��󣬻�ȡ�������ϸ��Ϣ
	 */
	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public T get(Serializable entityId) {
		return (T) getSession().get(this.entityClass, entityId);
	}

	/**
	 * ����load()�������ض��󣬻�ȡ�������ϸ��Ϣ
	 */
	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public T load(Serializable entityId) {
		return (T) getSession().load(this.entityClass, entityId);
	}

	/**
	 * ����hql�����ҵ�����Ϣ
	 */
	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public Object uniqueResult(final String hql, final Object[] queryParams) {
		// return getSession().execute(new HibernateCallback() {
		// @Override
		// public Object doInHibernate(Session session) throws
		// HibernateException,
		// SQLException {
		// Query query = session.createQuery(hql);//ִ�в�ѯ
		// setQueryParams(query, queryParams);//���ò�ѯ����
		// return query.uniqueResult();
		// }
		// });
		Query query = getSession().createQuery(hql);
		setQueryParams(query, queryParams);// ���ò�ѯ����
		return query.uniqueResult();
	}

	/**
	 * ��query�еĲ�����ֵ
	 * 
	 * @param query
	 * @param queryParams
	 */
	protected void setQueryParams(Query query, Object[] queryParams) {
		if (queryParams != null && queryParams.length > 0) {
			for (int i = 0; i < queryParams.length; i++) {
				query.setParameter(i, queryParams[i]);
			}
		}
	}

	/**
	 * ��������hql���
	 * 
	 * @param orderby
	 * @return �����ַ���
	 */
	protected String createOrderBy(Map<String, String> orderby) {
		StringBuffer sb = new StringBuffer("");
		if (orderby != null && orderby.size() > 0) {
			sb.append(" order by ");
			for (String key : orderby.keySet()) {
				sb.append(key).append(" ").append(orderby.get(key)).append(",");
			}
			sb.deleteCharAt(sb.length() - 1);
		}
		return sb.toString();
	}
	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public List<T> find(final String where, final Object[] queryParams, final Map<String, String> orderby) {
		String hql = new StringBuffer().append("from ")// ���form�ֶ�
				.append(GenericsUtils.getGenericName(entityClass))// ��Ӷ�������
				.append(" ")// ��ӿո�
				.append(where == null ? "" : where)// ���whereΪnull����ӿո�,��֮���where
				.append(createOrderBy(orderby))// ���������������
				.toString();// ת��Ϊ�ַ���				
		//String hql = "from User";
		Query query = getSession().createQuery(hql);// ִ�в�ѯ
		setQueryParams(query, queryParams);// Ϊ������ֵ
		List<T> list = null;// ����List����
		// ���maxResult<0�����ѯ����
			list = query.list();// ����ѯ���ת��ΪList����
		return list;// ���ط�ҳ��ʵ�����
	}

	@Override
	public void save(Object obj) {
		getSession().save(obj);
	}

	@Override
	public void saveOrUpdate(Object obj) {
		getSession().saveOrUpdate(obj);
	}

	/**
	 * ����update()�����޸Ķ������ϸ��Ϣ
	 */
	@Override
	public void update(Object obj) {
		getSession().update(obj);
	}

	/**
	 * ��ȡSession����
	 * 
	 * @return
	 */

	protected Session getSession() {
		// return (!this.template.isAllowCreate() ?
		// SessionFactoryUtils.getSession(this.template.getSessionFactory(),
		// false) :
		// SessionFactoryUtils.getSession(
		// this.template.getSessionFactory(),
		// this.template.getEntityInterceptor(),
		// this.template.getJdbcExceptionTranslator()));
		return sessionFactory.getCurrentSession();
	}
}
