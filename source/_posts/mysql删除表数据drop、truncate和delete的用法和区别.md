---
title: MySQL删除表数据DROP、TRUNCATE和DELETE的用法和区别
abbrlink: fd4a1da4
date: 2010-05-30 14:21:46
tags: MySQL
categories: 数据库
---
# 程度从强到弱
## drop table tb 
drop将表格直接删除，没有办法找回
## truncate (table) tb
删除表中的所有数据，不能与where一起使用
## delete from tb (where)
删除表中的数据(可制定某一行)
# 区别：truncate和delete的区别
         1、事务：truncate是不可以rollback的，但是delete是可以rollback的；
            原因：truncate删除整表数据(ddl语句,隐式提交)，delete是一行一行的删除，可以rollback，效率上truncate比delete快，但truncate删除后不记录mysql日志，不可以恢复数据。
         2、效果：truncate删除后将重新水平线和索引(id从零开始) ,delete不会删除索引，truncate相当于保留mysql表的结构，重新创建了这个表，所有的状态都相当于新表。
         3、truncate 不能触发任何Delete触发器。
         4、delete 删除可以返回行数