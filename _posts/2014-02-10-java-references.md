---
layout: post
title: Java引用类型
description: 介绍Java的引用类型：strong reference, soft reference, weak reference, phantom reference
category: articles
tags: ['Java', 'Reference']
---

## Strong reference（强引用）
强引用是默认的，也是最常见的引用类型。如下代码：
{% highlight css %}
Object obj = new Object();
{% endhighlight %}
创建了一个Object对象，其中obj是一个强引用。任何对象只要存在强引用，是无法被垃圾回收的。大多数条件下，这正是我们想要的。但是可能有些时候，你会需要其他的引用类型。

## Weak reference（弱引用）
可以通过如下代码创建一个弱引用
{% highlight css %}
Object obj = new Object();
Reference<Object> wr = new WeakReference<Object>(obj);
{% endhighlight %}

若要取回该引用对象，可以
{% highlight css %}
Object obj = wr.get();
{% endhighlight %}

只存在弱引用的对象，会被垃圾回收。所以对于get方法返回的对象，需要检查是否为null。WeakHashMap的key是一个弱引用，可以被回收。因此可能有的人觉得可以拿来实现cache。但是除了内存是被自动管理之外，WeakHashMap并不适合用来实现cache。因为首先，弱引用的是key，而不是value。其次，key被回收的时机是当没有强引用存在的时候，这跟cache本身的需求不太一样。例如你无法选择缓存策略，失效时间等。

我这里能想到的一个比较适合应用弱引用的场景是：观察者模式。想象一个天气应用，有不同的视图展示。每个视图（观察者）都需要监听天气如温度的变化，然而这种监听只在该视图显示出来的时候才有必要。当然，你可以在视图隐藏的时候把它从观察者列表中移除，然而如果使用了若引用，便可以自动获得这个功能——前提是被隐藏了的视图在其他地方没有强引用。


## Soft reference（软引用）
软引用和弱引用类似，不同之处在于软引用只有在内存紧张的时候才会被垃圾回收。

## Phantom reference（幽灵引用）
幽灵引用是最弱的一种引用，调用get()永远返回null。那么它有什么用呢？这就必须要提到ReferenceQueue

## Reference queue（引用队列）
要创建一个PhantomReference对象，不仅要传入被引用的对象，还必须传入一个ReferenceQueue对象。对于其它两种引用类型，ReferenceQueue是可选的。ReferenceQueue具体的作用是，当被引用的对象被垃圾回收之后，相应的引用类型对象（如弱引用）会被加入到引用队列。这可以让你得知对象被回收的时机。其中幽灵引用只有在被引用对象被完全移出物理内存之后才会被添加到引用队列，而其余二者则再被认为是**可回收的**就被加到引用队列。所以理论上，你可以在finalize方法中增加对被引用对象的强引用从而阻止其被回收——然而这么做实在没有什么必要。


