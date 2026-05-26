## 几何光学（Geometrical Optics）

 **光在介质中的传播**
*   **折射率：** $n = \frac{c}{v}$ (光在介质中变慢，$n \ge 1$)
*   **波长变化：** 进入介质后频率 $f$ 不变，波长变短：$\lambda = \frac{\lambda_{air}}{n}$

**反射与折射基本定律**
*   **反射定律：** 入射角 $=$ 反射角 ($\theta_i = \theta_r$)
*   **斯涅尔定律 (折射定律)：** 
    $$ n_1 \sin\theta_1 = n_2 \sin\theta_2 $$
    *(注：角度均为光线与法线的夹角)*
*   **费马原理：** 光传播的路径是“耗时最短”的路径。

**全反射 (Total Internal Reflection)**
*   **条件：** 光由**光密射向光疏**介质 ($n_1 > n_2$)。
*   **临界角(Critical Angle)：** 当折射角为 $90^\circ$ 时的入射角。
    $$ \theta_c = \sin^{-1}(\frac{n_2}{n_1}) $$

**反射偏振与布儒斯特角 (Brewster's angle)**
*   **现象：** 非偏振光在界面反射时，反射光通常为部分偏振。
*   **布儒斯特角 $\theta_B$：** 特定的入射角，使得**反射光变为完全的线偏振光** (纯 S 偏振，垂直于入射面)。
*   **几何特征：** 此时反射光线与折射光线相互垂直，即 $\theta_B + \theta_r = 90^\circ$。
*   **布儒斯特公式：**
    $$ \theta_B = \tan^{-1}(\frac{n_b}{n_a}) $$
    *(其中 $n_a$ 为入射介质，$n_b$ 为折射介质)*

### 干涉 (Inference)

1.  **相干波条件：** 相同频率 ($\omega$)、相同振动方向、恒定相位差。
2.  **光程 (Optical Path)：**
    $$ \text{光程} = n \cdot L $$
    *(折射率 $\times$ 几何路程，等效于光在真空中传播的距离)*
3.  **相位差 ($\Delta\phi$) 与光程差 ($\delta$) 的转换关系：**
    $$ \Delta\phi = \frac{2\pi}{\lambda} \cdot (n_1 L_1 - n_2 L_2) = \frac{2\pi}{\lambda} \cdot \delta $$
    *(注：$\lambda$ 始终代指光在真空中的波长)*

>  推导：将电磁波写成 $E_{p}=E_{1}+E_{2}$ （矢量），$E=\cos(kL-\omega t+\phi)$：![[Optics - 光学.png]]
>  这里 $\Delta \phi=k_{1}L_{1}-k_{2}L_{2}=\frac{2\pi}{\lambda_{1}}L_{1}-\frac{2\pi}{\lambda_{2}}L_{2}=\frac{2\pi}{\lambda}(n_{1}L_{1}-n_{2}L_{2})$，其中 $\lambda$ 为真空中的波长。
>  那么从上面的图可以得到 $E_{p}=2E_{0}\cos \frac{\Delta \phi}{2}$，进而 $I_{P}=4I_{0}\cos ^{2} \frac{\Delta \phi}{2}$

判定某点是亮条纹还是暗条纹，直接计算两束光到达该点的**光程差** $(n_1 L_1 - n_2 L_2)$：

*   **相长干涉 (Constructive, 亮纹)：**
    $$ n_1 L_1 - n_2 L_2 = m\lambda \quad (m = 0, 1, 2, ...) $$
    *相位差对应为：$\Delta\phi = m \times 2\pi$*

*   **相消干涉 (Destructive, 暗纹)：**
    $$ n_1 L_1 - n_2 L_2 = (m + \frac{1}{2})\lambda \quad (m = 0, 1, 2, ...) $$
    *相位差对应为：$\Delta\phi = (m + \frac{1}{2}) \times 2\pi$*

如果杨氏双缝等实验整个装置都在空气（近似认为 $n_1 = n_2 = 1$）中进行，
则**光程差就等于几何路程差**：
$$ \delta = L_1 - L_2 = \Delta L $$
此时发生干涉的条件直接由几何路径差决定。

**光程和光程差**
*   **物理本质：** 介质折射率大 $\rightarrow$ 光速变慢 $\rightarrow$ 波长变短 $\rightarrow$ 在相同厚度 $L$ 内包含的“波长个数”变多。
*   **波数公式：** 距离 $L$ 内包含的波的个数 $N = \frac{L \cdot n}{\lambda_{vac}}$ （分子 $L \cdot n$ 即为光程）。
*   相位差 $\Delta\phi$ 的计算：取决于两束光包含的波数之差。
    *   公式：$\frac{\Delta\phi}{2\pi} = \Delta N = \frac{L(n_2 - n_1)}{\lambda_{vac}}$
    *   **实用技巧：** 干涉结果只取决于波数差的**小数部分**（例如相差 3.6 个波，只看 0.6）。

**杨氏双缝干涉实验 (Young's Double-Slit)**
*   **目的：** 获得两束相干光，观察光的干涉现象。
*   **实现相干的方法：** **分波前法**。用一个单缝 $S_0$ 照射两个距离很近的狭缝 $S_1, S_2$，使得 $S_1, S_2$ 成为频率相同、初相位相同的两个相干次波源。
*   **屏幕干涉图样：** 形成平行的明暗相间条纹。
    *   **亮条纹 (Constructive)：** 波前同相到达，相互加强。条件是光程差 $\delta = m\lambda$。
    *   **暗条纹 (Destructive)：** 波前反相到达，相互抵消。条件是光程差 $\delta = (m + \frac{1}{2})\lambda$。
*   **关键尺寸量级考点：** 缝宽及波长通常在微米 ($\mu\text{m}$) 级，缝间距数十到上百微米，而屏幕距离通常在米 ($\text{m}$) 级。（满足远场近似条件）。
![[Optics - 光学-1.png]]

**路径差公式的几何推导 (关键前提: $D \gg d$)**
当屏幕很远时，两束光线近似平行。
由缝距 $d$ 与出射角 $\theta$ 构成的直角三角形得出几何路径差：
$$ \Delta L = d \sin\theta $$

*   **第 $m$ 级明纹 (Bright):** 
    $$ d \sin\theta = m\lambda \quad (m = 0, 1, 2, \dots) $$
    *(求角度: $\theta = \arcsin(\frac{m\lambda}{d})$) *
*   **第 $m$ 级暗纹 (Dark):** 
    $$ d \sin\theta = (m + \frac{1}{2})\lambda \quad (m = 0, 1, 2, \dots) $$
    *(注意：$m=1$ 是第二暗纹，因为它从 $m=0$ 的第一暗纹开始算)*

小角度近似：$\sin\theta =\tan\theta=\frac{y}{D}$

![[Optics - 光学-2.png|333]]
![[Optics - 光学-3.png|357]]
利用相量法 (两个同幅矢量夹角为 $\phi$) 推导合成光强。
*   **合电场振幅：** $E = 2E_0 \cos(\frac{\phi}{2})$
*   **总光强公式：** 
    $$ I = 4I_0 \cos^2\left(\frac{\phi}{2}\right) $$
    *(其中 $I_0$ 是单缝的光强，最大光强为 $4I_0$)*
*   **从屏幕几何角度 $\theta$ 计算相位差 $\phi$：**
    $$ \phi = \frac{2\pi}{\lambda} (d \sin\theta) $$

### 薄膜干涉

**半波损失 (Phase Shift on Reflection)**
判定反射光是否发生相位突变，只看一点：光是否在“更密”的介质表面“碰壁”反弹。
*   **$n_{入射} < n_{反射面}$ (光疏射向光密)：** 反射光有半波损失（相位突变 $\pi$，等效光程 $\pm \frac{\lambda}{2}$）。
*   **$n_{入射} > n_{反射面}$ (光密射向光疏)：** 反射光**无**半波损失（相位不变）。

**垂直入射时的总光程差公式**
垂直入射（或小角度入射）时，薄膜内部折返的几何距离近似为厚度的两倍：$2L$。
$$ \text{总光程差} \Delta L = 2L n_{薄膜} \pm \Delta_{附加} $$
*(需分别判断上下表面是否发生半波损失来确定 $\Delta_{附加}$ 是否为 $\frac{\lambda}{2}$)*

![[Optics - 光学-4.png|291]]

**特定条件下的薄膜极值公式** 
**适用条件：** $n_1 > n_2 < n_3$ 或 $n_1 < n_2 > n_3$ (即**有且仅有一侧**发生半波损失)。
因为有一侧的波反相了，所以导致干涉条件的明暗公式和常规情况**颠倒**：

1.  **相长干涉 (Constructive / 亮纹) :**
    $$ 2L \cdot n_2 = \left(m + \frac{1}{2}\right)\lambda \Rightarrow 2L = \left(m + \frac{1}{2}\right)\frac{\lambda}{n_2} \quad (m=0,1,2...) $$
2.  **相消干涉 (Destructive / 暗纹) :**
    $$ 2L \cdot n_2 = m\lambda \Rightarrow 2L = m\frac{\lambda}{n_2} \quad (m=0,1,2...) $$
 **超薄膜极限 ($L \ll \lambda$)**
*   **条件：** 厚度 $L$ 极小，路径光程差 $2L n_2 \rightarrow 0$。
*   **现象：** 如果符合上文“单侧半波损失”的条件，总光程差仅剩 $\frac{\lambda}{2}$。此时两波必定反相叠加。
*   **结论：** 极薄膜在此条件下必定发生**相消干涉**（看起来是暗/黑的）。

注意：上述的干涉为反射光的，若考虑透射光，那么由于能量守恒定律，反射光最弱相当于透射光最强，所以结论是相反的。
## 衍射

### 单缝衍射

不同于双缝干涉，单缝衍射考虑的是**一个宽度为 $a$ 的狭缝内无数次波的相互叠加**。
*   **狭缝宽度：** $a$
*   **上下边缘光束的光程差：** $\Delta L = a \sin\theta$
*   **上下边缘光束的相位差：** $\beta = \frac{2\pi}{\lambda} a \sin\theta$
*   **常用无量纲参数：** $\alpha = \frac{\beta}{2} = \frac{\pi a \sin\theta}{\lambda}$
![[Optics - 光学-6.png|448]]
![[Optics - 光学-5.png]]

**易错：** 单缝衍射的 $a \sin\theta = m\lambda$ 算出的是**暗纹**！（双缝干涉中 $d \sin\theta = m\lambda$ 算出的是亮纹）。
*   **公式：** $$ \sin\theta = \frac{m\lambda}{a} $$
*   **取值要求：** $m = \pm 1, \pm 2, \pm 3, \dots$ **(绝对没有 $m=0$)**。
*   **中央明纹特点：** 位于由 $m=-1$ 和 $m=+1$ 两个暗纹夹住的区域内，比其他任何旁瓣都要宽一倍，且亮度极高。
* 小角度近似（$\theta=\sin\theta$）

基于相量链条卷曲成圆弧的几何关系推导出整体的光强分布函数 $\text{sinc}^2(\alpha)$：
$$ I = I_0 \left[ \frac{\sin(\beta/2)}{\beta/2} \right]^2 = I_0 \left[ \frac{\sin\alpha}{\alpha} \right]^2 $$
*（注：当 $\theta \to 0$ 时，$\alpha \to 0$。根据数学极限 $\lim_{\alpha \to 0}\frac{\sin\alpha}{\alpha} = 1$，算出中央最大光强即为 $I_0$）*

狭缝越窄，衍射现象越明显（光散得越开）。
1.  **极宽极限 ($a \gg \lambda$)：** 衍射角极小，不发生明显的衍射散布，光斑与狭缝形状一致，退化为**几何光学**直线传播。
2.  **极窄极限 ($a \approx \lambda$)：** 第一暗纹在 $90^{\circ}$，中央明纹无限宽敞，充满背后的整个空间。
这里为你整理的光学重点复习笔记，涵盖了相图原理、单缝衍射计算以及实际双缝干涉（缺级现象）。

### 双缝干涉+衍射

理想双缝假设缝很窄；真实的双缝具有宽度 $a$，会引发单缝衍射的调制。

*   **核心图像概念：** 真实的双缝图案本质上是 **“干涉纹被包在衍射轮廓之中”**。
*   **总光强组合公式：**
    $$ I(\theta) = I_m \cdot \underbrace{(\cos^2 \beta)}_{\text{理想双缝干涉}} \cdot \underbrace{\left(\frac{\sin\alpha}{\alpha}\right)^2}_{\text{单缝衍射 (包络线)}}$$
    *   $\beta = \frac{\pi d \sin\theta}{\lambda}$ （其中 $d$ 为双缝间距）
    *   $\alpha = \frac{\pi a \sin\theta}{\lambda}$ （其中 $a$ 为单缝宽度）
*   缺级现象分析
    当本该出现**干涉极大值**的地方，碰巧是**单缝衍射的极小值（暗纹=光强归零）** 时，该级干涉明纹将消失不显示。
    *   干涉明纹条件：$d \sin\theta = m_i \lambda$
    *   衍射暗纹条件：$a \sin\theta = m_d \lambda$
    *   **缺级条件公式：** 联立二者消去 $\sin\theta/\lambda$，得到关系式：
        $$ m_i = \frac{d}{a} m_d  \quad (m_d = 1, 2, 3 \dots)$$
        *例如：若缝距是缝宽的 4 倍（$d=4a$），则代入 $m_d = 1, 2, 3$ 后可得，$m_i = 4, 8, 12 \dots$ 级的明纹会消失。*
    ![[Optics - 光学-7.png|290]]
### 圆孔衍射

这两张幻灯片进入了波动光学中非常实用、也是考试必考的一个知识点：**圆孔衍射（Circular Aperture Diffraction）与分辨本领（Resolvability）**。

与矩形单缝不同，光波通过圆形孔径时，会在屏幕上形成中心高亮、周围环绕极弱同心亮环的衍射图样。
*   **爱里斑 (Airy Disk):** 衍射图样中央最亮、最大的圆斑。
*   **第一级暗环的位置公式:**
    $$ \sin\theta = 1.22 \frac{\lambda}{d} $$
    *(其中，$d$ 为圆孔的直径，$\lambda$ 为光波长，$\theta$ 为圆孔中心到第一暗环的夹角)*
    **注意：** 因为 $\theta$ 通常极小（如望远镜看星星），根据小角度近似，公式常写作：
    $$ \theta \approx 1.22 \frac{\lambda}{d} \quad \text{(单位：弧度 rad)} $$

由于圆孔衍射（爱里斑）的存在，任何光学仪器（人眼、显微镜、望远镜）都无法将空间靠得极近的两个物点完美清晰地分开。

*   **瑞利判据 (临界条件):**
    当且仅当光源 S1 的**中央主极大**，与光源 S2 的**第一级衍射极小（暗环）** 完全重合时，这两个物体被认为是**恰能被分辨的 (just resolved)**。

*   **最小分辨角 (Minimum Resolvable Angle) 公式:**
    $$ \theta_{min} = 1.22 \frac{\lambda}{d} $$
    这是仪器能够分辨的两个物点对镜心所张的最小角距离。

假设两个实际点光源之间对圆孔的夹角（角距离）为 $\theta_{actual}$：
1.  **$\theta_{actual} > \theta_{min}$** $\longrightarrow$ **能分辨 (Resolved)**
2.  **$\theta_{actual} = \theta_{min}$** $\longrightarrow$ **恰能分辨 (Just resolved)** *(符合瑞利判据)*
3.  **$\theta_{actual} < \theta_{min}$** $\longrightarrow$ **不能分辨 (Unresolved)** *(爱里斑严重重叠)*

要想看清极其微小的细节，必须让最小分辨角 $\theta_{min}$ 尽可能地**小**：
1.  **增大直径 $d$：** 为什么天文台要把望远镜口径做得越来越大？（不仅为了聚光，更是为了减小衍射角，提高分辨率）。第一张 PPT 底部的图证明了：Large aperture（大孔径）的衍射图变得非常小而清晰。
2.  **减小波长 $\lambda$：** 光学显微镜放大倍数有极限（受可见光波长 $400-700\text{nm}$ 限制）。要想看清病毒或原子，必须使用电子显微镜（电子束具有极短的物质波波长，极其微小，分辨率极高）。