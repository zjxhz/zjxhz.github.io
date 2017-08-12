---
layout: post
title: 神经网络简介 
description: 只有一个（你肯定认识的）数学公式
category: articles
tags: 
---
<style type="text/css">
	.fig {
		margin: 20px 0;
	}
	.fighighlight {
	    padding: 20px 4px 20px 4px;
	    border-bottom: 1px solid #999;
	    border-top: 1px solid #999;
	}

	.figcenter {
	    text-align: center;
	}
</style>

终于要讲神经网络了！在这中间大约中断了近2个月的时间。我现在对这个提不起什么兴趣的原因，主要当然是因为懒。另外，还有几个以下的原因（借口）：

* 我觉得我不太可能在人工智能方便有所建树，即使是找个工作也不太可能。这个极其热门的领域钻进去了很多世界上最聪明的脑袋。像我这样的是会挤破脑袋的。
* 明白了大致的原理之后，技术上就失去了其神秘性，不再那么吸引人了。
* 机器学习更像是数学而非编程。而这数学又太难太抽象，我的大脑因此产生了抗拒。而且，不仅是代数，矩阵的运算和变换很多时候要求你有很好的空间想象力，而这是我非常缺乏的。我大学时曾经因为没有办法想象物体在空间中的样子，而无法完成机械制图这门课程，从而不得不（花钱）转到了计算机系。

那为什么现在又开写了呢？我觉得吧，这是一种写作上的练习，即使没什么人看。

闲话少叙，那到底什么是神经网络？在中学课本里，我们就大概知道，人体的神经网络负责接收和传送「信息」。比如，你伸手去拿杯子，杯子里的水很烫，你的手指接触到杯子以后手上的神经接收到了这个信息，通过神经网络传递到大脑，大脑给出了缩手的指示，再传递回你的手引发肌肉的动作来完成这个指令。简单地来讲，一个神经元有三个部分的功能：接收输入，处理，输出。当然，神经科学的专家可能会对这种简单的说法嗤之以鼻，但计算机的神经网络即是对生物神经网络的这种简化。

<div class="fig figcenter fighighlight">
  <img src="/images/neuron.png" width="49%">
  <img src="/images/neuron_model.jpeg" width="49%" style="border-left: 1px solid black;">
  <div class="figcaption">A cartoon drawing of a biological neuron (left) and its mathematical model (right).</div>
</div>

据说，人体中包含了大约一千亿个神经元。所以，大脑的处理能力是非常强大的，即使是世界上最强大的计算机也难以企及。所以，这也是为什么人一眼望去，大千世界中什么花草虫鱼，一目了然。对于计算机而言，对这些物体进行分类，是很困难的事情——不是说技术上很难（虽然，曾经是挺难的），而是所需的处理能力是惊人的，至少在训练阶段是如此。

有人可能会认为这种模拟过于简化，无法反应大脑如何处理信息的真实过程。这也许是对的，但目前神经网络对于其能够处理的事情方面，似乎表现得还不错——也就是，有时可以超过，甚至远远超过人类。再说，生物进化过程中产生的复杂性，不一定是必须的，甚至可能是有害的。自然选择并不能进化出神人，一个完美无缺的人。而带着某些进化的缺陷，也不一定意味着这个物种就会灭亡。

单个神经元的的处理能力是有限的，它可以简单地模拟类似电路中的一些与，非门的逻辑。然而，如果将成千上万个，甚至数亿个神经元连接起来，其表现能力是非常强大的。数学上来说，神经网络可以用来近似表现任意复杂的连续函数。我们知道，一种函数在几何上对应着一种图形，例如圆的方程是：

$$ x^2 + y^2 = r^2 $$

既然神经网络可以表示任意复杂的函数，那么也就是说，神经网络可以在几何上可以对应一个任意复杂的图形，从而形成我们的「决策边界」——也就是将不同的事物在空间（可能是高维的）上区分开来。一个典型的神经网络大概可以表示成这样：

<div class="fig figcenter fighighlight">
  <img src="/images/neural_net.jpeg" width="40%">
  <img src="/images/neural_net2.jpeg" width="55%" style="border-left: 1px solid black;">
  <div class="figcaption"><b>Left:</b> A 2-layer Neural Network (one hidden layer of 4 neurons (or units) and one output layer with 2 neurons), and three inputs. <b>Right:</b> A 3-layer neural network with three inputs, two hidden layers of 4 neurons each and one output layer. Notice that in both cases there are connections (synapses) between neurons across layers, but not within a layer.</div>
</div>

可以看到，神经网络是分层的，每一层都和其它的层之间互相连接，以提供输入；最左边的这层是原始输入层，最后一层是输出层。例如，左边是一大堆猫猫狗狗的图片，输出就是这个网络认为的是猫还是狗的结论。中间的那几层叫隐藏层，层的多少和每一层神经元的数量决定了这个网络的表现能力。一般来说，是越多越好。大的神经网络会有上亿个神经元，分10到20层，所以也叫「深度」神经网络。

<div class="fig figcenter fighighlight">
  <img src="/images/layer_sizes.jpeg">
  <div class="figcaption">Larger Neural Networks can represent more complicated functions. The data are shown as circles colored by their class, and the decision regions by a trained neural network are shown underneath. You can play with these examples in this <a href="http://cs.stanford.edu/people/karpathy/convnetjs/demo/classify2d.html">ConvNetsJS demo</a>.</div>
</div>

从上图可以看出，随着隐藏神经元的数目的增加，其表现能力越强，也就是能表现出更为复杂的边界。例如最右边的图，为了覆盖所有的红点，边界成为了类似海星的形状。当然，有时候过于复杂的边界是有害的，因为它可能并不能反应真实世界中的一般情形，这个叫「过度拟合」。所以这个时候需要对其参数重整化(regularization)，也就是削弱部分参数的重要性。重整后，可以看到类似如下的图：

<div class="fig figcenter fighighlight">
  <img src="/images/reg_strengths.jpeg">
  <div class="figcaption">
    The effects of regularization strength: Each neural network above has 20 hidden neurons, but changing the regularization strength makes its final decision regions smoother with a higher regularization. You can play with these examples in this <a href="http://cs.stanford.edu/people/karpathy/convnetjs/demo/classify2d.html">ConvNetsJS demo</a>.
  </div>
</div>

可以看到，虽然重整化之后的边界并没有把所有的红绿点都正确地分开，但是其边界更为平滑了，在实际应用中会有更好的预测效果。

*注：所有图片出自斯坦福大学[卷积神经网络课程](http://cs231n.github.io/)。
