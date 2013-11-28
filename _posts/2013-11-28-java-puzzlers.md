---
layout: post
title: Java Puzzlers - 看似简单却极难做对的Java题目
description: 介绍一些有趣的Java题目，看似简单，但是如果你能做对其中的一般小部分，也很不容易了。
tags: [Java, puzzlers, 面试]
category: articles
---
这几天无意中看到一个叫[「Java Puzzlers」](http://www.youtube.com/watch?v=wbp-3BJWsU8)的Google IO视频，其中一个主讲人是Joshua Bloch，也就是大名鼎鼎的《Effective Java》的作者。这个视频展示了一系列看似很简单的Java代码，然后想要得出正确的结果却极其不易。说实话，里面6个题目我只做对了一个（猜的不算）。这对于一个有大约8年Java工作经验的人来讲，的确算不得好成绩。

第一题说你买了一样一块一毛钱的东西，给老板两块，该找多少钱？程序如下：
{% highlight css %}
public class Change {
   public static void main(String args[]) {
      System.out.println(2.00 - 1.10);
   }
}
{% endhighlight %}

有一些经验的，或阅读过《Effective Java》的程序员可能一眼就看出来了：**如果想要精确的结果，不要用double或者float**。因为计算机无法精确地表示浮点数，所以这里，不管返回什么，都不能是0.9，也就是9毛钱。

所以你必须用**BigDecimal**！好吧，修改程序如下：
{% highlight css %}
import java.math.BigDecimal;
    public class Change {
        public static void main(String args[]) {
        BigDecimal payment = new BigDecimal(2.00);
        BigDecimal cost = new BigDecimal(1.10);
        System.out.println(payment.subtract(cost));
    }
}
{% endhighlight %}

答案是什么呢？选择其中一个：

+ 0.9
+ 0.90
+ 0.899999999999
+ 以上都不对

也许你选择了0.9，或者会在0.9和0.90之间纠结一下。但答案其实是D，即以上都不对。为什么呢？因为调用了错误的构造函数，即使使用了BigDecimal，还需要以字符串的形式构造。

这是视频里的第一题，也是我唯一做对的一题。其它的题目，有的确实是API设计的缺陷或者说陷阱，有的是因为不良的编码习惯造成的（有的甚至非常阴险）。如果你像我一样，只做对了一两题，那也不必忧伤。正如这个视频的[同名书籍](http://www.javapuzzlers.com/)中指出：

> Anyone with a working knowledge of Java can understand these puzzles, but many of them are tough enough to challenge even the most experienced programmer. 

所以，我觉得这里面大部分题目，如果拿来做为面试题，对于被面试者来讲是不太公平的。但是毫无疑问，这是一本非常有趣的书。我要去看这本书了，摘录书中第一题给你看看：

{% highlight css %}
public static boolean isOdd(int i) {
    return i % 2 == 1;
}
{% endhighlight %}

这个方法是否可以拿来判断一个数是否为奇数？被2除余1？当然可以，为什么不？ ;-)
