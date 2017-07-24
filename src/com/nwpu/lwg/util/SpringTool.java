package com.nwpu.lwg.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public final class SpringTool implements ApplicationContextAware {

	private static ApplicationContext applicationContext = null;
	@Override
	public void setApplicationContext(ApplicationContext arg0) throws BeansException {
		// TODO 自动生成的方法存根
		if(SpringTool.applicationContext == null){
			SpringTool.applicationContext = applicationContext;
		}
	}
	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}
	public static Object getBean(String name){
		return getApplicationContext().getBean(name);
	}
}
