---
layout: post
title: iOS面试题
description: 网上找到的一些面试题以及自己的解答
category: articles
tags: [iOS, interview, 面试, 题目]
image:
  feature: 01.jpg
---

最近在找iOS开发相关的工作，偶尔看到[一篇文章](http://www.raywenderlich.com/53962/ios-interview-questions)讲了一些典型的iOS面试题目。觉得挺有意思，顺便可以测试下自己的iOS知识掌握程度，并做一些记录。这篇文章是一个系列中的一篇，讲的不止是面试题目，还包括如何准备简历以及如何应对面试中的一些场景等。关于题目，其实这里面给出的不多。因为作者总共有大约70多个随机的题目用来面试，不方便透露太多。

虽然问题不多，但是也可以看到自己的一些比较薄弱的知识环节，或者从来没有去认真考虑过的问题。我学习Objective-C的时间不长，而且没有很系统地去学，基本上都是边做边学，用到了才去学（也就是Learn by doing），所以很多知识掌握并不牢固，这里给出的参考解答不少也是需要去查了资料才知道，还不一定正确。

### 关于我
如果你恰好有iOS开发相关的工作或者项目，[这里]({{ site.url }}/about)有更多关于我的信息。


## 题目

### 什么是method swizzling以及用法？

说实话我从来没有用过**method swizzling**，连听说也没有听说过。简单查了下资料，意思是比较简单的，就是可以用一个你自己写的方法来替换某个第三方类的某个方法的实现。背后的原理应该就是动态修改了类的方法指针。听起来像是一个奇怪的语言特性，在我的工作中似乎不太用得到，个人觉得这是把双刃剑。例如对封装的破坏，类的继承一定程度上已经是有悖于封装原则的，除非一个类本身就专为继承而设计，然而仍需十分小心。

Method swizzling就更是如此，一般都是替换非特意为继承而设计的类的方法。Apple就曾经给出警告，拒绝某些替换Apple SDK方法的应用上架。当然Method swizzling还是有一定使用场景，比如为方便调试，为系统方法加入调式信息，或者为所有的UIView画出边框，例如[这篇文章](http://darkdust.net/writings/objective-c/method-swizzling)所说的那样。或为方便自动化的单元测试，替换需要网络连接的方法转而从本地文件读取结果，参考[这篇文章](http://www.icodeblog.com/2012/08/08/using-method-swizzling-to-help-with-test-driven-development/)。但是我觉得，为了让代码可测，让类依赖于某个抽象而不是具体实现是不是更好呢？需要测试的时候将该抽象替换为可测的实现？

### A retain B，B retain C，C retain B。如果A release了B会怎么样？
我开始iOS开发的时候，ARC已经存在了，而且是推荐的内存管理方式。所以对于手动的内存管理我了解的并不是很多。对于这个问题，我觉得B和C因为互相retain，所以并没有释放。这在ARC下也是如此，B和C存在强循环引用，因此也是无法被释放的，解决的办法是将其中的一个引用改成弱引用，例如B到C的引用。

### What happens when you invoke a method on a nil pointer? 
这个问题相对简单，但是据说能回答出来的人不多。和许多其他语言不同，Objective-C下这个调用没有任何效果。在其他语言中，可以设置类似的Null类是实现相同的功能，然而我认为这可能并不是在任何情况下都是合理的。因为有时候，快速的失败并抛出异常可以让我们更早地解决问题，而不是安静地失败。

### Give two separate and independent reasons why retainCount should never be used in shipping code. 
因为我一直在用ARC，所以其实我根本用不到retainCount。但是为了回答这个问题，谁知道哪天我会需要去维护非ARC的代码呢？简单来讲，你永远无法确保retainCount返回什么，它甚至永远也不会返回0。甚至有个专门的[网站](http://whentouseretaincount.com/)来说这个事情，里面还有一些相关的链接。

### Explain your process for tracing and fixing a memory leak.
这个说来话长了，而且在ARC下，内存泄露的情况出现得比较少。但也不是没有，比如强循环引用，或不小心retain了自己实际上用不到的对象。大概的步骤就是，试着重现问题，比如不停地push然后pop一个controller，看内存是否增长，然后找出内存增长最大的部分，看代码分析，再profile。或许哪天我又遇到类似的问题会把详细的结果记录下来。

### Explain how an autorelease pool works at the runtime level.
不确定想问什么，autorelease pool不就是给调用了autorelease的对象在pool结束的时候吗？使用的场景就是对于你创建但不想马上释放的对象，比如一个方法的返回值。对于ARC而言，一般不需要自己创建autorelease pool，除了[这篇文章](https://developer.apple.com/library/mac/documentation/cocoa/conceptual/memorymgmt/articles/mmAutoreleasePools.html)指出的几种情况。其中一种是当创建了自己的thread的时候，但是好像对于多线程任务，不建议直接使用thread这样的底层API，而是GCD这样的高级API来完成。

### When dealing with property declarations, what is the difference between atomic and non-atomic?
简单来讲，atomic保证属性可以被多个线程“原子性”地访问。也就是说，不存在读取或者写入一个不完整的值。可能你一开始根本不会觉得这是个问题。但事实上，类似于Java语言，某些变量如长整形的读写并不是原子的。所以这和Java语言中的volatile关键字又有所不同。volatile只能保证一个线程的修改对于另外一个线程可见，但是对于非原子的读写，需要用synchronized关键字。而atomic关键字则同时保证了这两点，但这并不意味着它就是线程安全的。具体可参考[Apple官方文档](https://developer.apple.com/library/ios/documentation/cocoa/conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html)中关于不同线程设置一个人的姓和名的例子。

### In C, how would you reverse a string as quickly as possible?
这个没有什么好说的，我对C不熟。因为这看起来是个很常用的操作，所以我会先查找是否有系统函数已经支持。如果没有，我会谷歌现成代码。如否非要我自己写，那么大概就是从一边开始循环，与后面的字符交互位置，直到中间位置。可能我没法一下子把它作对，但是稍微调式一下——如果允许的话，是挺简单的。不确定是否是最快的办法。

### Which is faster: to iterate through an NSArray or an NSSet?
关于这个问题，我还真不知道。但我的猜测是NSArray会更快，因为数组一般是有序的，迭代只需要简单地把指针增加一个值即可；但是NSSet是无序的，而且为了查找上的性能，还需要保存对象的hash值，所以实现上应该是链表，自然会慢一点。[这篇文章](http://www.cocoawithlove.com/2008/08/nsarray-or-nsset-nsdictionary-or.html)的测试结果似乎验证了我的猜测。

### Explain how code signing works. 
不知道具体是想问什么。我的理解是代码签名是需要首先在Apple那里生成并下载证书，然后给代码签名，以标明该代码编译出来的可执行文件，例如app，确实是我这个开发人员编写的。增加了app的可信度。如果后面如果出了问题，也很容易查找得到。

### What is posing in Objective-C?
说实话，还是没听说过这个东西。查了一下，跟method swizzling类似，不过method swizzling只是替换某个类的某个方法，但是posing则可以替换掉整个类的实现。又一个奇怪的语言特性。我觉得一般的app应该用不到这样的特性，工具类可能会有点用。另外，在OS X v10.5已经被废弃，可能是把语言弄得太复杂但是又没多少用处吧

### List six instruments that are part of the standard.
这个是问template吗？我只用过time profiler和leaks

### What are the differences between copy and retain? 
copy创建一个新的对象并且引用计数+1，retain并不创建新的对象

### What is the difference between frames and bounds?
简单来讲，frame是相对于superview的，bounds则是相对于自己的。所以默认情况下，bounds的左上角是(0,0)，size和frame一致（除非view旋转）。相对于自身的bounds有什么用？你可能会问。其实它对于subview更有意义。举个简单的例子，如果你在view A的(0,0)处添加一个subview B，那么A和B左上角重合。如果你用setBounds设置A的左上角为(-20,-20)，那么B的左上角离A的左上角横竖距离都是20。因为你修改了A的左上角坐标为(-20,-20)

### Ball *ball = [[[[Ball alloc] init] autorelease] autorelease]; 会发生什么？
正如作者所言，会crash。因为alloc只增加一个引用计数，而autorelease两次则会过度释放，从而导致“未定义行为”。时机是在退出第二个autorelease pool的时候

### List the five iOS app states. 
我只知道前台，后台这两个状态，显而易见的。查了资料知道还有这么几个状态

- 未运行（Not running）。也就是非运行或者被杀掉的状态
- 非活跃（Inactive）。在前台但是没有执行任何代码，比如可能在sleep什么的。前台的另外一个状态是活跃（Active）
- 挂起（Suspended）。在后台并且没有运行。在后台但是仍然可以运行一段时间的就叫后台状态（Background）。

### 其他的一些基本概念
文章前面还提到了一些基本的概念，比如：

- messaging: 其实就是函数调用，不同的是增加了一个抽象层，被调用的函数不一定非要在编译的时候存在，可以在运行时动态添加。
- 动态类型：其实Objective-C算不上动态类型吧，因为有编译时的静态类型检查。所谓动态，无非是比如运行时某些类或者方法可以动态添加和修改。
- 消息转发。背后的思想也很简单，就是在调用一个对象的某个函数（或者说发送消息）的时候该函数未实现，默认的做法是直接抛出异常，但是你可以修改这种行为，把该调用（或者消息）转发到另外一个对象或者直接忽略。没用过，而且使用场景还没有想到。

## 参考资料

- [Apple’s Objective-C guides](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)
- [Learning Objective-C: A primer](http://developer.apple.com/library/mac/#referencelibrary/GettingStarted/Learning_Objective-C_A_Primer/_index.html)
- [The Objective-C Programming Language](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ObjectiveC/Introduction/introObjectiveC.html)
