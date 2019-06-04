---
title: Shell在文本第一行和最后一行添加字符串
abbrlink: '17657829'
date: 2017-12-16 13:04:54
tags: Shell
categories: Linux
---
```shell
sed -i '1i 添加的内容' file  #这是在第一行前添加字符串
sed -i '$i 添加的内容' file  #这是在最后一行行前添加字符串
sed -i '$a添加的内容' file  #这是在最后一行行后添加字符串
echo "添加的内容" >> file  #这是在最后一行行后添加字符串
```