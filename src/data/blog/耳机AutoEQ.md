---
title: 耳机AutoEQ优化教程
description: 从软件层面优化耳机使用体验
pubDatetime: 2025-10-09T23:20:28+08:00
category: "article"
tags: 
  - 耳机
---

# 背景

最近我购入了一台兴戈EP5耳机，用来听音乐和打游戏。在听音乐的过程中，我发现这台耳机在低频的表现很优秀，但是在高频，尤其是女中高音，就显得有些“糊”，也就是音乐各部分的分离度不够。

网上提供的解决方案有两种，一种是购入更好的硬件，比如耳机、功放、声卡，但是耗费不菲；另一种是从软件层面调整频响曲线，也就是我下面要分享的`AutoEQ`。

# 什么是`AutoEQ`

[AutoEQ](https://github.com/jaakkopasanen/AutoEq)是一个用于均衡耳机的工具，使其频响曲线更加贴近某个标准曲线（如哈曼曲线）。虽然该项目对开发者和技术人员有很多好处，但对大多数人来说，主要的吸引力是为1400多个耳机型号预先计算的均衡器设置。只需搜索自己的耳机型号，下载相应的配置文件，并在均衡器中进行配置，即可获得更好的声音体验。

`AutoEQ`本身并不做实时均衡，而是产生可以在各种均衡器应用程序中使用的设置。`AutoEQ`的预计算结果包括参数化均衡器参数、标准的10段图形均衡器级别和基于卷积的均衡器的脉冲响应。这些都意味着基本上涵盖了所有的平台和设备。

# 优化教程

## 下载配置文件

访问[AutoEQ官网](https://www.autoeq.app/)，在`Select headphones`栏选择你的耳机型号，在`Select equalizer app`栏选择`Equalizer APO GraphicEq`，即得到相应的配置文件，点击页面中的下载按钮下载为`txt`文件。

## 安装配置`Equalizer APO x64 1.4`

从[下载链接](https://sourceforge.net/projects/equalizerapo/files/1.4.2/EqualizerAPO-x64-1.4.2.exe/download)处下载`Equalizer APO`，进入安装程序。

进入设备选择界面时，将下面`Troblesshooting`部分打勾。

![trouble shooting](https://i0.hdslb.com/bfs/new_dyn/913d018eeefaf0f94f115d5e2c5b6fa1276494267.jpg@1192w.avif)

然后在`Playback devices`栏勾选你的播放设备，点击`OK`，之后会弹出驱动注入界面。出现两个绿色背景的对号时，注入成功。

![驱动注入](https://i0.hdslb.com/bfs/new_dyn/ca4809a06b96a51c005e0a446ba20f46276494267.jpg@750w_706h.avif)

将从`AutoEQ`上下载的`txt`文件复制到`Equalizer APO`目录下的`config`文件夹里，打开根目录下的`Editor.exe`。选择相应的`txt`文件，并点击启动按钮，则设置完毕。以后除非修改设置，不需要再打开该软件。

![Equalizer APO设置](https://edgeone.51shazhu.com/autoupload/f/_gJdWWHL4igSoPS2NFUDfH77jU67v1q_jyjUhnq6It6yl5f0KlZfm6UsKj-HyTuv/20251009/W5XV/1530X1026/equalizer%E8%AE%BE%E7%BD%AE.png/webp)	