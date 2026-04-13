---
title: Docker
published: 2024-12-05
description: docker学习笔记
tags:
  - Docker
category: docker
draft: false
---

# 简介

Docker是一个基于Go语言的开源的应用容器引擎，允许让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口，更重要的是容器性能开销极低。

> 个人理解：docker的出现解决了大量的环境配置问题。


# 代理配置

这个很重要，因为DockerHub总是不能正常访问，可以走一些大厂的渠道拉取镜像。

> 科大镜像：**https://docker.mirrors.ustc.edu.cn/**
>  网易：**https://hub-mirror.c.163.com/**
>  阿里云：**https://<你的ID>.mirror.aliyuncs.com**
>  七牛云加速器：**https://reg-mirror.qiniu.com**

## 容器使用


