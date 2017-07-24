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
 * Dao支持类
 * 
 * @author Li Yongqiang
 * @param <T>
 */

@Transactional
@SuppressWarnings("unchecked")
public class DaoSupport<T> implements BaseDao<T> {
	@Autowired
	private SessionFactory sessionFactory;

	// 泛型的类型
	protected Class<T> entityClass = GenericsUtils.getGenericType(this.getClass());

	// Hibernate模板
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
	 * 利用get()方法加载对象，获取对象的详细信息
	 */
	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public T get(Serializable entityId) {
		return (T) getSession().get(this.entityClass, entityId);
	}

	/**
	 * 利用load()方法加载对象，获取对象的详细信息
	 */
	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public T load(Serializable entityId) {
		return (T) getSession().load(this.entityClass, entityId);
	}

	/**
	 * 利用hql语句查找单条信息
	 */
	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public Object uniqueResult(final String hql, final Object[] queryParams) {
		// return getSession().execute(new HibernateCallback() {
		// @Override
		// public Object doInHibernate(Session session) throws
		// HibernateException,
		// SQLException {
		// Query query = session.createQuery(hql);//执行查询
		// setQueryParams(query, queryParams);//设置查询参数
		// return query.uniqueResult();
		// }
		// });
		Query query = getSession().createQuery(hql);
		setQueryParams(query, queryParams);// 设置查询参数
		return query.uniqueResult();
	}

	/**
	 * 对query中的参数赋值
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
	 * 创建排序hql语句
	 * 
	 * @param orderby
	 * @return 排序字符串
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
		String hql = new StringBuffer().append("from ")// 添加form字段
				.append(GenericsUtils.getGenericName(entityClass))// 添加对象类型
				.append(" ")// 添加空格
				.append(where == null ? "" : where)// 如果where为null就添加空格,反之添加where
				.append(createOrderBy(orderby))// 添加排序条件参数
				.toString();// 转化为字符串				
		//String hql = "from User";
		Query query = getSession().createQuery(hql);// 执行查询
		setQueryParams(query, queryParams);// 为参数赋值
		List<T> list = null;// 定义List对象
		// 如果maxResult<0，则查询所有
			list = query.list();// 将查询结果转化为List对象
		return list;// 返回分页的实体对象
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
	 * 利用update()方法修改对象的详细信息
	 */
	@Override
	public void update(Object obj) {
		getSession().update(obj);
	}

	/**
	 * 获取Session对象
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
