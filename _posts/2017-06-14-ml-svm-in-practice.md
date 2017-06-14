---
layout: post
title: 支持向量机之实践
description: 
category: articles
tags: 
---
## 特点
前面讲过，支持向量机，也就是SVM的最大特点，就是其训练的目标为了是获得更大的「间距」。打个不太严谨的比方，与其将更多的美女划归到同一组，它更倾向于把那些「颜值」高的放在一块；至于那些模棱两可的，可以说是美女，也可以说不是的那些，就不管那么多了——随便划到哪一组吧。也就是说，它的目的是差异最大化，甚至不惜以一些错误的划分作为代价。这么做有什么好处呢？我个人的理解，是它在预测的时候更具有一般性，可能比较适合于给不同组之间差别较大的样本进行分类。它也可以把一些标记错误的样本进行筛选——毕竟，如果它既像这个，又像那个，那么，把它归到哪里就不是那么重要了吧。

这么说可能仍然不太清楚。让我们看一个简单的例子。对于下面的两种类别，比较自然的划分如图中黑线。

![ml_svm_split.png](/images/ml_svm_split.png)

但是如果加入一个新的样本，例如上方的被圈中的红叉。那么我们的分割线是不是应该变成下面这样呢？

![ml_svm_split2.png](/images/ml_svm_split2.png)

答案是不一定。一个标准的SVM实现会仍然坚持原来的分割，因为那样最大化了所有的样本到分割线的距离。

## 实现

Python的实现大致如下（原谅我糟糕的代码）：
```python
class SvmTrainer(Trainer):
    def __init__(self, Xtr, ytr, max_iter=500, step_size=0.006, reg=10):
        self.Xtr = Xtr
        self.ytr = ytr
        rows = self.Xtr.shape[0] + 1
        self.W = np.zeros((2, rows)) # 2 classes
        self.max_iter = max_iter
        self.step_size = step_size
        self.reg = reg

    def score(self,X, W):
        return W.dot(X)

    def loss(self, W):
        scores = self.score(self.Xtr, W)
        m = self.ytr.shape[0]
        margins = np.maximum(0, scores - scores[self.ytr, np.arange(m)] + 1)
        loss = np.sum(margins) - m + self.reg * np.sum(self.W ** 2)
        return loss / m

    def train(self):
        self.Xtr = self.norm(self.Xtr)
        self.Xtr = self.add_ones(self.Xtr)
        for i in range(self.max_iter):
            self.gradient_descent(self.step_size)

    def fit(self, Xte, yte):
        Xte = self.norm(Xte)
        Xte = self.add_ones(Xte)
        h = self.score(Xte, self.W)
        return h[0] < h[1]
        
    def gradient_descent(self, alpha):
        grad = self.gradient()
        self.W -= alpha * grad

    def gradient(self):
        grad = np.zeros(self.W.shape)
        m = self.Xtr.shape[1]
        for i in range(m):
            Xi = self.Xtr[:, i]
            yi = self.ytr[i]
            scorey = self.W[yi].dot(Xi)
            scorej = self.W[1-yi].dot(Xi)
            if scorej - scorey + 1 > 0:
                grad[1-yi, :] += Xi
                grad[yi, :] -= Xi
        grad += 2 * self.reg * self.W
        return grad
```

## 结果
有点出乎我意料的是，不管我怎么调整参数，该算法的准确率在75%左右，比之前的逻辑回归要稍差一点。这可能是因为，从像素级别而言，两个类别的样本差异并不是很大吧。或者，也可能是我的代码有什么问题。

不管怎么样，还是关注一下预测出错的结果有什么特点。以下是被错误分类为美女的人脸：

![被错误分类为美女的人脸](/images/ml_svm_fp.jpg)

以及被错误分类为普通的人脸：

![被错误分类为普通的人脸](/images/ml_svm_fn.jpg)

对比之前的结果，好像也看不太出来有什么本质的区别。不管怎么样，不论是逻辑回归，还是支持向量机，据说其结果都没有办法和神经网络相比。前面两种算法的好处，在于其相对容易理解，也比较容易训练。而且，从SVM到神经网络，算法上是一种自然的过度。所以，了解这些算法还是有好处的。