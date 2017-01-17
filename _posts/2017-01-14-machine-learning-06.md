---
layout: post
title: 机器学习之「壹壹零」
description: 关于特征缩放的梯度下降
category: articles
tags: 
---
上一篇我们说到，如果没有做特征缩放（Feature Scaling），那么收敛会比较慢。这一篇将具体地比较做或不做之间的差别。

我们发现，如果不做特征缩放，那么学习率只能选择例如0.0001这么小的值（稍大一点则发散），而且在大约循环1000多次之后J收敛在36左右。虽然这比原来的37.16要好，但差别不大。如果使用了特征缩放，那么在循环2500次左右，J的值可以收敛到个位数。

如果我们把梯度下降的过程用一个图来表示，那么其实这两种做法都可以得到类似如下的图。图中的红叉代表了几个典型的「梯度」，一开始因为收敛快，所以记录了所有的梯度，后面则按照每100个梯度记录一次。

![ml_gradientDescent3D.png](/images/ml_gradientDescent3D.png)

为什么从图上来看，这两种做法差别并不大呢？这是因为，虽然最终结果看起来差别比较大，但是在θ的初始值[0;0]附近，J的值约为几万，所以相对最终结果差别仍然是非常小的。我们前面说了，所谓梯度下降，就是对各个参数计算其偏微分，然后乘以一个学习率逐步下降。直观地来讲，就是「找到一个斜率最大的路径」下降，也就是以「最快的方式」到达最低点。这里再放一张示意图来表示这种下降方式：

![](/images/ml_gradientDescent3DSample1.png)

需要注意的是，如果起点不同，那么可能到达一个不同的「局部最低点」。如下图：

![](/images/ml_gradientDescent3DSample2.png)

你可能要问了，如果这个局部最低点仍然很高怎么办？这个不需要担心，因为实际上，机器学习的算法中，J只有一个全局最低点，类似下图：

![](/images/ml_gradientDescent3DGlobalMin.png)

再看一个球面，例如地球表面的例子，那么下降最快的方式就是沿着其「经线」下降。

![](/images/ml_gradientDescentSphere.png)