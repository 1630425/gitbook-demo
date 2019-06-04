---
title: Flume修改SQLSource以针对时间戳增量数据传输
abbrlink: 3f943cf8
date: 2019-01-14 14:19:52
tags: Flume
categories: 数据采集
---
flume github关于增量数据传输的原理，是通过唯一id，递增，每次记录传输的数据量+current_index=last_index，只能识别新增数据，检测不到删除与更新。不符合没有增量id的情况。
由于数据存在时间戳标志，因此改写flume sqlsource以应对实际需求：

1\. 每次增量传输先查询数据库中当前最大的时间戳，记录为maxtime
2\. 查询数据库：select * from table where time>=current_index and time<maxtime,此时不能取到time=maxtime的数据，不排除在数据查询之后会继续生成maxtime的新数据，则会出现数据遗漏
3\. 增量数据操作完成，将current_index=maxtime，写入状态表

SQLSourceHelper增加以下两段代码：
```java
//增加取数据库最大值的代码
public String maxQuery() {
    return "SELECT max(" + time + ") FROM " + table;
  }

//增量查询oracle语句
public String buildQuery(String maxTime) {

    if (customQuery == null) {
      return "SELECT " + columnsToSelect + " FROM " + table + " " +
             "WHERE "+ time + ">=to_date('" + currentIndex + "','yyyy-mm-dd hh24:mi:ss') AND " + time + "<to_date('" + maxTime + "','yyyy-mm-dd hh24:mi:ss') " +
              "order by "+time+" asc";
    } else {
      if (customQuery.contains("$@$")) {
        return customQuery.replace("$@$", currentIndex) ;
      } else {
        return customQuery ;
      }
    }
}
```
HibernateHelper修改executeQuery方法：
```java
public List<List<Object>> executeQuery() throws InterruptedException, ParseException {
		
	List<List<Object>> rowsList = new ArrayList<List<Object>>() ;
	Query query;
	if (!session.isConnected()){
		resetConnection();
	}
			
	String sql = sqlSourceHelper.maxQuery();
	LOG.info("sql "+sql);
	List<List<Object>> max = session.createSQLQuery(sql).setResultTransformer(Transformers.TO_LIST).list();
	String maxtime = max.get(0).get(0).toString().substring(0,19);
	query = session.createSQLQuery(sqlSourceHelper.buildQuery(maxtime));		
	try {
		rowsList = query.setResultTransformer(Transformers.TO_LIST).list();
		LOG.info("Current time is "+sqlSourceHelper.getCurrentIndex()+",and lasttime is "+maxtime);
		LOG.info("Records count: "+rowsList.size());
	}catch (Exception e){
		LOG.error("Exception thrown, resetting connection.",e);
		resetConnection();
	}
	sqlSourceHelper.setCurrentIndex(maxtime);
	return rowsList;
}
```