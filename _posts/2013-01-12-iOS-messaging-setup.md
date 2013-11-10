---
layout: post
title: iOS开发：如何实现基于XMPP的聊天功能
description: 以ejabberd为例子描述如何实现基于XMPP的聊天功能，后来因为某些原因，实际最后采用的服务器是Openfire，主要是因为它是Java写的。
category: articles
tags: [ejabberd, XMPP, iOS]
---
**WARN: THIS POST IS INCOMPLETE AS EJABBERD WAS NOT THE TECHNOLOGY I USED LATER BUT OPENFIRE**


Again, this is not a new topic. However, as you are here I assume you have solid understanding of iOS programming but limited knowledge of backend stuff(e.g. django/Erlang? programming, linux...), just like me. That is one reason I created this post. And another reason is that, most topics only talk about how to build up end-to-end communication from iOS client to the XMPP server but there is very limited information of how to **send push notifications to the iOS client when it goes to background** where the socket connect to the XMPP server is closed.

As someone mentioned in [this post](http://news.ycombinator.com/item?id=323541), keep in mind that setting up XMPP is notrocket science, but non-trivial. Enough talk, let's get started.

Well, what is [XMPP](http://xmpp.org/about-xmpp/) anyway? Simply put, it's one kind of protocol for real-time communication, gtalk and facebook chat is based on that. I guess that's enough for you to know and of course you could google the rest of the definitions if you are interested. As a protocol, XMPP thus has a various implementations from servers to clients, and libraries. What we will need here is first the server, which the client will be communicating to, [ejabberd](http://www.process-one.net/en/ejabberd/) is the one we will be using. The client, there are actually already many of ready-to-use clients on different operation systems, like Mac/Windows/iOS, what we are going to &nbsp;build is an iOS client. As there are already ready-to-use iOS clients, why would we need to create a new one? You may ask. Well the answer is that we need a chat functionality in our App, not a standalone chatting App...

## Server setup
As my backend runs on ubuntu(10.04 or 12.04), to install ejabberd:
{% highlight css %}
sudo aptitude install ejabberd
{% endhighlight %}

Create an user:

{% highlight css %}
sudo ejabberdctl register your_name localhost your_password
{% endhighlight %}

Edit the file below:

{% highlight css %}
/etc/ejabberd/ejabberd.cfg 
{% endhighlight %}

add the following line

{% highlight css %}
{acl, admin, {user, "your_name", "localhost"}}.
{% endhighlight %}

Restart ejabberd and now you should be able to use web admin at: http://localhost:5280/admin/

{% highlight css %}
sudo /etc/init.d/ejabberd restart
{% endhighlight %}

### Authentication

You could start to add some users via web admin. Be noticed that you should fist select a virtual host or if you won't be able to set password for the user if you add them from Access Control Lists.

Users you have added, can be tested by various [XMPP clients](xmpp.org/xmpp-software/clients/). However, they have nothing to do with users of our App. So must tell ejabberd to authenticate users via [external scripts](https://git.process-one.net/ejabberd/mainline/blobs/raw/v2.1.11/doc/guide.html#extauth), e.g. a [python script](http://www.ejabberd.im/node/4000) for django.

{% highlight css %}
{auth_method, external}.
{extauth_program, "/home/fanju/src/grubcat-backend/grubcat/manage.py ejabberd_auth_bridge"}.
{% endhighlight %}

Now you are able to login with users of your app. It seems somehow the username must ends with *@your_hostname*, e.g. *your_name@your_domain.com*.

It might be helpful to apply different authentication policy to different virtual hosts, so for example you can still use the admin user you created at the beginning for&nbsp;administration&nbsp; purpose but others as normal chatting users, to do this, edit ejabberd.cfg as following:

{% highlight css %}
{host_config, "localhost", [{auth_method, internal}] }.
{host_config, "your_domain.com", [{auth_method, external}] }.
{extauth_program, "/path/to/manage.py ejabberd_auth_bridge"}.
{% endhighlight %}

You probably need to add below item to ACL using web admin so that the users of your app will be probably authenticated:

{% highlight css %}
your_domain server you_domain.com
{% endhighlight %}

### client-Xcode
It's time to setup Xcode, I use [XMPPFramework](https://github.com/robbiehanson/XMPPFramework/), which is not easy to setup either. The problem I had was that there were files in Extensions folder referring to *XMPPFramework.h* in *Xcode* folder, which includes some demo code and is not required and thus is not added to my project at all. I tried to remove problematic extensions but there were too many of them, so I just removed all of them. I can add them back when needed, I guess...

### TODO:

[case sensitive username with django but not XMPP](http://www.shopfiber.com/case-insensitive-username-login-in-django/)

### 参考资料：

- [Mac上的服务器搭建](http://nullable.de/post/2748889136/routing-ejabberd-xmpp-offline-messages-to-django-and-as)

- [如何推送离线消息](http://nullable.de/post/2748889136/routing-ejabberd-xmpp-offline-messages-to-django-and-as)
