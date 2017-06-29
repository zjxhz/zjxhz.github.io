---
layout: post
title: 支持向量机，另一种实现
description: 二元支持向量机的一种更为简单的实现 
category: articles
tags: 
---
前面讲到支持向量机的算法适用于有多个分类的情况。比如不仅要分出美女和普通女性，还要分出老人小孩等等。作为一个二分法的支持向量机算法，这其实是有点过于复杂了。那么，如何简化呢？

**多个分数 vs. 单个打分**

首先是打分系统。之前我们给每个图片打了两个分，美女分和非美女分。对于美女，该算法「希望」美女分比非美女分高；相反，对于非美女，该算法「希望」非美女分高。后来我发现，该算法虽然打了两个分，其实是两个一样的数值，只是一正一负而已。比如美女0.8分，非美女-0.8分。这么做是没有必要的。其实我们只需要一个分数即可。

**损失函数**

回顾一下两个分数的情况，对于单个样本的损失值定义为（略去校准参数）：

$$ L_i = max(0, s_j - s_y + 1) $$

即用不正确的分类的得分，减去正确的分类的得分，然后加1，并限制最小为0。而对于只有单个得分的情况，损失值可以简化为（同样略去校准参数）：

$$ L_i = max(0, 1 - s_iy_i) $$

其中，$$s_i$$为单个样本的分数。这里需要注意的一点是，y的值不再是0或1，而是-1或1。比如，如果是美女，那么y取1，这个时候算法就会希望得分高，以让损失为0。反之，如果是非美女，y为-1，我们就希望得分低，甚至为负数，以使得损失为0。

**梯度函数**

通过微积分求导，可知梯度可简化为：

$$ \delta_w L_i = 1(1 - s_iy_i > 0) y_ix_i $$

同样，1表示后面括号里的表达式为真的时候为1，否则为0。而对比之前，我们对于正确和不正确的分类，需要两个不同的梯度值，分别为：

$$ \Delta_{w_y} L_i = -1(w^T_j x_i - w^T_y x_i + 1 > 0)x_i $$

$$ \Delta_{w_j} L_i = 1 (w^T_j x_i - w^T_y x_i + 1 > 0)x_i $$

可以看到其实这两个梯度的算法是一样的，只不过互为正负。这也导致了一开始说的为什么对于两个分类导致了两个一样的分数，只是符号不同而已。

**结果**

这个算法因为本质上和之前那个并无不同，只是做了一些无损的简化，所以结果是一样的，不再赘述。这里介绍这个方法，还有一个用处，就是这个算法可以自然过渡到神经网络算法。


**代码**

```python
class BinarySvmTrainer(Trainer):
    def __init__(self, Xtr, ytr, max_iter=500, step_size=0.006, reg=10):
        self.Xtr = Xtr
        self.ytr = (ytr - 0.5) * 2 # turns 1 and 0 into 1 and -1
        rows = self.Xtr.shape[0] + 1 # bias row
        self.W = np.zeros(rows)
        self.max_iter = max_iter
        self.step_size = step_size
        self.reg = reg

    @staticmethod
    def score(X, W):
        return W.dot(X)

    def loss(self, W):
        scores = self.score(self.Xtr, W)
        m = self.ytr.shape[0]
        loss = np.sum(np.maximum(0, 1 - self.ytr * scores)) + self.reg * np.sum(self.W ** 2)
        return loss / m

    def train(self):
        self.Xtr = self.norm(self.Xtr)
        self.Xtr = self.add_ones(self.Xtr)
        for i in range(self.max_iter):
            self.gradient_descent(self.step_size)

    def gradient_descent(self, alpha):
        grad = self.gradient()
        self.W -= alpha * grad

    def gradient(self):
        grad = np.zeros(self.W.shape)
        m = self.Xtr.shape[1]
        for i in range(m):
            Xi = self.Xtr[:, i]
            yi = self.ytr[i]
            score_y = self.W.dot(Xi)
            if 1 - yi * score_y > 0:
                grad -= yi * Xi
        grad += 2 * self.reg * self.W
        return grad

    def fit(self, Xte, yte):
        Xte = self.norm(Xte)
        Xte = self.add_ones(Xte)
        h = self.score(Xte, self.W)
        return h > 0
```        

可以看到，除了损失函数和梯度函数有所不同之外，其余实现和之前的支持向量机没有差别。