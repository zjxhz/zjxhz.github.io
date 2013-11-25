---
layout: post
title: Java集合
description: 简单介绍Java的集合类
category: articles
tags: [Java, collections, 集合]
---
可能平时我们用到的集合类并不多，但是你确定自己用了正确的那个类吗？有什么集合类可以满足特定的需求？对于集合中已有的高效的实现，你是否还在自己写代码呢？

## 简介
Java集合中的接口定义如下图：
<figure>
    <img src="/images/colls-coreInterfaces.gif" />
</figure>

可见Map接口并非继承自Collection接口。

### Collection
支持常见的添加，删除，遍历等操作。值得注意的是，Collection支持一次添加和删除多个对象，例如**addAll**可以取合集，**removeAll**取差集，另外还有个**retainAll**可以取交集，可能用得相对较少。

对于遍历，一般的如用**迭代器iterator**，或者**for-each**，一般推荐用后面那种，更为简洁。但是如果需要在遍历的时候删除某个对象，则只能使用前者，因为**Iterator.remove()**是遍历时删除唯一安全的方式，否则就会抛出**ConcurrentModifiedException**异常

Java 8中加入了**lambda**的支持，即函数，或代码块可以作为参数传递。这极大地简化了这样的操作：

- 遍历某个集合
- 查找符合条件的对象
- 对该对象执行一定的操作

这样的操作以前一般需要定义几个类（一般是匿名的）来完成，需要写不少代码。现在只要一两行代码即可搞定。例如为了：从一堆图形对象中找出红色的，并打印它们的名字。可以这样：
{% highlight css %}
myShapesCollection.stream()
 .filter(e -> e.getColor() == Color.RED)
 .forEach(e -> System.out.println(e.getName()));
{% endhighlight %}
可能一开始比较费解，但是当你了解了它的用法之后，这会变得很有威力，并极大提高你的生产力。[这里](http://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)很好地循序渐进地介绍了lambda

### Set
Set不允许重复元素。其中HashSet，顾名思义，用哈希表实现，是无序的，同时也是效率最高的。TreeSet和LinkedHashSet都是有序的。前者按照对象实现的Comparable或者传入的Comparator对象排序（至少其一，否则会抛出异常），后者按照对象的添加顺序。它们比HashSet稍微慢一点，如果对顺序有要求，还是值得尝试的。

说到这里我想起有一次我做的一个面试题，问将重复的对象添加到Set，原有的对象是否会被替换？我记得当时是答了不会，但是也不确定。后来写代码测试了一下，确实如此。不过我感觉这更多的是其内部实现，既然是”重复对象“，即使是指向不同内存地址的两个对象，是否会被替换，又有什么要紧呢？用户似乎不需要关心。

### List
List是有序的，并允许重复元素，支持按照索引存取对象。ArrayList如其名，类似数组，在随机存取上速度很快，但是中间插入数据则没有LinkedList快。另外，List支持用ListIterator进行双向遍历。

### Queue
队列一般是先进先出（FIFO）的，但这也不是必须的。队列可以设置容量，如果超出这个容量，就无法再加入对象。操作队列有两套方法，其中一套如果失败了会抛出异常，另外一套则通过返回一个特殊的值，例如null表示失败。取对象也分成两种情况，一种是取到下一个对象并将其从队列里移除，另外一种则只是取出，但并不移除。

### Deque
双向队列，和队列类似，但是支持双向添加或移除元素。所以可以实现为先进先出的队列，也可以是后进先出的栈。

### Map
与Set接口类似，Map也有3种不同的实现。HashMap，TreeMap和LinkedHashMap。遍历可以通过键，值或者两个一起（entrySet）。

## 线程安全
前面所说的实现都是非线程安全的，这在一定程度上来说是好事。因为线程安全的实现会带来额外的开销，而很多时候你可能并不需要线程安全。例如Map的一个实现HashTable，虽然是线程安全的，但是效率比较低。如果你需要线程安全，另外一种方式是通过Collections.synchronizedXxx()方法来返回线程安全版本，例如Collections.synchronizedMap()返回线程安全的Map。然而如前所述，在并发量比较大的情况下，这可能会带来很大的性能开销。这个时候可以看下**java.util.concurrent**中是否有对应的类实现。这个包里的类提供了线程安全，并且在高并发时提供更好的性能。

## 泛型
说到集合，就不能不提泛型。Java SDK中的集合都加入了对泛型的支持。泛型的使用使得类型安全在编译时得到保证，所以应该被使用到新代码中。但是泛型也增加了语言的复杂性，下面列举了一些令人比较迷惑的地方。大部分例子用List（因为它比较短）

### List, List\<Object\>, List\<?\>有什么区别？
看起来好像没什么区别，不是吗？每一个List都可以容纳任何对象？

先说List和List\<Object\>，确实可以容纳任何对象。区别是后者更为类型安全，为什么？想象一下类似如下程序：
{% highlight css %}
void unsafeAdd(List list){ 
    list.add(new Integer(42));
    list.add("ABC");
}
{% endhighlight %}
List和List\<Object\>都可以作为参数传递到这个方法，这没什么问题。那问题是什么？问题就出在这个List可以接纳包含**任何类型**对象的集合。所以比如List\<String\>也是合法的。看出问题了吗？是的。对于List\<String\>，**list.add(new Integer(42))**会抛出异常，因为List\<String\>只接受String对象。

将参数类型改成List\<Object\>就可以了吗？是的，因为：

**List\<String\>不是List\<Object\>的子类**

对于接受类型为List\<Object\>的参数，却并不接受类型为List\<String\>的参数。这解决了我们之前的那个问题，原因是因为后者并不是前者的子类。

初看似乎有点违反直觉，但如果不这么做，就违反了一条基本的面相对象原则，即[**里氏替换原则**（Liskov Substitution principle）](http://zh.wikipedia.org/wiki/%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%99)。这条原则说明，子类对象必须能够替换基类对象被使用。放到这里来讲，如果List\<String\>是List\<Object\>的子类，那么List\<String\>必须也能够被作为合法的参数可以传递到方法中。但是这么做会导致前面所说的问题，所以将List\<String\>设计成非List\<Object\>的子类是更为合理的。

好吧，如果我想把一个List\<String\>对象中的所有元素添加到一个List\<Object\>中，方法的声明该怎么写呢？请参考Collection接口中的addAll方法：
{% highlight css %}
addAll(Collection<? extends E> c)
{% endhighlight %}
这里，你可以认为List\<? extends Object\>是List\<Object\>的一个子类。

那么List\<?\>对象呢？正如问号所指出的，这个集合中的对象类型是未知的。你不能对其类型做任何假定，甚至不能假定其为Object。所以对于这种类型，你不能调用这个集合中任何**和泛型类型相关的方法**。比如add，remove。但是你可以调用例如**size**之类的方法。这种类型有什么用呢？如果一个方法并不关心集合中的类型，那么就可以用它。它比非泛型的集合更安全，后者可以对集合中的对象做不同的假设，而这种假设可能导致ClassCastException。下面展示了适合使用这种类型集合的方法：
{% highlight css %}
int numElementsInCommon(Set<?> s1, Set<?> s2) {
       int result = 0;
       for (Object o1 : s1)
           if (s2.contains(o1))
               result++;
       return result;
}
{% endhighlight %}

总之，Java中的泛型是一个复杂的议题。这里所描述的，只是其中的一小部分。
