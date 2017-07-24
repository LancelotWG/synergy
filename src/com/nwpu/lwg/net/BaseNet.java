package com.nwpu.lwg.net;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;
import org.apache.catalina.websocket.WsOutbound;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.nwpu.lwg.dao.user.UserDao;
import com.nwpu.lwg.dao.workflow.WorkflowDao;
import com.nwpu.lwg.model.project.Workflow;
import com.nwpu.lwg.model.user.User;
import com.nwpu.lwg.util.SpringTool;

@WebServlet("/ws/BaseNetAction")
public class BaseNet extends WebSocketServlet {
	private static final long serialVersionUID = 1L;
	public final Set<ChatWebSocket> users = new CopyOnWriteArraySet<ChatWebSocket>();

	public static int USERNUMBER = 1;
	public HttpSession session;
	public ServletContext applications;
	
	protected WorkflowDao workflowDao;

	@Override
	protected StreamInbound createWebSocketInbound(String arg0, HttpServletRequest arg1) {
		// TODO Auto-generated method stub
		session = arg1.getSession();
		applications = this.getServletContext();
		return new ChatWebSocket(users);
	}

	public class ChatWebSocket extends MessageInbound {

		private String username;
		private boolean single;
		private Set<ChatWebSocket> users = new CopyOnWriteArraySet<ChatWebSocket>();;

		public ChatWebSocket() {

		}

		public ChatWebSocket(Set<ChatWebSocket> users) {
			this.users = users;
		}

		@Override
		protected void onTextMessage(CharBuffer message) throws IOException {
			// 这里处理的是文本数据
			System.out.println(String.valueOf(message));
			WebApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(applications);
			String[] val1 = String.valueOf(message).split("->");
			String[] val2 = val1[2].split("\\?");
			if(val2[0].equals("userOnline")){
				for (ChatWebSocket user : users) {
					if(val1[0].equals(user.username)){
						continue;
					}
					try {
						CharBuffer temp = CharBuffer.wrap(val1[0] + "->" + val1[2]);
						System.out.println(String.valueOf(val1[2]));
						user.getWsOutbound().writeTextMessage(temp);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				return;
			}else if(val2[0].equals("synchronize")){
				if(val2[1].equals("request")){
					for (ChatWebSocket user : users) {
						if(val1[1].equals(user.username)){
							try {
								CharBuffer temp = CharBuffer.wrap(val1[0] + "->" + val1[2]);
								System.out.println(String.valueOf(val1[2]));
								user.getWsOutbound().writeTextMessage(temp);
							} catch (IOException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							break;
						}
					}
					return;
				}else{
					String[] val3 = val2[1].split("\\*");
					if(val3[0].equals("response")){
						for (ChatWebSocket user : users) {
							if(val1[1].equals(user.username)){
								try {
									CharBuffer temp = CharBuffer.wrap(val1[0] + "->" + val1[2]);
									System.out.println(String.valueOf(val1[2]));
									user.getWsOutbound().writeTextMessage(temp);
								} catch (IOException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
								break;
							}
						}
						return;
					}
				}	
			}
			/*
			 * if(this.username !=
			 * val1[0](!((User)session.getAttribute("user")).getName().equals(
			 * "lancelotwg"))){
			 */
			//workflowDao = (WorkflowDao) SpringTool.getBean("workflowDao");
			
			workflowDao = (WorkflowDao) springContext.getBean("workflowDao");
			Workflow workflow = workflowDao.getByName(val1[1]);
			Set<User> projectUsers = workflow.getUsers();
			Set<User> onlineProjectUsers = (Set<User>) applications.getAttribute(val1[1]);
			for (ChatWebSocket user : users) {
				for(Iterator<User> iterator = onlineProjectUsers.iterator(); iterator.hasNext();){
					User user1 = iterator.next();
					if (user.username.equals(user1.getName()) && !user.username.equals(val1[0])) {
						//projectUsers.remove(user1);
						try {
							CharBuffer temp = CharBuffer.wrap(val1[0] + "->" + val1[2]);
							System.out.println(String.valueOf(val1[2]));
							user.getWsOutbound().writeTextMessage(temp);
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
				}
			}
			/* } */
			/*
			 * String[] val1 = String.valueOf(message).split("\\t");
			 * if(val1[0].equals("NAME")) { String[] val2=val1[1].split("_");
			 * for(ChatWebSocket user:users){ if
			 * (user.username.equals(val2[0])){ user.username=val2[1]; } } }
			 * else if(val1[0].equals("MSG")) { String[]
			 * val2=val1[1].split("_"); for(ChatWebSocket user:users){ if
			 * (user.username.equals(val2[1])){ try { CharBuffer
			 * temp=CharBuffer.wrap(String.valueOf(message));
			 * user.getWsOutbound().writeTextMessage(temp); } catch (IOException
			 * e) { // TODO Auto-generated catch block e.printStackTrace(); } }
			 * } } else { System.out.println("ERROR"); }
			 */
		}

		public void onMessage(String data) {
			// 这里处理的是文本数据
			/*
			 * System.out.println(String.valueOf(data));
			 * 
			 * String[] val1 = data.split("_"); for(ChatWebSocket user:users){
			 * if (user.username.equals("#2")){ try { CharBuffer
			 * temp=CharBuffer.wrap(val1[2]);
			 * user.getWsOutbound().writeTextMessage(temp); } catch (IOException
			 * e) { // TODO Auto-generated catch block e.printStackTrace(); } }
			 * }
			 */

			/*
			 * String[] val1 = data.split("\\t"); if(val1[0].equals("NAME")) {
			 * String[] val2=val1[1].split("_"); for(ChatWebSocket user:users){
			 * if (user.username.equals(val2[0])){ user.username=val2[1]; } } }
			 * else if(val1[0].equals("MSG")) { String[]
			 * val2=val1[1].split("_"); for(ChatWebSocket user:users){ if
			 * (user.username.equals(val2[1])){ try { CharBuffer
			 * temp=CharBuffer.wrap(data);
			 * user.getWsOutbound().writeTextMessage(temp); } catch (IOException
			 * e) { // TODO Auto-generated catch block e.printStackTrace(); } }
			 * } } else { System.out.println("ERROR"); }
			 */

		}

		@Override
		protected void onOpen(WsOutbound outbound) {
			// this.connection=connection;

			single = true;
			this.username = ((User) session.getAttribute("user")).getName();
			for (ChatWebSocket chatWebSocket : BaseNet.this.users) {
				if (chatWebSocket.username.equals(this.username)) {
					single = false;
					break;
				}
			}
			try {
				String message = null;
				if (single) {
					message = "server" + "->" + "success->" + this.username + " websocket open success";
					users.add(this);
				} else {
					message = "server" + "->" + "error->" + this.username + " is exist";
				}
				CharBuffer buffer = CharBuffer.wrap(message);
				this.getWsOutbound().writeTextMessage(buffer);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("**************OnOpen*****************");
			System.out.println("###########websocket############");
			for (ChatWebSocket chatWebSocket : BaseNet.this.users) {
				System.out.println(chatWebSocket.username);
			}
			System.out.println("###########session############");
			System.out.println(((User) session.getAttribute("user")).getName());
			System.out.println("###########application############");
			System.out.println(applications.getAttributeNames());
			// this.username = "#" + String.valueOf(USERNUMBER);
			// USERNUMBER++;

		}

		@Override
		protected void onClose(int status) {
			if (single) {
				users.remove(this);
				/*
				 * User sessionLoginUser = (User)session.getAttribute("user");
				 * if(sessionLoginUser != null){
				 * session.removeAttribute("user"); } User applicationLoginUser
				 * = (User)applications.getAttribute(username);
				 * if(applicationLoginUser != null){
				 * applications.removeAttribute(username); }
				 */
			}
			System.out.println("**************OnClose*****************");
			System.out.println("###########websocket############");
			for (ChatWebSocket chatWebSocket : BaseNet.this.users) {
				System.out.println(chatWebSocket.username);
			}
			System.out.println("###########session############");
			if (session.getAttribute("user") != null) {
				System.out.println(((User) session.getAttribute("user")).getName());
			}
			System.out.println("###########application############");
			System.out.println(applications.getAttributeNames());
		}

		@Override
		protected void onBinaryMessage(ByteBuffer arg0) throws IOException {

		}

	}
}
