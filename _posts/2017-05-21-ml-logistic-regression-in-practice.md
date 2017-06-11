---
layout: post
title: 逻辑回归之实践
description: 讲讲逻辑回归在美女分类中的应用
category: articles
tags: 
---

## 实现
### S型（Sigmoid）函数回顾
上次介绍了S型函数可以把实数的范围约束在(0,1)的区间，但是没有画出具体的图。回顾一下该函数如下：

$$ y = {1 \over {1 + e^{-x}} }$$

Python代码实现：
```python
	def sigmoid(z):
	    return 1.0 / (1 + np.power(np.e, -z))
```        

画个图:
```python
	x = np.arange(-10,10,0.1)
	y = sigmoid(x)
	plt.plot(x,y)
```
效果：
![ml-lr-sigmoid.png](/images/ml-lr-sigmoid.png)

### 类LogisticRegressionTrainer
大部分的实现代码其实都挺简单，不言自明。因此只贴了代码，不再做过多的描述。

#### 初始化
```python
    def __init__(self, Xtr, ytr, max_iter=500):
        self.Xtr = Xtr
        self.ytr = ytr
        cols = self.Xtr.shape[1] + 1
        self.theta = np.zeros(cols)
        self.max_iter = max_iter
```        

#### 假设函数
```python
    def hypothesis(self, X):
        z = X.dot(self.theta)
        return self.sigmoid(z)
```

#### 代价函数
```python
    def cost(self, y):
        h = self.hypothesis(self.Xtr)
        return -np.mean(y * np.log(h) + (1 - y) * np.log(1 - h))
```

#### 梯度函数
```python
    def gradient_descent(self, alpha):
        rows = self.Xtr.shape[0]
        h = self.hypothesis(self.Xtr)
        self.theta = self.theta - alpha / rows * self.Xtr.transpose().dot((h - self.ytr))
```

#### 训练
和线性回归一样，我们也需要给原属性加上一列偏置（bias）属性。类似的，正规化（Normalization）也是必须的，这样可以让训练收敛得更快，而且不容易导致溢出。想想，$$\theta^T X$$的值取值可以在5000以上，而且是作为自然对数e的指数，如果不做正规化，那么就很容易溢出。另外，这里有个「硬编码」的0.03，是学习率，其实是通过试验得出的。回顾一下，学习率既不能太小导致训练速度过慢，也不能太大使得函数发散。

```python
    def train(self):
        self.Xtr = self.norm(self.Xtr)
        self.Xtr = self.add_ones(self.Xtr)
        for i in range(self.max_iter):
            self.gradient_descent(0.03)

    @staticmethod
    def add_ones(X):
        rows = X.shape[0]
        ones = np.ones(rows).reshape(rows, 1);
        return np.hstack((ones, X))

    @staticmethod
    def norm(X):
        mu = np.mean(X)
        sigma = np.std(X)
        return (X - mu) / sigma        
```
#### 预测
```python
    def fit(self, Xte, yte):
        Xte = self.norm(Xte)
        Xte = self.add_ones(Xte)
        return self.hypothesis(Xte) >= 0.5
```

## 结果
用该方法训练后，准确度也在80%左右，和近邻法差不多。同样，还是看看预测出错的人脸有些什么特点。

被错误分类为美女的人脸：

![被错误分类为美女的人脸](/images/ml-lr-fp.jpg)

再来看看算法给出的这些人脸为美女的对应的「概率」：

![为美女的概率](/images/ml-lr-fp-p.jpg)

可以看到，该算法比较偏好明亮的颜色，即白色。它对行1列4的图片给出了几乎完全确定的概率1（由0.999x四舍五入得到）。而对于我们人类大脑认为的的确应该是美女的如行4列4，和行5列5，也给出了相对较高的概率（0.873和0.944）。

被错误分为普通女性的人脸：

![被错误分类为普通的人脸](/images/ml-lr-fn.jpg)

对应的「概率」：

![为美女的概率](/images/ml-lr-fn-p.jpg)

有兴趣的可自行分析该结果。但似乎得不出更多的新结论。

## 结论
从结果看，该算法并不比近邻分析法要好，被错误分类的人脸也和之前的算法大同小异——虽然准确率较高，但似乎并不能给人一种「智能」的感觉。而且，该算法理解起来，要比近邻法难得多。那么，该算法的优点在哪呢？答案就是「预测的性能」。

前面说过，近邻分类法虽然「训练」可以实时完成，但预测则需要遍历所有的训练集，非常费时，这对于实际应用的需求正好相反。多费时呢？不妨用Python的cProfile模块来对比一下。对于一个约1800张训练图片，约450张预测图片而言，在我的机器上（i7 2.8G, 16 GB，显卡是Intel Iris， 不知道训练是否用了GPU），结果如下：

__5近邻分类法(单一近邻法结果类似)：__ <br>
训练：0s<br>
预测：9.741s<br>

__逻辑回归法：__<br>
训练：2.05s<br>
预测：0.022s<br>

可以看到，最主要的差别在于预测的时间。从10秒左右降低到0.02秒左右，这是一个根本性的提升，也更符合商业上的需求。另外，排除近邻法代码写得不好的因素，逻辑回归法在总运行时间上也有所减少，这是因为训练的数据集只有总样本数的80%，而近邻法每次预测都需要遍历所有的数据集。
