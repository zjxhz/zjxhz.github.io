---
layout: post
title: 如何实现单例模式
description: 介绍如何在Java中实现单例模式
category: articles
tags: [Java, singleton]
---

似乎很简单，如下：
{% highlight css %}
static private MyClass instance = new MyClass();
public static MyClass getInstance(){
    return instance;
}
{% endhighlight %}

或者直接使用一个public static的属性，更为简单直接：
{% highlight css %}
public static MyClass INSTANCE = new MyClass(); 
{% endhighlight %}

当然，我不会忘记把构造函数弄成私有的
{% highlight css %}
private MyClass(){
...
}
{% endhighlight %}

这样就可以了吗？如果用户用反射怎么办？一个办法是在构造函数中检查是否已经创建了一个实例，如果试图创建第二个实例就抛出一个异常。但是我觉得这么做似乎没有必要。如果说私有构造函数是为了用户不小心调用了它，而用反射？而且需要把访问属性从private改成public，这就是一种蓄意的行为了。用户这么做可能确实有他的理由吧，例如为了测试？总之我觉得不需要这种防御。

反而，如果这个类支持序列化，那么如果反序列化创建了一个新的对象怎么办？这似乎是一个比较实际的问题。那么可以通过实现readResolve()
{% highlight css %}
private Object readResolve(){
    return instance;
}
{% endhighlight %}
似乎更好，但是一般好像也用不到。

## 延迟初始化
如果这个对象的创建比较费时，而且确实成为了系统的性能瓶颈。那么可以使用延时初始化：
{% highlight css %}
static private MyClass instance;
public static MyClass getInstance(){
    if (instance == null){
        instance = new MyClass();
    }
    return instance;
}   
{% endhighlight %}

如果需要多线程安全，那么可以加上synchronized：
{% highlight css %}
static private MyClass instance;
public static synchronized MyClass getInstance(){
    if (instance == null){
        instance = new MyClass();
    }
    return instance;
}   
{% endhighlight %}

似乎可以了，但是每次获取该对象都有同步的开销。如果这导致了性能上的问题，那么可以考虑这么做：
{% highlight css %}
static private MyClass instance;
public static MyClass getInstance(){
    if (instance != null){
        return instance;
    }
    synchronizedi(this){
        instance = new MyClass();
    }
    return instance;
}
{% endhighlight %}

然而这个代码是有问题的，假设两个线程A和B，在进入这个方法时，实例都还没创建。那么接下来就会创建两个不同的实例：虽然synchronized代码块在一个时间只有一个线程可以进入。

第二，变量没有声明为**volatile**，在synchronized块之外，一个线程对该变量的修改对另外一个线程不一定可见。

所以，应该像这样：
{% highlight css %}
static private volatile MyClass instance;
public static MyClass getInstance(){
    if (instance != null){
        return instance;
    }
    synchronizedi(this){
        if(instance == null) {
            instance = new MyClass();
        }
    }
    return instance;
}
{% endhighlight %}
因为要检查两次，所以这个也叫双重检查机制。

好吧，有没有更简单的办法？答案是肯定的：
{% highlight css %}
private static class InstanceHolder{
    static MyClass instance = new MyClass();
}

public static MyClass getInstance(){
    return InstanceHolder.instance;
}
{% endhighlight %}
看起来很神奇，但这确实是线程安全的，而且没有同步的开销，代码又简单，堪称完美。基本思想是，当某个线程第一次调用getInstance的时候，InstanceHolder会第一次被引用并初始化。虚拟机可以保证这只发生一次。 后面的调用则会被现代虚拟机内联（inline），也就是很快啦。

