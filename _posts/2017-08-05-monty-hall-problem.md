---
layout: post
title: 山羊和汽车的问题
description: 山羊还是汽车，这是个问题。
category: articles
tags: 
---
<script type="text/javascript">
    window.addEventListener("load", function(){
        var doors = document.querySelectorAll(".door");
        var prizes = document.querySelectorAll(".prize");
        var opened = false;

        function openDoor(door){
           door.classList.add("open"); 
           door.classList.remove("close"); 
        }

        function closeDoor(door){
           door.classList.add("close"); 
           door.classList.remove("open"); 
        }

        function closeDoors(){
            doors.forEach(closeDoor);
        }

        function openDoors(){
            doors.forEach(openDoor);
        }

        function selectDoor(door){
            deselectDoors();
            door.classList.add("selected");
        }

        function deselectDoors(){
            doors.forEach( function(door, index) {
                door.classList.remove("selected");
            });
        }

        function resetPrizes(){
            prizes.forEach( function(prize, index) {
                prize.classList.remove("goat");
                prize.classList.remove("car");
            });
        }

        function reset(){
            setTimeout(function(){
                resetPrizes();
                deselectDoors();
                closeDoors();
                
            }, 2000);
            opened = false;
        }

        function initPrizes(){
            var prize_classes = ["goat", "goat", "goat"];
            var car_index = parseInt(Math.random() * 3);
            prize_classes[car_index] = "car";
            return prize_classes;
        }

        prizes.forEach( function(prize, index) {
            prize.style.height = getComputedStyle(prize).width;
        });

        doors.forEach( function(door, index) {
            door.addEventListener("click", function(event){
                var selected = event.target;
                selectDoor(selected);

                if(opened){
                    openDoors();
                    reset();
                    return;
                }               

                var prize_classes = initPrizes();
                
                for(var i = 0; i < doors.length; i++){
                    prizes[i].classList.add(prize_classes[i]);
                    if (doors[i] != selected && prize_classes[i] == 'goat' && !opened) {
                        openDoor(doors[i]);
                        opened = true;
                    }
                }
            });
        });
    });

</script>
<style> 
.stage {
    backgroud-color: blue;
    width: 100%;
    height: 100%;
}
.prize {
    width: 30%;
    /*height: 20vw;*/
    margin: 5px;
    background-size: 75%;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid black;
    display: inline-block;
}

.goat {
    background-image: url(" /images/goat.png");
}

.car {
    background-image: url("/images/car.png");
}

.door {
    width: 100%;
    height: 100%;
    background-color: orange;
    background-image: url("/images/question_mark.png");
    background-size: 75%;
    background-repeat: no-repeat;
    background-position: center;
}

.open {
    animation-name: open_animation;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.close {
    animation-name: close_animation;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.door:hover {
    cursor: pointer;
}

.selected {
    /*outline: LightBlue;
    outline-style: dashed;*/
    background-color: red;
}

.result {
    background-color: #2ECC71;
    height: 30px;
    width: 50px;
    margin: 2px;
    display: inline-block;
}

/* Standard syntax */
@keyframes open_animation {
    from {height: 100%;}
    to {height: 0;}
}

@keyframes close_animation {
    from {height: 0;}
    to {height: 100%;}
}
</style>

有这么一个游戏：

> 三个门后面藏了两只山羊和一辆汽车，你选一个门，并得到门背后的东西。你选定了之后，主持人帮你打开了剩下的两个门中的一个（他知道汽车在哪），门背后是一只山羊。这个时候，你可以换一个门，也可以不换。问题是，要想得到汽车，该不该换？

![](/images/goat-car-problem.png)

初看起来，似乎很简单，剩下两个门，每个门后面是车子的概率各是一半，换不换似乎没什么差别。

是这样吗？稍微换一下规则，如果有100个门呢？主持人帮你打开了98个山羊门，那概率是不是奇迹般地从最初的1/100上升到了1/2呢？而且，似乎一开始选哪个门似乎根本就不重要，主持人总是有办法打开98个山羊门（因为他知道车在哪，但故意不开车的门），从而把概率变成1/2。

或者更进一步说，不管一开始有几个门，也不管你选的是哪一个，得到汽车的概率始终是1/2。

你的运气好像有点好过头了！

还是回到3个门的情形。一开始的时候，随机选中汽车的概率是1/3，这似乎没有什么争议。如果你坚持原来的选择，无论主持人开了几个山羊门，你赢的概率并不会因此而增加——他不过是在耍你罢了。那，如果你换一个门呢？赢的概率是多少？答案是——2/3！所以，你应该选择换一个门。

我知道，这可能难以说服你。不妨先做个试验验证一下：

> 找来一个朋友，3个杯子，一枚硬币。你扮演主持人。让你的朋友闭上眼睛，你把硬币偷偷放到一个杯子下面，然后叫你的朋友睁开眼睛，选择一个杯子。这个时候你帮他打开一个空杯子，问他要不要换。你的朋友可以尝试不同的策略，坚持换或坚持不换，例如各30次，看看赢的概率各是多少。

如果你像我一样，没有什么朋友，那么你可以选择和电脑玩这个游戏。规则大致相同：

> 你选定一个方块，然后另一个方块会自动打开（隐藏的是山羊），你再次选择剩下的两个门中的一个将显示结果。下面就是这个游戏，可以玩的，试试吧。

  <div class="prize">
      <div class="door"></div>
  </div>
  
  <div class="prize">
      <div class="door"></div>
  </div>
  
  <div class="prize">
      <div class="door"></div>
  </div>


如果你的实验结果显示，换门的确可以将几率增加一倍，但你还是没有想通为什么，你可以这么想：如果你不换选择，那么相当于你只选了一扇门；而如果你换选择，其实相当于主持人给了你剩下的两扇门——即使你开错了门，就像主持人做的那样，你还可以选择另外一道门。还有一种理解的方式是，你换门且输掉汽车的唯一可能性，就是你一开始就选中了汽车，这个概率是1/3。

这个游戏有一个前提，就是主持人是知道车在哪的，但是他打开的始终都是山羊的门。如果主持人也不知道山羊在哪呢？那他也有可能打开汽车的门，这个时候游戏结束，其它规则和前面相同。这种情况下，换或不换的概率是不变的，都是1/2（主持人打开了车的门的情况不计入内）。我写了一个Python程序来验证了这一点。

```python
import random

gates = ['goat', 'goat', 'car']
stay = 0
switch = 0
for i in range(1000):
    random.shuffle(gates)
    # assume guest chooses always gate 0, and host opens gate 2;
    # this does not change anything as the gates have been shuffled
    if gates[2] == 'car':  # host's choice
        continue
    if gates[0] == 'car':  # guest's choice and guest stays
        stay += 1
    else:  # switched choice
        switch += 1
print stay, switch
```

为了模拟最开始说的那种情形（主持人知道车在哪并且只打开山羊门），我也写了一个程序来验证：
```python
gates = ['goat'] * 3
stay = 0
switch = 0
choices = range(3)  # same as [0, 1, 2]
for i in range(1000):
    # hide a car behind the gate randomly
    car_choice = random.choice(choices)  # same as random.randint(0, 3)
    gates[car_choice] = 'car'

    # guest makes his choice
    guest_choice = random.choice(choices)

    # host cannot choose the car or the gate selected by the guest, so remove them(they can be the same)
    host_choices = range(3)
    host_choices.remove(car_choice)
    if guest_choice in host_choices:
        host_choices.remove(guest_choice)
    host_choice = random.choice(host_choices)

    # if guest changes his choice, it means he cannot choose the one he or the host has chosen, remove them
    guest_changed_choice = range(3)
    guest_changed_choice.remove(guest_choice)
    guest_changed_choice.remove(host_choice)
    guest_changed_choice = guest_changed_choice[0]  # the only one left

    if guest_choice == car_choice:
        stay += 1
    if guest_changed_choice == car_choice:
        switch += 1
        
print stay, switch
```

以上两个程序的最后一次运行结果分别是，程序1：343 333。程序2：352 648。对了，这个游戏正式的名称叫：Monty Hall Problem。







