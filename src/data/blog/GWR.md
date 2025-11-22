---
title: GWR学习笔记
description: 地理加权回归模型的学习笔记
pubDatetime: 2025-11-22T13:49:31+08:00
category: "article"
tags: 
  - GWR
---

# 背景

##空间异质性

 空间异质性指 “不同地方的规律是不一样的。”

它描述的是地理现象在空间分布上的不均匀性或非平稳性。即：变量之间的关系或变量本身的属性，会随着地理位置的变化而变化。

## 普通线性回归的局限性

普通的线性回归模型无法拟合变量的空间异质性，也就是说随着地理位置的变化，系数$\beta_i$会发生变化。

# GWR

## 公式

$$
\hat{y}=\beta_{0,i}+\Sigma^p_{k=1} \beta_{k, i}x_{k, i}+\epsilon_i, i=1, 2, ..., n
$$

## 参数估计

由于空间异质性的影响，每个数据点对应的回归参数都是不同的，未知参数的个数$n\times (p+1)$远大于观测数n。所以无法直接使用最小二乘法。

在此背景下，Brunsdon提出了提出一种非参数光滑方法：假设回归参数随空间的变化是光滑的，局部的数据点是极为相似的。因此在估计采样点i的回归参数时，以采样点i及其某个邻域内的所有采样点构成局域子样，在子样中建立全局线性回归模型，使用最小二乘法估计回归参数。

根据加权最小二乘法，点i处的回归参数由使
$$
\Sigma^n_{j=1}w_{ij}(y_i-\beta_{0, i}-\Sigma^p_{k=1}\beta_{k, i}x_i)^2
$$
最小来确定，这里$w_{ij}$为估计采样点i的回归参数时，其它采样点j的权重。

则回归参数估计
$$
\hat{\beta}=(X'W_iX)^{-1}X'W_iy
$$


## 权函数的选择

  常用的权函数有Gauss函数和bi-square函数。

- Gauss函数：$w_{ij}=exp(-(d_{ij}/b)^2)$
- 截尾型函数：$w_{ij}=\begin{cases}   [1-(d_{ij}/b)^2]^2, d_{ij}\leq b,\\   0, d_{ij}>b   \end{cases}   $

## 权函数带宽的优化

根据覃文忠（2007），在实际应用中，地理加权回归对Gauss和bi-square等权函数的选择不太敏感，而对特定权函数的带宽很敏感。带宽过大会造成参数估计的偏差过大，带宽过小导致方差过大。因此需要寻找一个折中值。

### 交叉验证方法

$$
CV=\frac1n\Sigma^n_{i=1}[y_i-\hat{y}_{\neq i}(b)]^2
$$



## 广义交叉验证方法

$$
GCV=\frac1n \frac{\Sigma^n_{i=1}[y_i-\hat{y}_{\neq i}(b)]^2}{[1-tr(S(b))/n]^2}=\frac{n\Sigma^n_{i=1}[y_i-\hat{y}_{\neq i}(b)]^2}{[n-tr(S(b))]^2}
$$



### AIC准则

​	  定义$AIC=-2lnL(\hat{\theta_L}, x)+q=nln(RSS)+2q$，其中$\hat{\theta_L}$为$\theta$的极大似然估计，q为未知参数的个数，RSS为残差平方和。现在AIC是似然函数的对数乘以-2再加上惩罚因子，因而选择使AIC达到最小的模型为 “ 最优 ” 模型

### 贝叶斯信息准则

BIC准则与AIC准则非常相似，只是惩罚因子不同。其公式为
$$
BIC=-2lnL(\hat{\theta_L}, x)+qlnn
$$


# 参考文献

地理加权回归基本理论与应用研究-覃文忠

Geographically Weighted Regression: A Method for Exploring Spatial Nonstationarity-Brunsdon