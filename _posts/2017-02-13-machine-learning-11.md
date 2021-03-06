---
layout: post
title: 机器学习之「壹零壹壹」
description:  地段的实际应用
category: articles
tags: 
---

上一次我们提到影响房价的一个关键因素：地段。而且我们说到，随机给小区（地段）编号并作为单独的一个特征，并不能够满足要求。那么，怎么做呢？答案是：我们可能需要因此增加几千个特征！

这是因为我们一共有几千个小区。前面说过，小区并不是一个数值型特征，而属于一种分类方式。对于这种非数值型的特征，我们采取的方式是，对于一个包含n个类型的分类方法（如小区），增加n个特征，属于某个类型的样本（如房子）用1表示，否则用0。具体地来讲，为简便计，我们假设只有3个小区，那么我们将会增加3个特征，考察如下4套房子：

1. 面积50，小区1（价格255）
2. 面积60，小区2（价格490）
3. 面积70，小区3（价格352）
4. 面积90，小区2（价格770）

我们将有如下特征（未列出价格）：

1. 50, 1, 0, 0
2. 60, 0, 1, 0
3. 70, 0, 0, 1
4. 90, 0, 1, 0

如果有几千个小区，那么对于每套房子，其特征中绝大部分为0，只有自己对应的那个小区才是1。看起来不错，将新的特征数据代入之前的公式，将会发现…然并卵！对于随机打乱的2000个数据，偏差约在3万多，这和之前用简单的只用面积的线性关系几乎没什么差别。让我们回过头去，看看可能的问题所在。还是以之前的那几套房子（属于3个小区）为例。房价和数据之间的关系是：

$$ h(X) = \theta_0 + \theta_1 X_1 + \theta_2 X_2 + \theta_3 X_3  + \theta_4 X_4 $$ 

假设机器学习之后，告诉我们几个参数的值分别为：

$$ \theta_0 = 0; \theta_1 = 5; \theta_2 = 10;  \theta_3=150; \theta_4=5 $$

那么计算出来的价格分别是：

1. 260
2. 450
3. 355
4. 600

可以看到，偏差较大的是第4套房子，而出现这种现象的原因是：如果我们只用简单的0和1来表示某个小区，那么我们相当于假设，小区对总价的贡献是常量的。也就是说，面积相等的情况下，小区2比小区1的房子贵140万。而这和我们的知识是相背离的。小区影响的其实更多的是单价，而非总价。换句话说，面积越大，总价的差别也就越大。所以，我们可以修正数据，将原来用1表示的地方，用这套房子的面积来代替（好好想想）。也就是说，之前的4套房子，将会有如下的数据：

1. 50, 50, 0, 0
2. 60, 0, 60, 0
3. 70, 0, 0, 70
4. 90, 0, 90, 0

我想，这其实是一种变相的提高幂次的方法。由于在这里，我们已经有几千个特征，如果稍微增加幂次，特征数会增加得非常快。我的机器对于这样的数据量的计算似乎已经有点力不从心了。

用新的数据代入计算，可以发现偏差有效地从3万多减少到3千多，约为原来的1/10。可见，这种方式还是非常有效的。如何对分类进行特征编码，是一种通用的有效的方式。对于房价，它还可以用在更多的类型特征上，比如装修程度，朝向，楼层高低等。后面我们的文章会继续分析。