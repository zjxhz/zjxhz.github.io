---
layout: post
title: 平均脸——续
description: 
category: articles
tags: 
---
平均脸有一些很有意思的特性。比如，一般情况下，平均脸比所有被平均的脸都更漂亮。下面这张照片是某公司所有女员工的平均脸（来自learnopencv.com）：

![average-woman-face](/images/average-woman-face.jpg)

而美国总统的平均脸则长这样（中国的之前已展示过，为避免被追捕，不再重复贴出）。看起来是不是比其它总统更帅一点？而且似乎显得更为慈祥。

![average-president](/images/average-president.jpg)

有一个有趣的实验是，在2002年的一个德国选美大赛中，虚拟的「平均脸」获得了最高的分数，甚至比最终的「德国小姐」还要漂亮。前提是参赛者被拍摄了素颜照片，并且被要求不能摆出特别性感的姿势或展露迷人的笑容。结果是，「平均脸」获得了高达6.2的分数（满分7分），而真正的德国小姐只有4.9分。感受一下：

![miss-germany](/images/miss-germany.png)

为什么平均脸看起来更漂亮？难道「平均」不是意味着「平庸」吗？有一种进化论的解释是，和平均有所偏差的特质可能代表了一种不好的基因突变，所以容易在自然选择中容易被淘汰。而且，一般对称的脸更有吸引力，而平均脸可以中和这种不对称性。

似乎都有一定的道理。不过，还是让我们继续之前的话题，讲如何去除平均脸周围的看起来有点虚的头发和背景，让照片看起来更为真实（像图一那样）。

大概的思路是：

1. 创建一个只包含面部的平均脸
2. 将该脸拷贝到某个特定的人物中去覆盖原来的脸。

这次就拿我的同事的头像做输入吧（但愿他们不会介意）。我从内网查询到我们组内的几个有照片的同事，一共五位（包括我）。之前刚离职了一会女同事，现在全是男的了。

为实现第一步，我们只需要在创建德劳内三角形的时候不要包含照片边上的8个点即可。如此可以得到类似如下的图：

![average-ora-excluding.png](/images/average-ora-excluding.png)

然后，将这个脸拷贝到某个人的照片中（我的，请忽略发型）。为此，我们需要创建一个「蒙版」（Mask），以保证只拷贝脸部而不是背景。蒙版如下，表示只拷贝白色区域。

![average-mask.png](/images/average-mask.png)

拷贝之后，我们得到如下的图：

![average-copyto.png](/images/average-copyto.png)

如果你仔细看，你会发现这个图过度的部分很不自然。这是因为光线，肤色等的缘故导致平均脸的颜色和原图的不太一样。要处理这个问题，OpenCV提供了一种所谓无缝克隆（Seamless Clone）的技术。最终会成这样：

![average-ora.png](/images/average-ora.png)

这个无缝克隆看起来很厉害，就像魔法一样。比如它能通过简单的几行代码，把下图中带背景的飞机克隆到另外一张图。

![sky-with-plane.jpg](/images/sky-with-plane.jpg)

克隆之后：

![sky-with-plane-masked.jpg](/images/sky-with-plane-masked.jpg)

