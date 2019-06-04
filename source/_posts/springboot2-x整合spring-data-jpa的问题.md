---
title: springboot2.x整合spring-data-jpa的问题
abbrlink: ff34caee
date: 2018-12-06 13:28:00
tags:
---
今天使用springboot整合spring-data-jpa遇到一些问题，直接使用JpaRepository的getOne()方法是会报错的。报错信息为：org.hibernate.LazyInitializationException: could not initialize proxy - no Session。在SpringBoot1.xx版本应该使用findOne()方法根据主键来查找对象。

# 这里是findOne和getOne的区别

getOne API：返回对具有给定标识符的实体的引用。当我查询一个不存在的id数据时，直接抛出异常，因为它返回的是一个引用，简单点说就是一个代理对象。

findOne API：按ID查找实体。当我查询一个不存在的id数据时，返回的值是null.

详细对比参考[这里](https://1630425.github.io/posts/c1ba8626.html)。

但是新版本的JPA中，已经不存在用ID查找实体的findOne方法了，取而代之的是：**findById().get()**方法。
# spring配置如下
```yml
spring:
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://127.0.0.1:3306/jpa?useUnicode=true&characterEncoding=UTF8
    driver-class-name: com.mysql.cj.jdbc.Driver


  jpa:
    hibernate:
  #更新数据表结构
      ddl-auto: update
    show-sql: true
    open-in-view: true
```
# 实体类
```java
package com.wang.springboot06jap.entity;

import javax.persistence.*;

//使用JPA注解配置映射关系
@Entity
@Table(name = "tbl_user") //配置表名，若省略则默认表名是user
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //自增主键
    private Integer id;
    @Column(name = "lastName",length = 20)  //若省略就是属性名
    private String username;
    private String email;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```
# Reposity
```java
public interface UserRepository extends JpaRepository<User,Integer> {

}
```
# 调用JPAReposity的方法
```java
@Controller
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/user/{id}")
    @ResponseBody
    public User getUser(@PathVariable("id") Integer id){
        User user = userRepository.findById(id).get();
       // System.out.println(userRepository.getOne(id));

        //
        return user;
    }
}
```