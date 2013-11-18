---
layout: post
title: Objective-C并发编程
description: Objective-C并发编程的一些知识点
category: articles
tags: [iOS, Objective-C, concurrect, 并发]
image:
  feature: 01.jpg
---
说到并发编程，可能最先想到的是多线程。而直接操作“线程”，即Thread，并非Objective-C推荐的方式，因为它属于比较底层的东西，比如你需要自己去创建并控制线程的数目，要处理线程之间的同步（例如用锁），而且难以利用多核的优势。

然而，如果你的程序对实时性有比较高的要求，可以考虑使用线程。

Objective-C推荐使用GCD(Grand Center Dispatch)或者**Operation queue**来实现异步的任务。

### GCD(Grand Center Dispatch)
你只需要定义“任务”并将其添加到适当的**事件派发队列(Dispatch queue)**即可。GCD会帮你创建必要的线程，并做可能的优化。

GCD使用block来定义任务，并且预先定义了一些派发队列。例如支持并发任务的不同优先级的队列，和主队列——对于UI程序而言，这是渲染图形界面的线程，不要把耗时的操作放在这里。对于顺序执行的队列，你必须手动创建。

对于手动创建的队列，必须要用*dispatch_retain*和*dispatch_release*来retain和release，即使你用了ARC

### Opeartion queue
与**Dispatch queue**类似，不同的是它使用**NSOperationQueue**对象来管理任务，任务之间可以定义依赖以保证执行的顺序。这在很大程度上可以避免锁的使用。任务还可以定义优先级和被取消。

## 参考资料
- [Concurrency Programming Guide](https://developer.apple.com/library/ios/DOCUMENTATION/General/Conceptual/ConcurrencyProgrammingGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008091-CH1-SW1)




