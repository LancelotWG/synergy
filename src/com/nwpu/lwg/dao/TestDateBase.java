package com.nwpu.lwg.dao;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.nwpu.lwg.model.user.User;

/**
 * Servlet implementation class TestDateBase
 */
/*@Service
@WebServlet("/TestDateBase")*/
public class TestDateBase extends HttpServlet {
	private static final long serialVersionUID = 1L;
	@Autowired
	@Qualifier("sessionFactory")
    public SessionFactory sessionFactory;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestDateBase() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		/*Resource resource = new ClassPathResource("applicationContext.xml");//鑾峰彇閰嶇疆鏂囦欢
        BeanFactory factory = new XmlBeanFactory(resource);
        UserDAO userDAO = (UserDAO)factory.getBean("userDAO");//鑾峰彇UserDAO
        User user = new User();
        user.setName("lwg");//璁剧疆濮撳悕
        user.setId(1);//璁剧疆骞撮緞
        user.setPassword("1234578");//璁剧疆鎬у埆
        userDAO.insert(user);//鎵ц鐢ㄦ埛娣诲姞鐨勬柟娉�
        System.out.println("娣诲姞鎴愬姛锛�");*/
        User admin = new User();
		admin.setId(0);
		admin.setName("admin");
		admin.setPassword("12345678");
		/*DaoSupport daoSupport = new DaoSupport();*/
		/*daoSupport.save(admin);*/
		/*ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext-common.xml");
		SessionFactory factory = (SessionFactory) context.getBean("sessionFactory");
		Session session = factory.openSession();
		Transaction transaction = session.beginTransaction();
		session.save(admin);
		transaction.commit();
		session.close();*/
		ServletContext servletContext = request.getSession().getServletContext();
		ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(servletContext);
		/*SessionFactory factory = (SessionFactory) context.getBean("sessionFactory");*/
		/*TestDateBase t = (TestDateBase) context.getBean("testDateBase");
		Session session = ((SessionFactory) t.sessionFactory).openSession();
		Session session = ss;
		Transaction transaction = session.beginTransaction();
		session.save(admin);
		transaction.commit();
		session.close();*/
		
		User user = new User();
		user.setId(0);
		user.setName("user");
		user.setPassword("000000");
		BaseDao daoSupport = (BaseDao) context.getBean("daoSupport",BaseDao.class);//要使用自定义的dao接口为接收和操作对象！！！
		daoSupport.save(user);
		/*((Transaction) context.getBean("daoSupportww")).save(user);
		HibernateTransactionManager daoSupport = (HibernateTransactionManager) context.getBean("daoSupportww");
		((Session) daoSupport).save(user);*/
		/*SessionFactory factory = (SessionFactory) sessionFactory;
		Session session =factory.openSession();
		Transaction transaction = session.beginTransaction();
		session.save(admin);
		transaction.commit();
		session.close();*/
		
		doGet(request, response);
	}
}
