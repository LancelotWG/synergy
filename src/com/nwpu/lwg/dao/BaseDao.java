package com.nwpu.lwg.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public interface BaseDao<T> {
	//基本数据库操作方法
	public void save(Object obj);//保存数据
	public void saveOrUpdate(Object obj);//保存或修改数据
	public void update(Object obj);//修改数据
	public void delete(Serializable ... ids);//删除数据
	public T get(Serializable entityId);//加载实体对象
	public T load(Serializable entityId);//加载实体对象
	public Object uniqueResult(String hql, Object[] queryParams);//使用hql语句操作
	public List<T> find(final String where, final Object[] queryParams, final Map<String, String> orderby);//批量查询
}
