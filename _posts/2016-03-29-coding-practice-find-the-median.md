---
layout: post
title: Coding practices - find the median 
description: 
category: articles
tags: [coding, Java, median]
---

So I started to practice coding, finally, for fun and for interviews. One of the task was to find the median from a series of numbers, which are given one by one.

## Assumptions 1
One thing needs to be clarified is that what is the median number when the progrom is given even number of values, e.g. 1, 2, 3, 4? Let's say in this case it will pick the bigger one, which is 3.
So the input/output would be like this:

## Sample data
1 <=<br>
=> 1

1, 4 <=<br>
=> 4

1, 4, 3 <=<br>
=> 3

1, 4, 3, 2 <=<br>
=> 3

## Tests
Let's write the tests first:

```java
public class MedianFinderTest {
    private MedianFinder mf;
    @Before
    public void setUp(){
        mf = new MedianFinder();
    }

    @Test
    public void testSingleValue(){
        assertEquals(1, mf.offer(1));
    }

    @Test
    public void testOddNumberOfValues(){
        mf.offer(4);
        mf.offer(1);
        assertEquals(3, mf.offer(3));
    }

    @Test
    public void testEvenNumberOfValues(){
        mf.offer(1);
        assertEquals(4, mf.offer(4));
        mf.offer(3);
        assertEquals(3, mf.offer(2));
    }

    @Test
    public void testSameValues(){
        mf.offer(1);
        assertEquals(1, mf.offer(1));
        assertEquals(1, mf.offer(1));
    }

    @Test
    public void testMoreNumbers(){
        List<Integer> values = new ArrayList<>();
        for(int i = 0; i < 100; i++){
            values.add(i);
        }
        Collections.shuffle(values);//shuffle to add values in a random order
        int median = -1;
        for(int i = 0; i < values.size(); i++){
            median = mf.offer(i);
        }
        assertEquals(50, median);
    }
}
```

### Test Driven or Test First

Normally, of course, I should not write a bunch of tests at a time. With TDD, I should rather write a test that fails, then write enough code to make the test pass. Anyway, let’s forget about TDD for now and say that I am only practicing test first, or whatever.

## Code: simple version

Another thing to clarify is that whether the performance is critical or not? If not, the prograom could be simply like this:

```java
public class MedianFinder {
    private List<Integer> data = new ArrayList<>();

    public int offer(int num){
        data.add(num);
        Collections.sort(data);
        return data.get(data.size() / 2);
    }
}
```

### Performance
If we do care about the performance, however, it is not very efficient to sort the values every time since the existing ones are already sorted before a new value is given. So what we do instead is to find the insert position for the new value and insert it. Finding the insert position should take only O(log(n)) time by using binary search. I wrote a program using recurision, which turned out to be not very difficult to write. Just be careful with the boundary conditions. I was surprised that I did it right in one try, which was rare in my career.

```java
public class MedianFinder {
    private List<Integer> data = new ArrayList<>();

    public int offer(int num) {
        binarySearchAndInsert(num, 0, data.size() - 1);
        return data.get(data.size() / 2);
    }

    private void binarySearchAndInsert(int num, int start, int end) {
        if (start > end){ //can only happen when data is empty?
            data.add(start, num);
        } else if(start == end){
            int index = num > data.get(start) ? start + 1 : start;
            data.add(index, num);
        } else {
            int m = (start + end) / 2;
            if(num > data.get(m)){
                binarySearchAndInsert(num, m + 1, end);
            } else {
                binarySearchAndInsert(num, start, m - 1);
            }
        }
    }
}
```
