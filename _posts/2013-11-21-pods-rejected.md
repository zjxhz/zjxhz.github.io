---
layout: post
title: Pods-App was rejected  
description: How I fixed the CoacoPods and Xcode 5 intergration issue
category: articles
tags: [iOS, CocoaPods, Pods, rjected]
---

Did you ever get a warning like below:

*Pods-App was rejected as an implicit dependency for 'libPods-App.a' because its architectures xxx didn't contain all required architectures 'yyy'.?*

This is how I fixed the issue:

- Select Pods project on the left
- Choose the **Pods target** on the right, not the **Pods project**
- Go to build settings and change **ONLY_ACTIVE_ARCH** to **Yes**
- You may need to change **Supported Platforms** to iOS so that you would be able to choose **armv7 armv7s** as default, or you may see values like **i386**
- Change Valid Architectures to **armv7 armv7s arm64**

And here is a snapshot which tells everything, drop a comment if it doesn't work for you

<figure>
    <img src="/images/Pods.png">
</figure>


You would probably find many other posts on internet as well, but [this post](http://www.mobinett.com/2013/09/20/ios-7-xcode-5-project-build-settings-for-architectures-and-arm64-support/) at least helps you understand better the terms, if it couldn't solve your issue. 
