---
title: 关于SpringJpa中getOne方法遇到延迟加载报错no Session的问题
abbrlink: c1ba8626
date: 2018-10-11 10:02:00
tags:
---
报错如下：
```
org.hibernate.LazyInitializationException: 
could not initialize proxy - no Session
...
```
看到报错信息推测如下：遇到延迟加载，session关闭了，导致不能得到有效信息。
网上搜集了下资料，有关解释说，T getOne(ID id)依赖于EntityManager.getReference()执行实体延迟加载。
https://stackoverflow.com/questions/24482117/when-use-getone-and-findone-methods-spring-data-jpa
因为本人英文水平有限，所以用翻译软件，翻译其中一段：
```
虽然T getOne(ID id)javadoc声明（重点是我的）：

返回对具有给定标识符的实体的引用。

实际上，参考术语实际上是板，而JPA API没有指定任何getOne()方法。
因此，了解Spring包装器的作用最好的方法是查看实现：

@Override
public T getOne(ID id) {
    Assert.notNull(id, ID_MUST_NOT_BE_NULL);
    return em.getReference(getDomainClass(), id);
}
这em.getReference()是一个EntityManager声明为的方法：

public <T> T getReference(Class<T> entityClass,
                              Object primaryKey);
幸运的是，EntityManagerjavadoc更好地定义了它的意图（重点是我的）：

获取一个实例，其状态可能会被懒惰地取出。如果数据库中不存在请求的实例，则在首次访问实例状态时将引发EntityNotFoundException 。（在调用getReference时，允许持久性提供程序运行时抛出EntityNotFoundException。）除非在实体管理器打开时应用程序访问实例状态，否则应用程序不应期望实例状态在分离时可用。

因此，调用getOne()可能会返回一个延迟获取的实体。
这里，延迟提取不是指实体的关系，而是指实体本身。

这意味着如果我们调用getOne()然后关闭Persistence上下文，则实体可能永远不会被加载，因此结果实际上是不可预测的。
例如，如果代理对象是序列化的，则可以将null引用作为序列化结果获取，或者如果在代理对象上调用方法，LazyInitializationException则会引发异常，例如抛出。
因此，在这种情况下，抛出EntityNotFoundException这是getOne()用于处理数据库中不存在的实例的主要原因，因为在实体不存在时可能永远不会执行错误情况。

在任何情况下，为确保其加载，您必须在会话打开时操纵实体。您可以通过调用实体上的任何方法来完成此操作。
或者更好的替代用途findById(ID id)而不是。
```
哈哈哈，有点乱，感兴趣的还是参考上面原文链接吧。

有关于对getOne和findOne区别的说明
```
getOne API：返回对具有给定标识符的实体的引用。当我查询一个不存在的id数据时，直接抛出异常，因为它返回的是一个引用，简单点说就是一个代理对象。
findOne API：按ID查找实体。当我查询一个不存在的id数据时，返回的值是null.
```
但是新版本的JPA中，已经不存在用ID查找实体的findOne方法了，取而代之的是：\*\*findById().get()**方法。
而解决方法中，有一种是说在application.properites中加上如下配置：
```
spring.jpa.properties.hibernate.enable_lazy_load_no_trans=true
```
但是 我试了下没有效果~~，不知哪里出了问题。
所有还是采用\*\*findById().get()**来代替吧。