---
layout: post
title: 近邻分类法 - 发生了什么？
description: 
category: articles
tags: 
---
上次我们用近邻分类法，达到了80%左右的准确度。这个结果对于一个如此简单，甚至过分简单的算法而言，已经算很不错了。超过了我的预期。这次我们来看看这背后发生了什么。主要是看两个方面：

1. 哪些人脸被错误地分类？
2. 为什么分错了？

## 被错误分类的人脸

让我们来首先看看被错误分到美女的人脸：

![被错误分类为美女的人脸](/images/ml-nn-fp.jpg)

我们发现，大部分的人脸其实并不能算是美女，甚至连接近也算不上（除了有几张还算可以，比如行1列4和行3列4）。这也说明了这种算法的局限性，即它只关注像素级别的相似程度。

我们再看下并错误分为普通女性的人脸：

![被错误分类为普通的人脸](/images/ml-nn-fn.jpg)

同样，这些美女人脸，大部分我觉得还是挺美的，被错误归类算是冤枉了。

## 为什么被分错了？

我们知道，近邻分类法做的是像素级别的一一比对。一个图片被分为一种类型，是因为在那个类别找到了和它最为接近的一张图片。那么我们接下来就看看最接近的那张图片是哪一张。

下面是一部分被错误分为美女的人脸相对应的美女人脸照片。左边是被错误分类的图片，右边是和它最接近的一张图片（也就是近邻）。

![被错误分类为美女的人脸的近邻](/images/ml-nn-nnfp.jpg)

类似的，下面是被分类为普通的人脸和其对应的近邻。

![被错误分类为普通的人脸的近邻](/images/ml-nn-nnfn.jpg)

可以看到，所有的图片和其近邻有比较高的相似度，例如人脸的位置和角度，光线等等。美，虽然是一个比较主观的概念，但是对于一张原本是美的人脸，即使像素级别的偏差可能不大，但结果却可以很不一样。