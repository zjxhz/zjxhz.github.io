---
layout: post
title: Java多线程知识小结
description: 阅读《Effective Java》并结合自己的经验摘录的笔记，帮助自己快速回顾已有的知识
category: articles
tags: [Java, multi-thread, notes]
image:
  feature: texture-feature-04.jpg
  credit: Texture Lovers
  creditlink: http://texturelovers.com
---

这里记录的是一些关键知识点，或者是自己不太熟悉的部分，以帮助自己快速地回顾。

### 多线程修改的可见性
多线程访问必须用**synchronized**，除非用**volatile**   
volatile保证一个线程的修改对于另外一个线程可见，但是对于非原子操作，例如自加++操作，仍然需要用synchronized  
一种方式是用java.util.concurrent.atomic包里的类来实现原子自增  
这里还需要注意的是，虽然虚拟机保证对于读写某些类型，如Boolean是一个原子操作，但为了保证一个线程的修改对另外一个线程可见，仍然需要使用synchronized或者volatile

### 同步的时机
不要对客户端代码，即你不知道会如何实现的代码做同步，因为可能会引起死锁等问题。
始终对修改静态变量的方法做同步

### 避免使用Thread
和Objective-C类似，thread是比较比较底层的类。因此可以使用executor和task来代替thread。  
有单线程的executor，多线程的如固定线程数的线程池，以及cached线程池，即每次会启动新的线程，如果无空闲线程的话。  
callable跟runnable差不多，前者返回一个结果。ScheduledThreadPoolExecutor可以代替timer，是个多线程的定时器
延生阅读：**Java Concurrency in Practice**

### concurrentcy工具类
ConcurrentHashMap代替Collections.synchronizedMap或 Hashtable，会有性能上的提升。HashMap是非线程安全的。  
BlockingQueue的take操作会在队列空的时候等待，所以可以用来实现生产者-消费者模式。  
CountDownLatch可以设置一个初始计数，调用了latch.await()方法的线程会一直阻塞直到latch的计数（被其他线程）置为0。可以用来设计某个操作需要等待另一个操作执行n遍，或者n个任务各执行一遍。  
如果使用wait和notify，那么在wait之前需要先检查某个条件是否满足，否则可能其他线程已经调用过notify，那么当前线程将永远无法被唤醒。wait之后需要重新检查条件（这里可以用while循环），因为：

- 另外一个线程在notify和本线程被线程被唤醒之前获得了锁，或
- 另外一个线程不小心调用了notify，或者notifyAll，或
- 线程自动被唤醒（极少）

### 文档化
类是否线程安全需文档化。分为线程安全，非线程安全，有条件的线程安全，例如Collections.synchonizedXyz创建的集合类，其iterator必须同步。而如ConcurrentMap则不必同步

### 延迟初始化
对于静态变量，可以用一个静态内部类的**类变量**保存该静态变量，并在外部类的get中返回即可。对于实例变量，使用**双重检查**机制：首先检查变量是否赋值，如未赋值，加锁，再次检查是否赋值，如未赋值则赋值，解锁

### 其他
避免在线程上做无用的等待，如同步，不要用Thread.yield，因为不可移植。另外，设置线程的优先级也没有什么用  
避免使用线程组，因为其设计缺陷。Thread.setUncaughtExceptionHandler和有线程池的executor是替代品。 

### 待学习
**非阻塞同步**
 
