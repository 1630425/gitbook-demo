---
title: MySQL循环批量插入数据
abbrlink: f02121e8
date: 2010-05-31 14:37:03
tags: MySQL
categories: 数据库
---
``` mysql
TRUNCATE TABLE a; #清空表数据
DROP PROCEDURE IF EXISTS proc_init_data; #如果存在此存储过程则删掉
DELIMITER $ -- 使用delimiter后，将不把分号当做语句结束，会将该段整个提交
CREATE PROCEDURE proc_init_data()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i<=10000 DO
        INSERT INTO a (`name`) VALUES (i);
        SET i = i+1;
    END WHILE;
END $
CALL proc_init_data();

```