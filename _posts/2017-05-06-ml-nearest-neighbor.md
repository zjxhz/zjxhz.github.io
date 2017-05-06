---
layout: post
title: 近邻分类法
description: 
category: articles
tags: 
---

## 人脸图片采集
我用搜索引擎的图片搜索，按照关键字「集体照」搜到几百张图片包含几千个人脸，用于标注「非美女」图片。然后，这么做有几个问题。

1. 图片和人脸数量不够多。
2. 图片中不仅包含了很多正常女性的人脸，但是也混入了很多比如男性，小孩的照片，还有一些被「误杀」的美女。

为了解决第二个问题，我试着用了一下Face++提供的API。该API不仅可以进行人脸检测，还可以对人物做属性标记，如性别，年龄。这样我就可以从结果中过滤出年轻女性的照片。免费的API可以用，但是有一些限制。比如连续的调用会频繁出现「超出并发限制」的错误。也就是说，免费调用的请求太多了。当然，这些请求并不是我一个人发出来的。有一种简单的办法是，如果发生这样的错误，那就不断重试。这种办法虽然可行，但也增加了程序运行的时间。另外，一次API调用只能最多对当前照片中的5个人脸进行属性标记。然而，对于集体照而言，这一般都是不够的。剩下的就需要继续调用另一个API做进一步的分析。这增加了复杂度，而且进一步增加了执行时间。

我试用了一下它的收费服务。按量计费的话，一个人脸大约是5厘钱。也就是一块钱可以分析200个人脸。这个价格并不算便宜。

我想用Face++的服务的另外一个原因，是因为我自己的人脸检测算法非常慢。单张图片的分析要长达十几秒的时间，这是非常慢的。我记得以前在另一台配置更差的电脑上，好像也没有这么慢。所以我一直怀疑是dlib的安装有问题。于是，我又试着手动地编译了一下dlib，并且加上了为USE_AVX_INSTRUCTIONS选项。结果，Tada！运行时间一下子降到了毫秒级别。所以，我就打算用自己写的这个程序来做人脸检测了。

另一方面，混入了男性，或小孩的照片到「非美女」的集合中，语义上来讲也并没有错。毕竟，“男性”也不是“美女”。

不管怎么说，选了部分照片，直观地感受一下。以下是集体照中抓取的人脸：
![集体照中的人脸](/images/beauty-normal.png)

美女人脸集合：
![美女人脸](/images/beauty-beauty.png)

## 近邻法
所谓近邻法，通俗来讲，就是看两张图片的「相似度」。换句话说，差别越小，我们就认为这两张图片越有可能是同一个类别的。我们把做了标记的人脸图片分成两个部分，一部分（例如取80%）用来做「训练」，剩下的部分用来做「测试」。所谓的测试，就是拿测试集中的照片，去和训练集中的照片做对比，找到差别最小的那一张，我们就「预测」他们归为同一类。最后，比较预测的结果和实际类别，来计算该算法的准确度。

那如何定义「相似度」呢？或者说，如何定义差别？我们知道，图片由「像素」组成。比如，一张分别率为50x50的照片，那么一共有2500个像素。每个像素，对于灰度（黑白）图片而言，可以用一个0到255的数字表示。也就是说，一张图片相当于是2500个数字。要计算两张图片之间的差别，我们就对两张图片中每个对应的像素求差值，并取绝对值，然后相加。举个简单的例子，如果图一全部由1组成，而图二全部由3组成，那么他们的差别就是5000（2500 * 2）。你也可以对这个值除以像素的数量，即2500，得到平均的差值是2。但这对于结果是没有影响的。

Python代码：
```python
Xtr, ytr, Xte, yte = get_all_data()
nn = NearestNeighbor(Xtr, ytr)
nn.train()
ypre = nn.fit(Xte)
print "%.2f%%" % (100 - np.sum(np.abs(yte - ypre)) * 100.0 / yte.shape[0])
```

第一行代码做的就是加载图片存为数组，并且分为训练集及其标签（Xtr, ytr）和测试集及其标签（Xte, yte）。具体的实现大致如下（我的代码比较啰嗦）：
```python
import numpy as np
from scipy.misc import imread
import os
from trainers.nntrainer import NearestNeighbor

faces_folder = '/Users/huanze/work/ml/faces/'
faces_beauty_folder = '/Users/huanze/work/ml/faces_beauty/'

def image_to_array(path):
    face = imread(path)
    face = np.array(face, np.int8)
    face_row = np.reshape(face, (1, face.shape[0] * face.shape[1]))
    return face_row


def images_to_vstack(folder):
    arr = ()
    for path in os.listdir(folder):
        face = image_to_array(folder + path)
        if face.shape == (1, 2500):
            arr = arr + (face,)
    return np.vstack(arr)


def get_data(folder, yVal):
    X = images_to_vstack(folder)
    np.random.shuffle(X)
    rows = X.shape[0]
    slice_index = int(rows*0.6)
    y = np.full((rows, 1), yVal)

    Xtr = X[:slice_index]
    Xte = X[slice_index:]
    ytr = y[:slice_index]
    yte = y[slice_index:]
    return Xtr, ytr, Xte, yte


def get_all_data():
    normal_data = get_data(faces_folder, 0)
    beauty_data = get_data(faces_beauty_folder, 1)
    Xtr = np.vstack((normal_data[0], beauty_data[0]))
    ytr = np.vstack((normal_data[1], beauty_data[1]))
    Xte = np.vstack((normal_data[2], beauty_data[2]))
    yte = np.vstack((normal_data[3], beauty_data[3]))
    return Xtr, ytr, Xte, yte
```

如上所示，Python中矩阵计算用的是numpy，有必要熟练使用。不过，这个算法不是重点，重点是近邻算法，大致如下：

```python
class NearestNeighbor(Trainer):
    def __init__(self, Xtr, ytr):
        self.Xtr = Xtr
        self.ytr = ytr

    def train(self):
        pass

    def fit(self, Xte):
        ypre = ()
        rows = self.Xtr.shape[0]
        for xte in Xte:
            min = sys.maxint
            y = None
            for i in range(rows):
                xtr = self.Xtr[i]
                ytr = self.ytr[i]
                sum = np.sum(np.abs(xtr - xte))
                if sum < min:
                    min = sum
                    y = ytr
            ypre = ypre + (y,)
        return np.vstack(ypre)
```        

用这个算法得出的准确率大约在80%左右，看起来好像还能接受。但要注意的是，对于两个类别而言，「瞎蒙」也有50%左右的准确率。所以，这个算法不能算好。而且，如果你仔细想想，这个算法也会有很多低级的问题，因为这仅仅是一个简单地按照对应像素对比的算法。比如：

1. 人脸在图片中的位置很重要。一旦偏移，差别可能很大。
2. 背景，亮度对结果的干扰也很大。

所以，其实能有80%左右的准确度，已经有点出乎我的意料了。我本来预计可能也就比「瞎蒙」稍好而已。这可能是因为我们对人脸的前期处理比较多，所以这是一个「相对理想」的数据集。例如，我们已经去除了背景的杂物，并且将头像居中。

另外一个明显的缺陷是，该算法其实并没有对训练集做任何的「训练」。所以在测试时，需要将测试集中的数据和训练集中的数据进行逐个比对。而训练集可以是很大的，能到百万甚至数亿级别。所以，这种算法虽然训练不费时，但是测试却很费时。这和应用的需求正好相反。因为应用一般可以接受花几个星期甚至数月来训练一个模型，但是希望在实际测试及应用的时候可以快速地给出结果。