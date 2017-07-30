package com.nwpu.lwg.util;

import java.util.Iterator;
import java.util.Map;

public class JNLP {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Map<String, String> map = System.getenv();
        for(Iterator<String> itr = map.keySet().iterator();itr.hasNext();){
            String key = itr.next();
            if(key.equals("")){
            	
            }
            System.out.println(key + "=" + map.get(key));
        }
	}

}
