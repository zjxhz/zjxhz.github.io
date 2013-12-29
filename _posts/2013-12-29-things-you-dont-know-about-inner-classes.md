---
layout: post
title: 关于Java内部类你不知道的几件事 
description: 
category: articles
tags: ['java', 'inner classes']
---

## 种类
你也许在一个类里面定义过另外一个类，所以它就是你理解的内部类，是吗？记性好一点的会说出这分**静态内部类**和**非静态内部类**，有的人还能说出**匿名内部类**。这是全部的了吗？其实还有一个**本地内部类（Local Inner Class）**，就是在一个方法中定义中的类。说实话，我在工作中从来没有用过最后一种，连见都没见过。若不是为了面试特地去看了一下书，说不定我到现在也还不知道（以后会不会用到就更不知道了）。

### 静态内部类
静态内部类在一定程度上只是一种信息的隐藏，即只有通过外部类才能访问到内部的那个类。而这个静态内部类可以访问到外部类的静态属性和方法。静态内部类是属于比较简单的内部类，相对于非静态内部类，一般更推荐使用静态内部类。有兴趣可以参考《Effective Java》的「Item22: Favorstaticmemberclassesovernonstatic」。

所以这里会更多地讨论比较复杂的其他内部类——不是因为它们更为有用，而是因为它们是面试官更喜欢问的问题，所以不管怎样你也要知道一点。

### 非静态内部类

#### 初始化

我们知道，初始化一个非静态内部类需要一个外部类的实例。可是这到底是什么意思？要怎么样才能创建呢？假设有如下两个类：
{% highlight css %}
class Outer {
    class Inner {
    }
}
{% endhighlight %}
如果像这样初始化：
{% highlight css %}
Inner innter = new Inner();
{% endhighlight %}
如果这段代码是在Outer类的代码内，那么不会有任何问题。否则你会得到一个编译错误。所以正确的做法应该是像这样：
{% highlight css %}
Outer outer = new Outer();
Inner innter = outer.new Inner();
{% endhighlight %}
有点奇怪的语法，但确实是如此。

#### 继承非静态内部类
你可能会尝试这么做：
{% highlight css %}
class InnerSubClass extends Outer.Inner{   
}
{% endhighlight %}
当然，这样无法编译。问题是Inner类需要一个Outer类的实例才能初始化。这个实例从哪里来呢？无从得知。正确的语法应该是像这样：
{% highlight css %}
class InnerSubClass extends Outer.Inner{
    public InnerSubClass(Outer outer) {
        outer.super();
    }
}
{% endhighlight %}
这个语法看起来更奇怪。是这样的：如果InnerSubClass继承自一个非静态内部类，那么其构造函数只需要调用基类的super()即可（一般由编译器自动帮你完成）。但是偏偏InnerSubClass继承自一个非静态内部类，所以不能简单地调用super()，而需要绑定一个外部类的实例，即outer。再调用super()——其实就是调用Inner的构造函数。

可能你永远也不需要用到这么奇怪的语言特性，但不保证面试官不会问你这样的问题哦。其实我这里没有介绍全部，如果InnerSubClass本身是继承自Outer，那么InnerSubClass的内部类如果继承Inner的话语法又会不太一样。感兴趣自己可以去找资料看下，我不想把你逼疯。

#### 重写（Overwrite）内部类？
既然是内部类，那么有没有可能在子类中重写这个类呢？亦即如下代码：
{% highlight css %}
class Outer {
    class Inner {
        void f() {
            System.out.println("Outer.Inner.f()");
        }
    }
}

class OuterSub extends Outer {
    class Inner {
        void f() {
            System.out.println("OuterSub.Inner.f()");
        }
    }
}

public class InnerClassExamples {
    public static void main(String[] args) {
        Outer outer = new OuterSub();
        outer.new Inner().f();
    }
}
{% endhighlight %}
你可能期望结果是**OuterSub.Inner.f()**，毕竟outer是**OuterSub**的一个实例。但是，你错了。没法通过这种方式重写内部类。

#### 基类的方法还是外部类的方法？
因为内部类可以调用外部类的任何方法，如果该内部类继承了一个包含了同名方法的基类，那么到底哪个方法会被调用呢？如下：
{% highlight css %}
package innerclasses;

class Base{
    void f(){
        System.out.println("Base.f()");
    }
}

class Outer {
    void f() {
        System.out.println("Outer.f()");
    }
    class Inner extends Base{
    }
}

public class InnerClassExamples {
    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.new Inner().f();
    }
}
{% endhighlight %}
答案是调用了基类的方法。继承的方法和自己定义的方法比外部类的方法有更高的优先级。

### 匿名内部类的构造函数？
匿名内部类可以有构造函数吗？如果有，那么名字叫什么呢？匿名类连名字都没有！没错，但这不表示不能做一些类似构造函数的操作。那就是使用**初始化块（initializer blocks）**，像这样：
{% highlight css %}
new ActionListener() {
    {
        //initialization could be done here if needed
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        // do something
    }
};
{% endhighlight %}

### 包含了具体实现的接口？
这不可能，你可能说。但这确实是可能的，只需要将实现放到接口的一个内部类中即可。像这样：
{% highlight css %}
interface InterfaceWithImpl{
    void f();
    
    static class Inner{
        void f(){
            System.out.println("InterfaceWithImpl.Inner.f()");
        }
    }
}
{% endhighlight %}
世界之大，无奇不有。这让我等用了8年Java的程序员情何以堪。

### 匿名内部类无法引用非final的本地变量？
这个很多人都知道，所以只需要将本地变量加上final就可以了。可是你想过这是为什么吗？我看到很多帖子说，本地变量是放在**stack**中的（当然这是错的），然后出了方法域之后就被回收了（其实这也是不一定的）。一种说法是为了不让代码看起来让人困惑，因为内部类中的方法可能晚于类定义之后的代码执行，而如果后面的代码又修改了这个变量，那么内部类中的引用的那个本地变量可能已经不是在内部类定义之前的那个值了。这个说法多少有点可信，可是也没有找到确实的证据。如果你知道，告诉我一声。
