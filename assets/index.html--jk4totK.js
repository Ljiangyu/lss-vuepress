import{_ as s,c as n,d as r,a as e,o,r as a}from"./app-Cjt4Wlb7.js";const i="/lss-vuepress/images/digital/image-20241211225727118.png",g="/lss-vuepress/images/digital/image-20241211225845661.png",c="/lss-vuepress/images/digital/image-20241211230115731.png",m={};function l(d,p){const t=a("comment");return o(),n("div",null,[p[0]||(p[0]=r('<h2 id="二、计算机组成" tabindex="-1"><a class="header-anchor" href="#二、计算机组成"><span>二、计算机组成</span></a></h2><h3 id="冯诺依曼计算机模型" tabindex="-1"><a class="header-anchor" href="#冯诺依曼计算机模型"><span>冯诺依曼计算机模型</span></a></h3><p>基于通用图灵机建造的计算机都是在存储器（内存/寄存器）上存储数据。鉴于程序和数据在逻辑上是相同的，因此程序也能存储在计算机的存储器中。</p><p><strong>1</strong>）冯诺依曼模型的四个子系统</p><p>（1）存储器：用来存储数据和程序的区域</p><p>（2）算数逻辑单元（ALU）：用来进行计算（算数运算、逻辑运算、位运算等）的地方。</p><p>（3）控制单元：对存储器、算数逻辑单元、输入/输出等子系统进行控制操作。</p><p>（4）输入/输出单元：输入子系统负责从计算机外部接收输入数据，输出子系统负责将计算机处理结果输出到计算机外部。</p><p><strong>2</strong>）冯诺依曼模型-存储程序概念</p><p>冯诺依曼模型要求程序也必须存储在存储器(内存)中，现代计算机的存储单元用来存储程序和数据，这意味着程序和数据应该有相同的格式，实际上他们都是以位模式（0 和 1）存储在内存中。</p><p><strong>3</strong>）冯诺依曼模型-指令的顺序执行</p><p>冯诺依曼模型中的一段程序是由一组数量有限的指令组成。控制单元从内存中提取一条指令，解释指令，接着执行指令，也就是说指令是一条接着一条顺序执行的</p><h3 id="计算机组成部件" tabindex="-1"><a class="header-anchor" href="#计算机组成部件"><span>计算机组成部件</span></a></h3><p>计算机组成部件可以分为三大类。</p><p>（1）中央处理单元（CPU）</p><p>（2）主存储器（内存）</p><p>（3）输入/输出子系统</p><p><strong>中央处理单元</strong> <strong>CPU</strong></p><p>CPU 用于数据的运算【算数逻辑单元（ALU）、控制单元、寄存器组】。</p><p><strong>CPU</strong> <strong>中的算数逻辑单元</strong></p><p>算数逻辑单元：对数据进行逻辑、移位和算数运算。</p><p>（1）算术运算：整数和浮点数的加减运算。</p><p>（2）位移运算：逻辑移位运算和算术移位运算。</p><p>（3）逻辑运算：非、与、或、异或，这些运算的输入数据为二进制模式，运算结果也</p><p>是二进制模式。</p><p><strong>CPU中的寄存器</strong></p><p>寄存器：用来存放临时数据的高速独立存储单元。</p><p>（1）数据存储寄存器：保存运算的中间结果。</p><p>（2）指令存储器（IR）：CPU 从内存中逐条取出指令，并存储在指令存储器中，解释并执行指令。</p><p>（3）程序计数器（PC）：保存当前正在执行的指令地址，当前指令执行完成后，计数器自动加 1，指向下一条指令的内存地址。</p><p><strong>CPU 控制单元：</strong></p><p>控制单元：控制各个子系统的操作，控制是通过从控制单元到其他子系统的信号来进行的。</p><p><strong>内存</strong></p><p>内存是存储单元的集合，每个存储单元都有唯一的标识，称为地址。数据以“字”的形式在内存中传入传出，字可以是 8 位、16 位、32 位、64 位。如果字是 8 位，一般称为一个字节。</p><p><img src="'+i+'" alt="image-20241211225727118"></p><p><strong>1）内存类型</strong></p><p>主要有两种类型：RAM 和 ROM。</p><p>（1）随机存取存储器（RAM）</p><p>特点：系统断电后，信息（程序或数据）丢失。</p><p>（2）只读存储器（ROM）：里面的数据由制造商写进去，用户只能读不能写</p><p>特点：系统断电数据不会丢失。常用来存储那些在开机时运行的程序。（例如：系统开机时的引导程序）。</p><p><strong>2）存储器的层次</strong></p><p><img src="'+g+'" alt="image-20241211225845661"></p><p><strong>3）高速缓冲存储器</strong></p><p>存储数据的速度比内存快，比寄存器慢。通常容量较小，被置于 CPU 和主存储器（内存之间）。</p><p><strong>4）CPU 和存储器的连接</strong></p><p>CPU 与主存储器之间通常由称为总线的三组线路进行连接。他们分别是：数据总线、地址总线、控制总线。</p><p><strong>输入/输出（I/O）系统</strong></p><p>可以使计算机与外界进行通信，并在断电情况下存储程序和数据，分为两大类：非存储设备和存储设备。</p><p>（1）非存储设备：键盘、鼠标、显示器、打印机等。</p><p>（2）存储设备：也称为辅助存储设备，通常有磁介质和光介质两种。</p><p>特点：便宜，断电后数据不丢失。</p><p><strong>1）I / O 设备的连接</strong></p><p>（1）输入/输出设备不能直接与 CPU 和内存的总线相连接，因为输入/输出设备本质与CPU 和内存的本质不同，输入/输出设备都是<code>磁性或光学设备</code>，而 CPU 和内存是电子设备。与 CPU和内存相比，输入/输出设备的数据读取速度要慢的多，因此必须要有一个中介来处理这种差异，输入/输出控制器。</p><p>（2）输入/输出控制器：连接输入/输出设备到总线上，每一个输入/输出设备都有一个</p><p>特定的控制器。</p><p>（3）I/O设备的连接控制器：控制器清除了输入/输出设备与 CPU以及内存在本质上的</p><p>障碍，控制器可以是串行或并行的设备。</p><p> 串行控制器：只有一根数据线连接在设备上。</p><p> 并行控制器：有多根数据线连接到设备上，一次能同时传送多个位。</p><p>（4）常用控制器：SCSI、火线、USB 和 HDMI。</p><p><strong>程序的执行</strong></p><p>通用计算机使用程序的一系列指令来处理数据，通过执行程序，将输入数据转换为输</p><p>出数据。程序和数据都放在内存中。</p><p>（1）机器周期。</p><p>（2）输入/输出操作。</p><p><strong>程序执行：机器周期</strong></p><p>CPU 利用重复的机器周期来执行程序中的指令，一步一条，从开始到结束。</p><p>一个周期包括 3 步：取指令译码执行。</p><p><img src="'+c+'" alt="image-20241211230115731"></p>',70)),e(t)])}const u=s(m,[["render",l],["__file","index.html.vue"]]),C=JSON.parse('{"path":"/digitalCircuit/7w3y2lkp/","title":"计算机组成","lang":"zh-CN","frontmatter":{"title":"计算机组成","createTime":"2024/12/11 23:03:50","permalink":"/digitalCircuit/7w3y2lkp/"},"headers":[],"readingTime":{"minutes":5.11,"words":1534},"git":{"updatedTime":1733931342000,"contributors":[{"name":"Ljiangyu","email":"104154611+Ljiangyu@users.noreply.github.com","commits":1,"avatar":"https://avatars.githubusercontent.com/Ljiangyu?v=4","url":"https://github.com/Ljiangyu"}]},"filePathRelative":"notes/digitalCircuit/计算机组成.md","bulletin":false}');export{u as comp,C as data};