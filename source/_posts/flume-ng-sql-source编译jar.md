---
title: flume-ng-sql-source编译jar
abbrlink: 30026bfd
date: 2019-01-28 18:07:16
tags: [Flume,flume-ng-sql-source]
categories: 数据采集
---
# 编译
项目地址：https://github.com/keedio/flume-ng-sql-source
Flume-ng-sql-source 1.5.2下载地址：https://codeload.github.com/keedio/flume-ng-sql-source/tar.gz/v1.5.2
``` shell
tar -xzvf flume-ng-sql-source-1.5.2.tar.gz
cd flume-ng-sql-source-1.5.2/
mvn install -DskipTests -Dtar
cd target
```
将flume-ng-sql-source-1.5.2.jar复制到FLUME_HOME/lib。
编译后的flume-ng-sql-source-1.5.2.jar，下载地址：http://wangpant.cn/resource/view/hxgyv4nhjwqs.html