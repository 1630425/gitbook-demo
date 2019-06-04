---
title: 基于docker-compose搭建分布式消息队列Kafka
abbrlink: 7fb66013
date: 2017-11-24 22:33:34
tags: [Docker,Docker Compose,Kafka]
categories: 消息队列
---
本文基于Docker Compose搭建一套单节点的Kafka消息队列，Kafka依赖Zookeeper为其管理集群信息，虽然本例不涉及集群，但是该有的组件都还是会有，典型的kafka分布式架构如下图所示。本例搭建的示例包含Zookeeper + Kafka + Kafka-manger

Kafka官网：

http://kafka.apache.org/

# 重要概念

## 生产者(Producer)

## 消费者(Consumer)

消费消息。每个consumer属于一个特定的consumer group。使用consumer high level API时，同一个topic的一条消息只能被同一个consumer group内的一个consumer消费，但多个consumer group可同时消费这一消息。

## 集群(Cluster)

宏观来看，Kafka主体包含的就是三部分: 生产者、消费者和集群，一个集群就是多个Broker的集合。

## Broker

已经发布的消息就会保存在集群中的某个Broker中去。

## Topic

用来区别message的种类，比如很多时候，与A相关的日志统一的topic定义为A，B相关的日志统一的topic定义为B，这样就不用一个一个单独地订阅了。物理上不通topic的消息分开存储，逻辑上一个topic的消息虽然保存于一个或多个broker上，但是用户只需指定消息的topic即可生产或消费数据而不必关心数据在哪里。

## Partition

Kafka中每个Topic都会有一个或多个Partition，他是Kafaka数据存储的基本单元，每个Partition对应一个文件夹，文件夹下存储这个Partition的所有消息和索引。Kafka内部会根据算法得出一个值，根据这个值放入对应的partition目录中。所以读取时间复杂度为O(1)。分区的每一个消息都有一个连续的序列号叫做offset，用来在分区中唯一标识这个消息。一个topic可以保存在多个partition。

## Segment

一个partition由多个Segment组成，一个Partition代表一个文件夹，一个Segment则代表该文件夹下的文件。Segment有大小限制，由log.segment.bytes 定义。

# 安装
## Docker Compose方式安装
docker-compose.yml文件:
```docker
version: '2'
services:
  zookeeper:
    image: wurstmeister/zookeeper
    environment:
      JMX: 9000
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka  #这个镜像使用文档见https://github.com/wurstmeister/kafka-docker
    ports:
      - "9092:9092"
    expose:
      - "9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: 10.19.131.157  #docker宿主机的IP，直接ifconfig获取，这是重点，否则，在容器内部启动生产者消费者都会失败的
      KAFKA_CREATE_TOPICS: "test:1:1"  #自动创建一个默认的topic
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"  #禁用掉自动创建topic的功能，使用上面的镜像，kafka的参数设置都可以以这样的方式进行设置
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
  kafka-manager:
    image: sheepkiller/kafka-manager  #如果要安装web管理工具可以同时安装这个，最后通过宿主机IP的9000端口进行访问，例如http://127.0.0.1:9000/
    links:
      - kafka
      - zookeeper
    environment:
      ZK_HOSTS: zookeeper:2181
      APPLICATION_SECRET: "letmein"
    ports:
      - "9000:9000"
    expose:
      - "9000"
```
**安装命令:**
```docker
#默认只会有一个kafka实例
docker-compose up -d
/*  运行kafka集群模式 */
/*  由于指定了kafka对外暴露的端口号，增加集群节点会报端口冲突的错误，请将kafka暴露的端口号删掉后再执行如下命令 动态端口：将- "9092:9092"更改为- "9092"，去掉expose:- "9092"，这种会生成动态端口；非动态端口，就是自己指定端口和对应实例个数即可 */
/*  自己指定kafka的节点数量 */
#将kafka实例增加到n个，推荐使用3个，就能直接建立一个集群
docker-compose scale kafka=3
# 暂停所有容器
docker-compose stop
# 开启所有容器
docker-compose start
# 删除所有容器
docker-compose rm -f		
```
## web
Kafka Manager
http://127.0.0.1:9000/
<pre>
Cluster——》addCluster——》Cluster Name——》my-kafka
                        Cluster Zookeeper Hosts——》zookeeper:2181
</pre>                        
其他默认即可，Save
## kafka命令
```docker
docker exec -it data_kafka_1 bash
```
kafka-console-consumer.sh
```docker
#启动一个消费者，监听test这个topic
kafka-console-consumer.sh --bootstrap-server 10.19.131.157:9092 --from-beginning --topic test
```
kafka-console-producer.sh
```docker
#启动一个生产者，直接输入消息回车即可发送消息了
kafka-console-producer.sh --broker-list 10.19.131.157:9092 --topic test```
kafka-consumer-groups.sh
```docker
#查看新消费者列表
kafka-consumer-groups.sh --new-consumer --bootstrap-server 10.19.131.157:9092 --list
#查看某消费者的消费详情，这里的消费者名称就是kafka-python-default-group
kafka-consumer-groups.sh --new-consumer --bootstrap-server 10.19.131.157:9092 --describe --group kafka-python-default-group```
kafka-producer-perf-test.sh自带的压测工具
```docker
#总共100条数据，每条大小是1
kafka-producer-perf-test.sh --topic test --num-records 10000 --record-size 1 --throughput 100  --producer-props bootstrap.servers=10.19.131.157:9092```
kafka-topics.sh
```docker
#列出所有的topic
kafka-topics.sh --list --zookeeper zookeeper:2181
#查看集群描述
kafka-topics.sh --describe --zookeeper zookeeper:2181
```
# 安全认证

Kafka可以配合SSL+ACL来进行安全认证: http://orchome.com/185
# TroubleShooting
容器内部启动生产者出现错误:```log[2016-12-26 03:03:39,983] WARN Error while fetching metadata with correlation id 0 : {test=UNKNOWN_TOPIC_OR_PARTITION} (org.apache.kafka.clients.NetworkClient)```

是因为docker-compose文件里面的宿主讥IP设置出错，如果是动态IP的话就没办法了，只能删除重新创建了