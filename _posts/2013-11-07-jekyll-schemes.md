---
layout: post
title: 如何用“主题”定制在Github Pages搭建的博客
description: 关于如何在Github上搭建博客的文章已经有不少，这里主要讲如何简单地套用一些主题来使得搭建博客像Wordpress那么简单
category: articles
tags: [github pages, github, blog, 博客, theme, 主题]
image:
  feature: texture-feature-04.jpg
  credit: Texture Lovers
  creditlink: http://texturelovers.com
---

关于如何在Github上搭建个人博客的文章已经比较多，写得也都还不错。例如阮一峰(《黑客与画家》的中文译者)的[这篇](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)和一位豆瓣开发人员的[这篇](http://beiyuu.com/github-pages/)。在Github上搭建博客，自然比其他方式更加费劲一点。我作为一名开发人员，技术上不存在什么难度。但是对于前端和设计白痴的我，难的地方是博客的主题，布局，风格这些东西。如果要自己从头来设计，不是简陋无比，就是趁早放弃。

### 从头开始
当然，从头开始用Jekyll来搭建一个静态网站是个不错的想法。因为这可以让你对其工作原理，目录结构等有个清晰的认识。[这里](http://www.andrewmunsell.com/tutorials/jekyll-by-example/)有一篇不错的入门的文章。需要注意的是，可能该文章比较老，在我查看的时候其中[Bootstrap][]的用法已经有些过期。不过这些错误可以通过简单地查看Bootstrap的网站和示例来修正。  
另外一个需要注意的是，**如果修改了_config.yml,需要重启jekyll，即使你用了--watch参数**

  [Bootstrap]: http://getbootstrap.com/

### 使用主题（Theme）
使用Jekyll自然给你带来了很大的自由，但是有很多时候，你可能并不需要这种自由：这是我的第一个博客，所以直接给我一些模板（主题）让我选择，我只要专注内容就可以了。  
带着这样的想法，我找到了[这个网站](http://jekyllthemes.org/)。里面有一些简单的主题，或者说模板可以套用。你要做的，只是做些简单的定制即可。  
这里推荐[Minimal Mistakes](http://jekyllthemes.org/themes/minimal-mistakes/)这个主题，定制非常简单，文档也还不错。我的网站目前就是采用这个模板（主题）。  
相信你会发现一些更有意思的主题
