---
layout: post
title: 用迭代器与组合模式对树进行遍历 
description: 示例如何用Java语言设计一个迭代器对树进行迭代，树的设计采用了组合模式
category: articles
tags: [Java, iterator, 设计模式，组合模式，迭代器]
---
### 什么是迭代器
相信大家对迭代器模式还是比较熟悉的，在Java的集合中有比较多的应用。比如你想使用迭代器遍历一个集合，代码可能是这样：
{% highlight css %}
for (Iterator it = collection.iterator(); it.hasNext();)
{
    doSomething(it.next());
}
{% endhighlight %}

迭代器的作用在于对数据的遍历与数据的内部表示进行了分离。通过迭代器，你知道调用hasNext()来确认是否还有下一个元素。如果有，那么就可以调用next()取得下一个元素。至于数据内部如何表示，我们并不关心。我们关心的只是能以一种预先定义的顺序来访问每个元素。

### 关于组合模式
组合模式用来表示一个节点内部包含若干个其它的节点，而被包含的节点同样也可以再包含另外的节点。因此是一种递归的结构。不包含其他节点的节点叫做叶子节点，这通常是递归的终结点。树形结构比较适合用来说明组合模式。

### 树的类设计
假设我们用Node接口表示一个节点。可以往这个节点上添加节点，也可以获得这个节点的迭代器，用来遍历节点中的其他节点。
{% highlight css %}
public interface Node {
    void addNode(Node node);
    Iterator<Node> iterator();
}
{% endhighlight %}

抽象类AbstractNode实现这个接口，并不做多余的事情。只是让这个节点有个名字，以区分于其他节点。
{% highlight css %}
public abstract class AbstractNode implements Node {
    protected String name;
    protected AbstractNode(String name)
    {
        this.name = name;
    }
    public String toString()
    {
        return name;
    }
}
{% endhighlight %}

接下来，是表示两种不同类型的节点，树枝节点和叶子节点。它们都继承自AbstractNode，不同的是叶子节点没有子节点。
{% highlight css %}
public class LeafNode extends AbstractNode {
    public LeafNode(String name) {
        super(name);
    }
    public void addNode(Node node) {
        throw new UnsupportedOperationException("Can't add a node to leaf.");
    }
    public Iterator<Node> iterator() {
        return new NullIterator<Node>();
    }
}
{% endhighlight %}

接下来是树枝节点：
{% highlight css %}
public class BranchNode extends AbstractNode {
    public BranchNode(String name) {
        super(name);
    }
    private Collection<Node> childs = new ArrayList<Node>();
    public void addNode(Node node) {
        childs.add(node);
    }
    public Iterator<Node> iterator() {
        return childs.iterator();
    }
}
{% endhighlight %}
树枝节点可以添加子节点，叶子节点或者另外一个树枝节点。但是我们注意到，这里的迭代器只是简单地返回了该节点直属子节点集合的迭代器。什么意思呢？这意味着如果你通过这个迭代器去遍历这个节点，你能获得是只是所有直接添加到这个节点上的子节点。要想递归地遍历子节点的子节点，以及子节点的子节点的子节点……我们就需要一个特殊的迭代器。


### 深度优先迭代
所谓深度优先，通俗的讲就是沿着一条路走下去，直到走不通为止，再回过头来看看有没有别的路可走。

{% highlight css %}
public class DepthFirstIterator implements Iterator<Node> {
    private Stack<Iterator<Node>> stack = new Stack<Iterator<Node>>();
    public DepthFirstIterator(Iterator<Node> it) {
        stack.push(it);
    }
    public boolean hasNext() {
        if (stack.isEmpty()) {
            return false;
        } else {
            Iterator<Node> it = stack.peek();
            if (it.hasNext()) {
                return true;
            } else {
                stack.pop();
                return hasNext();
            }
        }
    }
    public Node next() {
        if (hasNext()) {
            Iterator<Node> it = stack.peek();
            Node next = it.next();
            if (next instanceof BranchNode) {
                stack.push(next.iterator());
            }
            return next;
        } else {
            return null;
        }
    }
    public void remove() {
        throw new UnsupportedOperationException("Can't remove node, yet");
    }
}
{% endhighlight %}

代码不是很长，理解起来可比较费劲。这不仅是因为我很懒没有写注释，更是因为有可恶的递归在。先从构造函数看起，一个包含了迭代器的构造函数，也就是说，这是个迭代器的迭代器……这该怎么理解呢？可以把它理解成树枝节点迭代器的一个改良的迭代器。树枝节点的迭代器只知道如何找到第一级子节点，而这个迭代器则可以沿着子节点一直寻找下去，直到找到叶子节点，然后再返回来继续寻找。好吧，说起来简单，怎么做呢？

 

先看如何找到“下一个”节点吧，看next()方法：

如果存在下一个节点，那么开始下一个节点的寻找之旅。否则返回null结束。

首先，通过树枝节点自带的迭代器，找到树枝节点的第一个子节点，这个子节点就是我们要找的“第一个”节点。这很简单，对吧？那么下一个节点是哪一个？这取决于我们找到的第一个节点是什么类型，如果是叶子节点，那么很简单，下一个节点跟树枝节点迭代器定义的下一个节点一样，也就是树枝节点的第二个直属子节点。如果是树枝节点呢？这个时候它将被当成一个新的起点，被压入堆栈，下一次遍历将从这个节点开始重复上面的逻辑，也就是递归。听起来并不复杂，不是吗？

 

让我们来一个例子，如果我们要遍历这样一棵树
{% highlight css %}
/**
     * Create a tree like this 
     *          Root 
     *          / |  \ 
     *         A  B  C
     *        /       \
     *       D         F
     *      / 
     *     E
     * 
     * @return The tree
     */
    static Node createTree() {
        Node root = new BranchNode("Root");
        Node a = new BranchNode("A");
        Node b = new LeafNode("B");
        Node c = new BranchNode("C");
        Node d = new BranchNode("D");
        Node e = new LeafNode("E");
        Node f = new LeafNode("F");
        a.addNode(d);
        d.addNode(e);
        c.addNode(f);
        root.addNode(a);
        root.addNode(b);
        root.addNode(c);
        return root;
    }
{% endhighlight %}

从根节点Root开始遍历，第一个子节点，也就是Root自己的第一个直属子节点，是A。下一个呢？因为A是一个树枝节点，所以我们把它先压入堆栈。下一次从A开始，我们可以把从A开始的子节点遍历看成一次全新的遍历，所以A的第一个子节点是什么呢？D！很简单不是？然后是E。因为E没有子节点，所以我们返回找D的下一个子节点，但是D除了E是它的子节点之外，没有另外的子节点了。所以D也没有子节点了，又返回到A。A也没有多余的子节点了，所以这个时候轮到B……

所以，最终的顺序是Root -> A -> D -> E -> B -> C -> F。

 

回过头来看看hasNext()做了什么。还记得吗？我们把每一个遇到的树枝节点压入堆栈，当堆栈中不存在任何的树枝节点时，遍历就完成了。如果有，我们就取出一个，看它是不是还有子节点，如果有，那么我们就说还有下一个节点。如果没有了，那我们就取出堆栈中的下一个树枝节点，并以这个树枝节点为起点，看是否存在下一个节点。 

试试这个迭代器威力如何：
{% highlight css %}
static void depthFirstIterate(Node tree) {
        doSomething(tree);
        for (Iterator<Node> it = new DepthFirstIterator(tree.iterator()); it.hasNext();) {
            doSomething(it.next());
        }
    }
{% endhighlight %}

如果doSomething(Node node)只是简单地打印这个节点，像这样：
{% highlight css %}
static void doSomething(Node node) {
        System.out.println(node);
    }
{% endhighlight %}

那么你可以看到前面所述的顺序被打印出来 Root -> A -> D -> E -> B -> C -> F。当然，没有箭头，而且是分行>显示的。

### 广度优先
好的，这看起来确实不错，那么广度优先遍历呢？所谓广度优先，通俗来讲就是层层推进。首先遍历所有的第一级子节点，然后是第二层，第三层……结果就像是这样：Root -> A -> B -> C -> D -> F -> E

听起来更加简单，是不是？事实上做起来并不简单，除非你已经正确理解了上面深度优先遍历。

 

如果你理解了深度优先遍历，那么广度优先遍历和深度优先唯一不同的地方就是树枝节点的存取顺序。在深度优先遍历中，树枝节点使用堆栈，存取顺序是后进先出。先就是说，最后遇到（也就是后进）的树枝节点先拿出来用（就像插队一样，不得不承认这有点不公平）。那么，我们最先遇到的树枝节点是Root自己，然后是A，最后是D（不是E，因为E不是树枝节点）。根据后进先出的原则，我们先把D拿出来遍历，最终得到D的子节点是E。然后是A，最后才是Root，所以Root的第二个子节点B会在Root的第一个子节点遍历完成之后才能遍历到。

 

所以，只要我们将堆栈换成公平的强力支持者，先进先出的队列（Queue），问题就解决了：

因为Root最先进入队列，所以它的所有直属子节点会被先遍历，然后才轮到A，然后是C，然后是D。所以最终顺序会是这样：

Root -> A -> B -> C -> D -> F -> E

 

广度优先码：
{% highlight css %}
public class BreadthFirstIterator implements Iterator<Node> {
    private Queue<Iterator<Node>> queue = new LinkedList<Iterator<Node>>();
    public BreadthFirstIterator(Iterator<Node> it) {
        queue.offer(it);
    }
    public boolean hasNext() {
        if (queue.isEmpty()) {
            return false;
        } else {
            Iterator<Node> it = queue.peek();
            if (it.hasNext()) {
                return true;
            } else {
                queue.poll();
                return hasNext();
            }
        }
    }
    public Node next() {
        if (hasNext()) {
            Iterator<Node> it = queue.peek();
            Node next = it.next();
            if (next instanceof BranchNode) {
                queue.offer(next.iterator());
            }
            return next;
        } else {
            return null;
        }
    }
    public void remove() {
        throw new UnsupportedOperationException("Can't remove node, yet");
    }
}
{% endhighlight %}
可以看到代码和深度优先遍历几乎完全一样，除了把堆栈（Stack）换成了队列（Queue）

参考了《HeadFirst设计模式》，但遗憾的是那里面的示例代码是错误的

### 补充
这篇文章从CSDN迁移而来，完成于2008年。CSDN上也没有写什么像样的文章，看来看去唯一值得迁移的就是这一篇。

