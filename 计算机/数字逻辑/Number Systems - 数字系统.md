## 导论

信号（Signal）：可表示和用于传递信息。
- 模拟信号（Analog signals）：有各种幅值和频率，连续的
- 数字信号（Digital signals）：二进制的，离散的
比特（Bit）：二进制位，电路中由电压的高低决定。
- 1：HIGH (TRUE)
- 0: LOW (FALSE)
编码（Codes）：比特的组合。
数字系统（Digital Systems）：处理数字信号或数据的系统。
![[Number Systems.png|428]]
Physical Layer -> transistor -> logic gate -> mircroarchitecture -> system

## 数字系统

十进制（Decimal）/ 二进制（Binary） / 八进制（Octal） / 十六进制（Hexadecimal）
![[Number Systems - 数字系统.png|347]]

## 进制转换

### 向十进制转换

若基数（Radix / Base） 为 $r$，则 $n+m$ 位数字
$$
D=d_{n-1}d_{n-2}\dots d_{0}.d_{-1}d_{-2}\dots d_{-m}
$$
的十进制值为
$$
D=\sum_{i=-m}^{n-1} d_{i}r^i
$$

### 从十进制转换

整数部分：不断去除以 $r$ ，考察每次的余数。
小数部分：不断去乘以 $r$，考察每次的整数部分。
MSD (Most-significant Digit)：权重最高的位。
LSD（Least-significant Digit）：权重最低的位。
![[Number Systems - 数字系统-3.png|383]]
![[Number Systems - 数字系统-4.png|386]]

### 其他进制之间转换

二进制转换为八进制或十六进制：直接分组看，八进制就是三位一组，十六进制就是四位一组。
![[Number Systems - 数字系统-5.png|439]]
八个位（bit）就是一个字节（byte）。

十六进制表示（Hexadecimal representation）：两个十六进制位表示一个字节。
![[Number Systems - 数字系统-6.png|219]]
KB 与 B 的转换，是以 1024 为基数：
![[Number Systems - 数字系统-7.png|282]]


## BCD 码

用四个比特来表示一个十进制数位，例如用 0011 1001 0110 表示 396。
用 BCD 码表示的数，加法应该使用十进制的办法来加。
![[Number Systems - 数字系统-8.png|453]]
做减法可以转换为做 10's complement 再加。
![[Number Systems - 数字系统-12.png]]
## 格雷码

最小改变的编码方式：变化到相邻的数，格雷码只变化一位。
![[Number Systems - 数字系统-9.png|214]]

格雷码转二进制：
- 把格雷码的最高位作为二进制的最高位。
- 二进制的次高位：由**二进制的最高位和格雷码的次高位**异或得到。
- 以此类推。
- $B_{n}=G_{n}, B_ {{i-1}} =B_{i}\oplus G_{i-1}$
二进制转格雷码：
- 把二进制的最高位作为格雷码的最高位
- 格雷码的次高位：由**二进制的最高位和二进制的次高位**异或得到。
- 以此类推。
- $G_{n}=B_{n},G_{i-1}=B_{i}\oplus B_{i-1}$

## ASCII 码

American Standard Code for Information Interchange ：编码字符。

## 校验码

Error-Detecting Code：
- 奇偶校验码：提前规定好奇校验/偶校验，放在信息的某一位，代表我 1 的数量是奇数还是偶数，这样可以检验出 1 比特的错误。



## 原码，反码与补码

## 2 进制

为了表示 $0110_{2}$ （$6_{10}$）的相反数：
原码（Signed Magnitude）：符号位+符值： $1|110$，第一位表示符号为负，剩下不变。
反码（1's complement / Diminished radix complement）：$1001$  按位取反。
补码（2's complement / Radix Complement）： $1010$，按位取反再加一。
![[Number Systems - 数字系统-11.png|376]]
一般地，$n$ 位补码可以表示的范围为 $-2^{n-1}\sim 2^{n-1}-1$。
使用补码可以统一表示所有带符号数的加减法，本质上 $n$ 位补码相当于统一在模 $2^n$ 的整数环上做加减法，模运算保持加减法正确。例如，在上表中 $-2_{10}\equiv 14_{10}\equiv 1110_{2} \pmod{16}$。
而十进制中的求对 $2^n$ 的余数，又相当于按位取反再加一（假设 $a'$ 为 $a$ 的反码，$-a$ 为补码）：
$$
a+(-a)-1\equiv 2^{n}-1\equiv a+a'\implies -a=a'+1
$$

## $r$ 进制

同样可以定义：
反码（$(r-1)$ 's complement）： $(r^n-1)-x$
补码（$r$ 's complement）： $r^{n}-x$
计算上，反码相当于每一位都用 $r-1$ 去减掉（按位取反），补码就等于反码加一。
例如，在 $r=10$ 下利用 $10$ 's complement 算减法：
$$
3250-72532
$$
那么 $-72532$ 的补码表示为 $27468$，再加上 $03250$ 得到 $30718$。这是答案的补码表示形式。那么正常的表示方式为再取一次补码，得到 $-69282$。