---
title:      "使用 Chrome ＋ WebVPN 5分钟学会翻墙"
layout:     posts
permalink:  "blog/Using-Chrome-and-WebVPN-to-Learn-Scaling-GFW-in-5-Minutes.html"
categories: 'blogs'
---


# 使用 Chrome + WebVPN 5分钟学会翻墙

---------------------------------

&#8226; 免客户端 (Chrome 就是客户端) &#8226; 设置简单 &#8226; 基本免后期维护 &#8226; 墙内外流量按域名分流 &#8226; 墙内视频网站速度不受影响 &#8226; 适用浏览所有网站 &#8226; 不用担心中间人攻击 &#8226; 反防火墙封锁能力超强（无论是 GFW 还是公司防火墙）


#（几乎）完美替代 ssh 

--------

不少网友通过 SSH(Tunnelier/Entunnel) + Chrome + SwitchySharp + GFWList 来翻墙。WebVPN 省略了 SSH 那个部分。另外，使用 GFW 白名单来替代 GFWList 黑名单，进一步降低了维护的要求。

如果 GFW 分析 ssh 的翻墙流量，就会发现这些 ssh 流量有 http 的特征，从而引发警报。随着 GFW 完全封锁 OpenVPN 后，开始将目标转向 ssh，推特上已有传闻 ssh 被封。

WebVPN 使用标准的 https 来封装访问墙外网站的 http 流量，在 GFW 看来这和普通的网站访问流量是完全一样的。这方面伪装能力使 WebVPN 的生存能力大大高于 pptp/l2tp/ipsec/ssh/openvpn 等等协议特征明显的翻墙方式。

为什么只是*几乎*完美呢？因为现在 WebVPN 只适用于 PC，Mac 和 Linux 等桌面版的 Chrome。Android 的客户端还没有开发出来。iOS 客户端的可行性暂时还不清楚。


# 5 分钟翻墙图解指南

----------

从此设置困难不再是不翻墙的借口了。

首先准备好“地下铁路”提供的 pac 文件 的 URL，其格式如下，当然具体内容是完全不一样的。下面的图解以此 URL 为例，用户在设置时，请用“地下铁路”提供的 URL 替代。

```
https://123.456.789.0:1234/info/abcdef.pac
```

## (1) 安装 Chrome 和 SwitchySharp （2分钟）

这一步本来可以略过不提。但是，可能由于五毛搞鬼，SwithySharp 在 Chrome Web Store 上找不到了。所以需要翻墙后在 Google 上搜了。“地下铁路”的服务器上也保存了一份。

![Google SwitchySharp](http://i.imgur.com/snbir.png)


## (2) 导入服务器的证书 （1分钟）

将“地下铁路”提供的 URL 的一部分：

```
https://123.456.789.0:1234/info/
```

在 Safari （Mac） 或 IE （Windows）打开。

然后，通过下图中的 3 步，将证书添加到 Mac 或 Windows 中，完成后再次打开这个 URL 不应该再有安全提示。

![Safari 证书 1](http://i.imgur.com/zDPRg.png)

![Safari 证书 2](http://i.imgur.com/0qOxb.png)


***注意***

* 这一步不可以用 Chrome 来做，因为 Chrome 不能添加证书。
* 每次服务器更新后，这一步必须且只需要做一次。
* 需要这一步是因为“地下铁路”没有购买证书，这只跟相关服务器的认证有关，不会影响用户的上网安全。

## (3) SwitchySharp 设置（1分钟）

将“地下铁路”提供的完整的 pac 文件的 URL 贴入到 SwitchySharp 中，然后保存。格式如下：

```
https://123.456.789.0:1234/info/abcdef.pac
```

![SwitchySharp 设置](http://i.imgur.com/WCYw9.png)

出于稳定性的考虑，“地下铁路”的 pac 文件是一个 [GFW 白名单](https://github.com/n0wa11/gfw_whitelist)，并且已经设置好代理服务器地址。

题外话，如果网友想要自己编写 pac 文件，可以下载后更改，SwitchySharp 可以直接从硬盘上读取。不过，这是 5 分钟教程之外的内容了。

![SwitchySharp 设置](http://i.imgur.com/K7VSN.png)


## (4) 开始翻墙（1分钟）

在 SwitchySharp 的菜单中，选择刚才的那个翻墙设置。第一个先访问一下 [whatismyip.com](whatismyip.com)，确认显示的 ip 地址是服务器的 ip 地址，而不是本地的 ip 地址。

如果使用“地下铁路”的 WebVPN 服务，还需要输入用户名和密码。

![开始翻墙](http://i.imgur.com/IXNqi.png)

一切正常，恭喜你设置完成了。将来除非服务器变化或者重装 Chrome，用户端不需要做任何设置的，完全感觉不到墙的存在。


# 常见的问题和原因

----------

## 没有错误信息，但就是不能翻墙

这通常是因为（1）pac 文件 URL 有错（2）pac 文件中给的代理地址有错 或者（3）pac 文件的语法有错。这种情况下，Chrome 就会忽略代理设置，而直接连接网络。

排查问题时，在 Chrome 的地址栏输入如下 URL。Chrome 会列出当前使用的代理。

```
chrome://net-internals/#proxy
```

设置正确的话，`Effective settings` 和 `Original settings` 都应该是用户在第 3 步输入的那个 URL 。

![proxy](http://i.imgur.com/AGZJJ.png)


### pac 文件 URL 有错

下图中，Chrome 在 “Original settings” 一栏中没有找到 pac 文件， 原因是第 3 步中输入的 URL 有错。

![pac 错误1](http://i.imgur.com/JzrfD.png)


### Chrome 不能读入 pac 文件

下图中，Chrome 找到了 pac 文件，但是没有生效，原因很多，而且 Chrome 也不给出明确的信息。根据作者的经验，有以下几种可能：

* 第 2 步中证书没有成功导入。
* pac 文件的语法有错，Chrome 似乎不接受有些别处合规的 pac 语法。
* Chrome 只读取一次 pac 文件，然后将规则和代理服务器地址纪录在缓存中，所以即使更正问题后，可能需要点击几次 `Re-apply settings`，`Clear bad proxies` 或者重启 Chrome 。

![pac 错误2](http://i.imgur.com/7iPjB.png)



## 代理服务器证书有错

“地下铁路”将 pac 文件放在代理服务器上，如果用户将 pac 文件和代理服务器分开，第 2 步的证书导入需要对 pac 文件服务器和代理服务器分别操作。

如果代理服务器的证书有问题，Chrome 会给出如下错误信息。

![proxy cert](http://i.imgur.com/Sritx.png)


# 其它节省流量的方法

----------------

由于白名单的流量消耗较黑名单要高一些，在浏览器中安装下面的扩展，在提高网页浏览速度的同时，也能节省不少流量。

## 屏蔽广告： Adblock Plus ＋ Easylist ＋ Chinalist

在 Firefox 或 Chrome 中安装 [Adblock Plus](http://adblockplus.org/en/) (ABP) 扩展，并在 ABP 的控制面板中加入 Easylist 和 [Chinalist](http://code.google.com/p/adblock-chinalist/)。这样可以有效的过滤广告大部分网站和网页。

`注意`：下载扩展和 ChinaList 的时候可能需要打开全局翻墙的 VPN 。

## 屏蔽Flash： FlashControl 或 FlashBlock

在 Chrome 中安装 [FlashControl](https://chrome.google.com/webstore/detail/flashcontrol/mfidmkgnfgnkihnjeklbekckimkipmoe) 或在 Firefox 中安装 [FlashBlock](https://addons.mozilla.org/zh-cn/firefox/addon/flashblock/)，可以达到屏蔽 Flash 的效果。需要打开 Flash，比如视频，只要在被屏蔽的 Flash 上点击一次。

![Chrome 的扩展](http://i.imgur.com/VfMUA.png)
