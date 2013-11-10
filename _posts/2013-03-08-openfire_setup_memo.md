---
layout: post
title: Openfire搭建和配置备忘
description: Openfire学习和使用过程中的一些记录
category: articles
tags: [openfire,搭建,配置]
---
### 关于Pubsub

Pubsub比较适合用来发送系统通知，比如我创建了某个活动，以后有人加入这个活动的时候我希望自己能够收到通知。对于后面加入的人也是一样，如果B是第二个加入的，那么当C作为第三个人加入的时候，B也希望得到通知。

### 简单的流程

我创建一个活动，并为此创建一个名如/meal/meal_id/participants的node。我作为创建者自动成为subscriber。当有人，假定为B，参加了这个活动后，我向该node publish一条消息，告知了比如哪个用户加入了哪个活动。该用户subscribe这个node，这样以后有人加入的时候他也会收到通知。

需要注意的地方是，如果服务端是用openfire，那么B也会收到一条自己参加了这个活动的通知。这个是由于openfire默认会将最后一条消息发给新的subscriber。如果不想要这个特性，有两个办法：

- 创建node的时候 设置*pubsub#send_last_published_item*属性为**never**，或
- 修改openfire数据库的表ofPubsubDefaultConf，将对应的pubsub service的sendItemSubscribe改为0，应该要重启生效。不确定是否还有其它方式修改
- 对于已经创建了的node，可以将ofPubsubNode表中的sendItemSubscribe字段改为0
- 如果不希望使用Multiple Subscriptions，可以修改ofProperty表，将xmpp.pubsub.multiple-subscriptions 设置为false。禁用有几个好处，例如避免产生重复的通知，unsubscribe的时候，对于同一个jid，不再需要指定具体想unsubscribe哪一个。

参考：http://xmpp.org/extensions/xep-0060.html
