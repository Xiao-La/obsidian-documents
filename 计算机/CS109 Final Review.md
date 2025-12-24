
`Scanner`

运算符优先级
 四则>比较>赋值

`++a or a++`

强制转换 `(double)a * b or (double)(a * b)` 

注意 `if` 如果不加花括号的话只看它的下一句
```java
if (a) {
	if (b)
		c;
}
// what if there is not {}
else
	d;
```

注意 `switch` 要有 `break`
```java
switch (a) {
	case A:
		A1;
		A2;
		break;
	case B:
		B1;
		B2;
		break;
	default:
		D;
}
```


逻辑运算符

八大基础类型（int, double, float, byte, short, long, char, boolean）和引用类型

八大基础类型有对应的 Wrapper Classes
`ArrayList<Integer> list = new Arraylist<Integer>();`
`Map<Integer, String>`

数组 `int[] a = new int[10];`

静态方法和类的方法

不能继承 `final` 类

函数中的传参数：基础类型是传值本身，引用类型是传地址

同一个方法不同的签名：method overloading

可变数量参数 `public static double sum(double... numbers)`

文件读写要写 `try catch`

![[CS109-1.png]]

继承 `extends`

多态

父类变量可以放子类对象

接口 `implements`

只能继承一个类，可以实现很多个接口

静态绑定和动态绑定

`instanceof`

```java
public static <T> void printArray(T[] array) {
	for (T element : array) {
		...
	}
}
```

```java
public static <T extends Comparable<T>> T maximum(T a, T b, T c) {
	...
}
```

