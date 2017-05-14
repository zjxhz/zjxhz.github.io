---
layout: post
title: K近邻分类法
description: 
category: articles
tags: 
---

> You're The Average Of The Five People You Spend The Most Time With. 
> 
> -- <cite> Jim Rohn </cite>

吉米·罗恩说过一句有名的话：你的水平取决于你身边最密切的5个人。之前说过的近邻分类法，我们用最接近的那张图片来给未分类的图片一票决定权，似乎有些武断。如果我们参考吉米·罗恩的话，使用更民主的做法，即找到5张最接近的照片，用「少数服从多数」的方法来投票呢？例如，对于某一张人脸图片，其相似的5张照片中，最接近的那张是美女，但其余4张都不是，那么我就不把该人脸归入美女的列表。

这就是K近邻分类法，Python示例代码：
```python
class KNearestNeighbors(Trainer):
    def __init__(self, Xtr, ytr, k):
        self.Xtr = Xtr
        self.ytr = ytr
        self.k = k

    def train(self):
        pass

    def fit(self, Xte):
        ypre = ()
        rows = self.Xtr.shape[0]
        nns = {}
        for i in range(Xte.shape[0]):
            xte = Xte[i]
            neighbors = {}
            for j in range(rows):
                xtr = self.Xtr[j]
                sum = np.sum(np.abs(xtr - xte))
                self.update(neighbors, sum, j)
            y = self.vote(neighbors)
            ypre = ypre + (y,)
            nns[i] = neighbors
        return np.vstack(ypre), nns

    def update(self, neighbors, sum, index):
        neighbors[sum] = index
        if len(neighbors) > self.k:
            sorted_keys = sorted(neighbors)
            del neighbors[sorted_keys[self.k]]

    def vote(self, neighbors):
        y = np.sum(self.ytr[i] for i in neighbors.values())
        if y > self.k / 2:
            return 1
        return 0
```

从最终结果来看，对于这个数据集（也就是我收集的那些人脸图片），效果并不比单一的「近邻分类法」更好，也是在80%左右的准确度。前面的文章，一位读者提了一个很有见地的观点，即该准确率可能是从人脸的「精细程度」得出的。换句话说，对于美女照片，可能大部分是用比较好的带虚化背景的镜头拍摄的，可能还用了美颜，所以相互之间比较接近。

还是让我们来直接看下分类的结果。这是被错误分到美女的人脸：

![被错误分类为美女的人脸](/images/ml-knn-fp.jpg)

如果你对比之前的结果，会发现有不少相似之处。而且这里面也的确有一些应该算是美女的人脸。例如行3列5，行4列4。最后面3张缺失是被错误分类为美女的照片不足25张，所以用黑色背景代替了。从这一点上来讲，这个算法还是不错的。

我们再看下被错误分为普通女性的人脸：

![被错误分类为普通的人脸](/images/ml-nn-fn.jpg)

同样，该结果和之前的算法得到的结果也有不少类似之处。

最后，让我们看看被错误分类的这些人脸。其5个近邻分别是什么，结果是如何「投票」产生的。先来看被错误分类为美女的人脸。第一列是被分类的人脸，右边五列是其「近邻」。其中绿色框表示美女，红色框代表非美女。
![被错误分类为美女的人脸的近邻](/images/ml-knn-nnfp.jpg)

以及被错误分类为非美女的人脸以及5个近邻。

![被错误分类为普通的人脸的近邻](/images/ml-knn-nnfn.jpg)

## 总结
那到底应该用哪种算法呢？还有就是K的取值应该是多少呢？5是最合适的吗？

其实，K近邻分类法更具有一般性，也就是说对于一般的数据集而言，测试结果更加趋于「稳定」。所以相对于单一近邻分类法是更容易被采用的方法。K的取值则要用交叉验证（Cross Validation）的办法，即在训练数据中，取出一部分，选取不同的K值，来试验出一个最好的值。虽然，因为测试数据的随机性和「不可见」性，这个值的最终测试结果可能不一定是最好的。

另外，训练集的标记数据质量对于结果也有影响。例如我们可以看到，在普通女性的人脸中混入了一些美女的照片，而且一部分被算法「错误」归类了。

最后一点就是，不管是哪种算法，它们都太过简单，属于已经过时的算法。用于一些「玩具」项目，也许可以试试。但是对于真正严肃的项目，我们就需要用业界领先的算法，比如神经网络。
