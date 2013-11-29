---
layout: post
title: iOS app何适配多种分辨率
description: 简单iOS开发过程中如何适配多种分辨率，这可能是不同的设备，例如iPhone和iPad
category: articles
tags: [iOS, multiple, resolutions, 分辨率, 适配]
---
事实上我对于这个没有什么经验，这里只是记录一些从网上的文章中学到的一些知识。

### Universal App
你可能会希望创建一个Universal App。这种类型的App对于不同的设备只需要一个项目就可以搞定。这种类型的app需要注意的一点是，本地图片资源不能太多，否则可能极大影响安装包的大小。

### 部署版本在iOS 6以上，使用AutoLayout
如果app在iPhone和iPad上界面相差不大，只是一些比较的布局调整，那么可以考虑使用AutoLayout。貌似AutoLayout在刚推出的时候不是很好用，但是到了iOS 7之后有了很大的改进，用起来比原来简单。可能更多的时候可能是用在同一设备屏幕的不同旋转方向上，但是其实也适合于在不同的设备上进行动态地布局。

如果不同设备的版本界面相差太大，那么似乎更为明智的选择是使用不同的Storyboard和xib（nib）文件。

### 需要支持iOS 6之前的版本
这个时候可以考虑使用Auto-resizing。虽然不及AutoLayout强大，但是一些比较简单的，或者差异不大的布局，还是值得尝试的。[这篇文章](http://floatlearning.com/2012/11/designing-for-multiple-screens-in-ios/)讲得不错。

### 代码动态布局
AutoLayout只适合于Storyboard或xib（nib）文件。对于一些比较动态的View，只能通过代码来进行布局了。对于一些简单的地方，可以在代码中判断是哪种类型的设备然后进行不同的布局。然而，如果不同设备的版本差异较大，就有可能必要将共同的代码抽取出来，放到一个基类中，不同设备的View实现自己的布局，这样代码会更清楚一点。
