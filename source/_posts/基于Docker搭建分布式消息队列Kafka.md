---
title: 基于Docker搭建分布式消息队列Kafka
abbrlink: 4d1930e3
date: 2017-11-23 22:33:34
tags: [Docker,Kafka]
categories: 消息队列
---
本文基于Docker搭建一套单节点的Kafka消息队列，Kafka依赖Zookeeper为其管理集群信息，虽然本例不涉及集群，但是该有的组件都还是会有，典型的kafka分布式架构如下图所示。本例搭建的示例包含Zookeeper + Kafka + Kafka-manger

Kafka官网：

http://kafka.apache.org/

重要概念

生产者(Producer)

消费者(Consumer)

消费消息。每个consumer属于一个特定的consumer group。使用consumer high level API时，同一个topic的一条消息只能被同一个consumer group内的一个consumer消费，但多个consumer group可同时消费这一消息。

集群(Cluster)

宏观来看，Kafka主体包含的就是三部分: 生产者、消费者和集群，一个集群就是多个Broker的集合。

Broker

已经发布的消息就会保存在集群中的某个Broker中去。

Topic

用来区别message的种类，比如很多时候，与A相关的日志统一的topic定义为A，B相关的日志统一的topic定义为B，这样就不用一个一个单独地订阅了。物理上不通topic的消息分开存储，逻辑上一个topic的消息虽然保存于一个或多个broker上，但是用户只需指定消息的topic即可生产或消费数据而不必关心数据在哪里。

Partition

Kafka中每个Topic都会有一个或多个Partition，他是Kafaka数据存储的基本单元，每个Partition对应一个文件夹，文件夹下存储这个Partition的所有消息和索引。Kafka内部会根据算法得出一个值，根据这个值放入对应的partition目录中。所以读取时间复杂度为O(1)。分区的每一个消息都有一个连续的序列号叫做offset，用来在分区中唯一标识这个消息。一个topic可以保存在多个partition。

Segment

一个partition由多个Segment组成，一个Partition代表一个文件夹，一个Segment则代表该文件夹下的文件。Segment有大小限制，由log.segment.bytes 定义。

#获取镜像

- zookeeper镜像：zookeeper:3.4.9
- kafka镜像：wurstmeister/kafka:0.10.2.0
- kafka-manager镜像：kafka-manager:latest

# **建立Zookeeper容器**

这里我们用最简单的方式创建一个独立的Zookeeper节点，如果要考虑zookeeper的高可用，可以将其做成一个集群，最好是能有多台机器。
```docker
docker run --name some-zookeeper \
--restart always \
-p 2181:2181 \
-d zookeeper
```

默认的，容器内配置文件在，/conf/zoo.cfg，数据和日志目录默认在/data 和 /datalog，需要的话可以将上述目录映射到宿主机的可靠文件目录下。详情参考[Zookeeper官方镜像](https://hub.docker.com/_/zookeeper/)

# **建立kafka节点**

这里同样只做一个简单的单点kafka
```docker
docker run --name kafka \
-p 9092:9092 \
-e KAFKA_ADVERTISED_HOST_NAME=kafka01 \
-e KAFKA_CREATE_TOPICS="test:1:1" \
-e KAFKA_ZOOKEEPER_CONNECT=10.19.131.157:2181 \
-d  wurstmeister/kafka
```

详情参考[Kafka官方镜像](https://hub.docker.com/r/wurstmeister/kafka/)

# **创建Kafka管理节点**

kafka-manager有图形化UI，可以方便的监控集群状态，调整队列配置
```docker
docker run -itd \
--restart=always \
--name=kafka-manager \
-p 9000:9000 \
-e ZK_HOSTS="10.19.131.157:2181" \
sheepkiller/kafka-manager
```

容器启动以后访问主机的9000端口，http://127.0.0.1:9000

# 读写验证

读写验证的方法有很多，这里我们用kafka容器自带的工具来验证，首先进入到kafka容器的交互模式：
```docker
docker exec -it kafka /bin/bash
```

- 创建一个主题：
```docker
/opt/kafka/bin/kafka-topics.sh --create --zookeeper 10.19.131.157:2181 --replication-factor 1 --partitions 1 --topic my-test
```

- 查看刚创建的主题：
```docker
/opt/kafka/bin/kafka-topics.sh --list --zookeeper 10.19.131.157:2181
```

- 发送消息：
```docker
/opt/kafka/bin/kafka-console-producer.sh --broker-list  10.19.131.157:9092 --topic my-test
```

- 读取消息：
```docker
/opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server 10.19.131.157:9092 --topic my-test --from-beginning
```

参考：[https://kafka.apache.org/quickstart](https://kafka.apache.org/quickstart)