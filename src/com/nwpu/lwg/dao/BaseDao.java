package com.nwpu.lwg.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public interface BaseDao<T> {
	//�������ݿ��������
	public void save(Object obj);//��������
	public void saveOrUpdate(Object obj);//������޸�����
	public void update(Object obj);//�޸�����
	public void delete(Serializable ... ids);//ɾ������
	public T get(Serializable entityId);//����ʵ�����
	public T load(Serializable entityId);//����ʵ�����
	public Object uniqueResult(String hql, Object[] queryParams);//ʹ��hql������
	public List<T> find(final String where, final Object[] queryParams, final Map<String, String> orderby);//������ѯ
}
